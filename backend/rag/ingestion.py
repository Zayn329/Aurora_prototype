import os
import glob
from typing import List, Dict, Any
import chromadb
from chromadb.config import Settings

SOP_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "sops")
CHROMA_DB_DIR = os.getenv("CHROMA_PERSIST_DIRECTORY", "./data/chromadb")


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Splits document text into ~500 character chunks with ~50 character overlap."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk.strip())
        start += chunk_size - overlap
    return [c for c in chunks if c]


def ingest_sops_to_chroma() -> int:
    """Parses SOP Markdown files, chunks them, and stores embeddings in persistent ChromaDB."""
    client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
    collection = client.get_or_create_collection(name="expedition_sops")

    sop_files = glob.glob(os.path.join(SOP_DIR, "*.md"))
    total_chunks = 0

    for file_path in sop_files:
        filename = os.path.basename(file_path)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        chunks = chunk_text(content, chunk_size=500, overlap=50)

        for idx, chunk in enumerate(chunks):
            doc_id = f"{filename}_chunk_{idx}"
            metadata = {
                "source_document": filename,
                "chunk_index": idx,
            }
            # Upsert into ChromaDB
            collection.upsert(
                ids=[doc_id],
                documents=[chunk],
                metadatas=[metadata],
            )
            total_chunks += 1

    return total_chunks


if __name__ == "__main__":
    count = ingest_sops_to_chroma()
    print(f"Successfully ingested {count} SOP document chunks into ChromaDB.")
