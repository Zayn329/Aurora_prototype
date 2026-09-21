import os
from typing import List, Dict, Any
from pydantic import BaseModel
import chromadb

CHROMA_DB_DIR = os.getenv("CHROMA_PERSIST_DIRECTORY", "./data/chromadb")


class SOPCitation(BaseModel):
    document: str
    chunk_index: int
    relevance_score: float
    snippet: str


class RAGSearchResult(BaseModel):
    query: str
    citations: List[SOPCitation]
    combined_context: str


class SOPRetriever:
    """Local ChromaDB SOP Vector Search Retriever."""

    def __init__(self, chroma_dir: str = CHROMA_DB_DIR):
        self.client = chromadb.PersistentClient(path=chroma_dir)
        self.collection = self.client.get_or_create_collection(name="expedition_sops")

    def search_sops(self, query: str, top_k: int = 3) -> RAGSearchResult:
        """Queries local ChromaDB vector store and returns top-k relevant citations."""
        if not query or not query.strip():
            return RAGSearchResult(query="", citations=[], combined_context="")

        results = self.collection.query(
            query_texts=[query],
            n_results=top_k,
        )

        citations: List[SOPCitation] = []
        snippets: List[str] = []

        if results and results.get("documents") and len(results["documents"]) > 0:
            docs = results["documents"][0]
            metadatas = results["metadatas"][0] if results.get("metadatas") else []
            distances = results["distances"][0] if results.get("distances") else []

            for idx, doc in enumerate(docs):
                meta = metadatas[idx] if idx < len(metadatas) else {}
                dist = distances[idx] if idx < len(distances) else 0.0

                # Convert distance to approximate relevance score (0.0 to 1.0)
                relevance = max(0.0, 1.0 - (dist / 2.0))

                citation = SOPCitation(
                    document=meta.get("source_document", "Unknown_SOP.md"),
                    chunk_index=meta.get("chunk_index", idx),
                    relevance_score=round(relevance, 2),
                    snippet=doc,
                )
                citations.append(citation)
                snippets.append(f"[{citation.document}]: {doc}")

        combined_context = "\n\n".join(snippets)

        return RAGSearchResult(
            query=query,
            citations=citations,
            combined_context=combined_context,
        )
