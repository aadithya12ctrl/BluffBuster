"""
SQLite session management — stores analysis sessions and results.
"""
import sqlite3
import json
import uuid
import os
from datetime import datetime
from backend.config import SQLITE_DB


def get_connection() -> sqlite3.Connection:
    """Get SQLite connection, creating DB if needed."""
    conn = sqlite3.connect(SQLITE_DB)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables."""
    conn = get_connection()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            mode TEXT NOT NULL,
            filename TEXT,
            status TEXT DEFAULT 'processing',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            page_number INTEGER NOT NULL,
            text_content TEXT,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        );

        CREATE TABLE IF NOT EXISTS claims (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            claim_text TEXT NOT NULL,
            page_number INTEGER,
            category TEXT,
            verdict TEXT,
            confidence REAL DEFAULT 0.0,
            reasoning TEXT,
            evidence_sources TEXT,
            repair_suggestion TEXT,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        );

        CREATE TABLE IF NOT EXISTS debate_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            sources TEXT,
            claim_ref TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        );

        CREATE TABLE IF NOT EXISTS analysis_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL UNIQUE,
            result_json TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES sessions(id)
        );
    """)
    conn.commit()
    conn.close()


def create_session(mode: str, filename: str) -> str:
    """Create a new analysis session, return session_id."""
    session_id = str(uuid.uuid4())[:8]
    conn = get_connection()
    conn.execute(
        "INSERT INTO sessions (id, mode, filename) VALUES (?, ?, ?)",
        (session_id, mode, filename)
    )
    conn.commit()
    conn.close()
    return session_id


def update_session_status(session_id: str, status: str):
    """Update session status."""
    conn = get_connection()
    conn.execute(
        "UPDATE sessions SET status = ?, updated_at = ? WHERE id = ?",
        (status, datetime.now().isoformat(), session_id)
    )
    conn.commit()
    conn.close()


def save_page(session_id: str, page_number: int, text_content: str):
    """Save extracted page text."""
    conn = get_connection()
    conn.execute(
        "INSERT INTO pages (session_id, page_number, text_content) VALUES (?, ?, ?)",
        (session_id, page_number, text_content)
    )
    conn.commit()
    conn.close()


def save_claim(session_id: str, claim_data: dict):
    """Save a single claim result."""
    conn = get_connection()
    conn.execute(
        """INSERT INTO claims 
           (session_id, claim_text, page_number, category, verdict, confidence, reasoning, evidence_sources, repair_suggestion) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            session_id,
            claim_data.get("claim", ""),
            claim_data.get("page_number", 0),
            claim_data.get("category", "general"),
            claim_data.get("verdict", "UNVERIFIABLE"),
            claim_data.get("confidence", 0.0),
            claim_data.get("reasoning", ""),
            json.dumps(claim_data.get("evidence_sources", [])),
            claim_data.get("repair_suggestion"),
        )
    )
    conn.commit()
    conn.close()


def save_debate_message(session_id: str, role: str, content: str, sources: list = None, claim_ref: str = ""):
    """Save a debate message."""
    conn = get_connection()
    conn.execute(
        "INSERT INTO debate_messages (session_id, role, content, sources, claim_ref) VALUES (?, ?, ?, ?, ?)",
        (session_id, role, content, json.dumps(sources or []), claim_ref)
    )
    conn.commit()
    conn.close()


def save_full_result(session_id: str, result: dict):
    """Save the complete analysis result as JSON."""
    conn = get_connection()
    conn.execute(
        "INSERT OR REPLACE INTO analysis_results (session_id, result_json) VALUES (?, ?)",
        (session_id, json.dumps(result))
    )
    conn.commit()
    conn.close()


def get_session(session_id: str) -> dict | None:
    """Get session info."""
    conn = get_connection()
    row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    conn.close()
    if row:
        return dict(row)
    return None


def get_full_result(session_id: str) -> dict | None:
    """Get the complete analysis result."""
    conn = get_connection()
    row = conn.execute("SELECT result_json FROM analysis_results WHERE session_id = ?", (session_id,)).fetchone()
    conn.close()
    if row:
        return json.loads(row["result_json"])
    return None


# Initialize DB on import
init_db()
