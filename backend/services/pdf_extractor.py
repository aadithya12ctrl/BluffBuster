"""
PDF extraction using pdfplumber — extracts text per page from uploaded pitch decks.
"""
import pdfplumber
from typing import BinaryIO


def extract_pages(file_path: str | None = None, file_obj: BinaryIO | None = None) -> list[dict]:
    """
    Extract text content from each page of a PDF.
    Returns list of {page_number, text, tables}.
    """
    pages = []

    if file_path:
        pdf = pdfplumber.open(file_path)
    elif file_obj:
        pdf = pdfplumber.open(file_obj)
    else:
        raise ValueError("Either file_path or file_obj must be provided")

    with pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            tables = page.extract_tables() or []

            # Convert tables to readable strings
            table_texts = []
            for table in tables:
                rows = []
                for row in table:
                    if row:
                        rows.append(" | ".join(str(cell) if cell else "" for cell in row))
                if rows:
                    table_texts.append("\n".join(rows))

            pages.append({
                "page_number": i + 1,
                "text": text.strip(),
                "tables": table_texts,
                "full_content": text.strip() + ("\n\nTABLES:\n" + "\n\n".join(table_texts) if table_texts else ""),
            })

    return pages


def get_first_n_pages(pages: list[dict], n: int = 3) -> str:
    """Get concatenated text of first N pages for first impression analysis."""
    first_pages = pages[:n]
    combined = []
    for p in first_pages:
        combined.append(f"--- PAGE {p['page_number']} ---\n{p['full_content']}")
    return "\n\n".join(combined)


def get_full_text(pages: list[dict]) -> str:
    """Get all text concatenated."""
    parts = []
    for p in pages:
        parts.append(f"--- PAGE {p['page_number']} ---\n{p['full_content']}")
    return "\n\n".join(parts)
