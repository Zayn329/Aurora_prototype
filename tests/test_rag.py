import pytest
from backend.rag.ingestion import ingest_sops_to_chroma, chunk_text
from backend.rag.retriever import SOPRetriever


def test_chunk_text_function():
    sample_text = "A" * 1200
    chunks = chunk_text(sample_text, chunk_size=500, overlap=50)
    assert len(chunks) >= 3


def test_chroma_sop_ingestion_and_retrieval():
    # 1. Ingest real Markdown SOP documents
    count = ingest_sops_to_chroma()
    assert count >= 2

    # 2. Query SOPRetriever for fuel delay contingency protocol
    retriever = SOPRetriever()
    res = retriever.search_sops("fuel cargo delay contingency plan", top_k=3)

    assert res is not None
    assert len(res.citations) > 0
    assert any("Fuel" in c.document or "Safety" in c.document for c in res.citations)
    assert len(res.combined_context) > 0


def test_empty_query_handling():
    retriever = SOPRetriever()
    res = retriever.search_sops("", top_k=3)
    assert len(res.citations) == 0
    assert res.combined_context == ""
