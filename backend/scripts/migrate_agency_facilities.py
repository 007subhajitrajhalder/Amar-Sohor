"""Preview or apply the additive agency-facility schema migration.

From backend/: python scripts/migrate_agency_facilities.py [--apply]
Default mode only inspects the schema and prints pending statements.
"""
import argparse
import sys
from pathlib import Path

from sqlalchemy import inspect, text

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.database.connection import engine


def pending_statements(connection) -> list[str]:
    if connection.dialect.name not in ("mysql", "mariadb"):
        raise RuntimeError("This migration supports the configured MySQL/MariaDB database")
    inspector = inspect(connection)
    for table in ("facilities", "recommendations", "reports"):
        if not inspector.has_table(table):
            raise RuntimeError(f"Missing {table} table; initialize the base schema first")

    statements = []
    columns = {column["name"] for column in inspector.get_columns("facilities")}
    if "additional_notes" not in columns:
        statements.append("ALTER TABLE facilities ADD COLUMN additional_notes TEXT NULL")
    if "source_recommendation_id" not in columns:
        # The original SQL dump uses unsigned IDs. Reuse the actual referenced
        # column type instead of assuming it matches SQLAlchemy's default Integer.
        recommendation_id = next(
            column for column in inspector.get_columns("recommendations")
            if column["name"] == "recommendation_id"
        )
        id_type = recommendation_id["type"].compile(dialect=connection.dialect)
        statements.append(
            f"ALTER TABLE facilities ADD COLUMN source_recommendation_id {id_type} NULL"
        )

    unique_columns = [
        item["column_names"] for item in inspector.get_unique_constraints("facilities")
    ] + [
        item["column_names"] for item in inspector.get_indexes("facilities")
        if item.get("unique")
    ]
    if ["source_recommendation_id"] not in unique_columns:
        statements.append(
            "ALTER TABLE facilities ADD CONSTRAINT uq_facilities_source_recommendation "
            "UNIQUE (source_recommendation_id)"
        )
    if not any(
        item["constrained_columns"] == ["source_recommendation_id"]
        for item in inspector.get_foreign_keys("facilities")
    ):
        statements.append(
            "ALTER TABLE facilities ADD CONSTRAINT fk_facilities_source_recommendation "
            "FOREIGN KEY (source_recommendation_id) "
            "REFERENCES recommendations (recommendation_id) ON UPDATE CASCADE"
        )

    report_columns = {column["name"] for column in inspector.get_columns("reports")}
    if "resolved_at" not in report_columns:
        statements.append("ALTER TABLE reports ADD COLUMN resolved_at DATETIME NULL")
    if "investigation_notes" not in report_columns:
        statements.append("ALTER TABLE reports ADD COLUMN investigation_notes TEXT NULL")
    resolution_columns = {column["name"] for column in inspector.get_columns("report_resolution_submissions")}
    if "description" not in resolution_columns:
        statements.append("ALTER TABLE report_resolution_submissions ADD COLUMN description TEXT NULL")
    if "completion_date" not in resolution_columns:
        statements.append("ALTER TABLE report_resolution_submissions ADD COLUMN completion_date DATE NULL")
    agent_column = next(c for c in inspector.get_columns("agency_members") if c["name"] == "agent_id")
    agent_type = agent_column["type"].compile(dialect=connection.dialect)
    for table in ("reports", "recommendations"):
        names = {c["name"] for c in inspector.get_columns(table)}
        if "assigned_agent" not in names:
            statements.append(f"ALTER TABLE {table} ADD COLUMN assigned_agent {agent_type} NULL")
        if not any(f["constrained_columns"] == ["assigned_agent"] for f in inspector.get_foreign_keys(table)):
            statements.append(f"ALTER TABLE {table} ADD CONSTRAINT fk_{table}_assigned_agent "
                "FOREIGN KEY (assigned_agent) REFERENCES agency_members (agent_id) ON UPDATE CASCADE ON DELETE SET NULL")
    return statements


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Execute the pending schema changes")
    args = parser.parse_args()
    with engine.connect() as connection:
        statements = pending_statements(connection)
        if not statements:
            print("Agency facility schema is up to date.")
            return
        for statement in statements:
            print(statement + ";")
            if args.apply:
                connection.execute(text(statement))
                connection.commit()
        if not args.apply:
            print("Preview only. Run again with --apply to execute these changes.")


if __name__ == "__main__":
    main()
