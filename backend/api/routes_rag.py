from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from backend.rag.retriever import SOPRetriever, RAGSearchResult
from backend.rag.ingestion import ingest_sops_to_chroma

router = APIRouter(prefix="/rag", tags=["RAG SOP Search"])


class RAGQueryRequest(BaseModel):
    query: str = Field(..., description="Natural language search query")
    top_k: int = Field(default=3, ge=1, le=10)


@router.post("/search", response_model=RAGSearchResult, status_code=status.HTTP_200_OK)
def search_sops_vector_store(payload: RAGQueryRequest):
    """Performs local ChromaDB vector search over indexed expedition SOPs and safety manuals."""
    try:
        retriever = SOPRetriever()
        result = retriever.search_sops(payload.query, top_k=payload.top_k)
        return result
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG search error: {str(err)}",
        )


@router.post("/ingest", status_code=status.HTTP_200_OK)
def trigger_sop_ingestion():
    """Trigger manual re-ingestion of data/sops/*.md files into ChromaDB vector store."""
    count = ingest_sops_to_chroma()
    return {"status": "ingestion_successful", "chunks_ingested": count}
