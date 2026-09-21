import os
from typing import Generator
from sqlalchemy import event
from sqlmodel import SQLModel, create_engine, Session

# Load database URL from env or default to local SQLite database file
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aurora_operational.db")

# For SQLite, check if file or memory
is_sqlite = DATABASE_URL.startswith("sqlite")

connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args=connect_args,
)


# Enable SQLite WAL (Write-Ahead Logging) mode on connection
if is_sqlite and not DATABASE_URL.endswith(":memory:"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def init_db() -> None:
    """Creates all SQLModel tables in the authoritative SQLite database."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency for yielding database sessions."""
    with Session(engine) as session:
        yield session
