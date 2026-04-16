"""
Sentence Transformers embeddings + ChromaDB vector store.
Used for semantic similarity search across claims and evidence.
"""
import chromadb
from sentence_transformers import SentenceTransformer
from backend.config import EMBEDDING_MODEL, CHROMADB_COLLECTION

_model = None
_chroma_client = None
_collection = None


def get_model() -> SentenceTransformer:
    """Lazy-init embedding model."""
    global _model
    if _model is None:
        _model = SentenceTransformer(EMBEDDING_MODEL)
    return _model


def get_collection():
    """Get or create ChromaDB collection."""
    global _chroma_client, _collection
    if _collection is None:
        _chroma_client = chromadb.Client()  # In-memory for simplicity
        _collection = _chroma_client.get_or_create_collection(
            name=CHROMADB_COLLECTION,
            metadata={"hnsw:space": "cosine"}
        )
    return _collection


def embed_text(text: str) -> list[float]:
    """Embed a single text string."""
    model = get_model()
    return model.encode(text).tolist()


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed multiple text strings."""
    model = get_model()
    return model.encode(texts).tolist()


def store_claims(session_id: str, claims: list[dict]):
    """
    Store claims in ChromaDB for later retrieval.
    Each claim is stored with its metadata.
    """
    collection = get_collection()
    texts = [c["text"] for c in claims]
    embeddings = embed_texts(texts)
    ids = [f"{session_id}_{i}" for i in range(len(claims))]
    metadatas = [
        {
            "session_id": session_id,
            "page_number": str(c.get("page_number", 0)),
            "category": c.get("category", "general"),
        }
        for c in claims
    ]

    collection.add(
        embeddings=embeddings,
        documents=texts,
        ids=ids,
        metadatas=metadatas,
    )


def find_similar_claims(query: str, n_results: int = 5) -> list[dict]:
    """Find claims similar to the query."""
    collection = get_collection()
    embedding = embed_text(query)

    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results,
    )

    similar = []
    if results and results.get("documents"):
        for i, doc in enumerate(results["documents"][0]):
            similar.append({
                "text": doc,
                "metadata": results["metadatas"][0][i] if results.get("metadatas") else {},
                "distance": results["distances"][0][i] if results.get("distances") else 0.0,
            })

    return similar
