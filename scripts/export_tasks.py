import csv
import os
import sys
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT_FILE = PROJECT_ROOT / "tasks.csv"
CSV_COLUMNS = ["id", "title", "description", "status", "created_at"]


def get_output_path() -> Path:
    configured_path = Path(os.getenv("TASKS_CSV_PATH", DEFAULT_OUTPUT_FILE))

    if configured_path.is_absolute():
        return configured_path

    return PROJECT_ROOT / configured_path


def export_tasks() -> tuple[int, Path]:
    load_dotenv(PROJECT_ROOT / "backend" / ".env")

    connection_parameters = {
        "host": os.getenv("DB_HOST", "localhost"),
        "port": int(os.getenv("DB_PORT", "5433")),
        "dbname": os.getenv("POSTGRES_DB", "task_manager"),
        "user": os.getenv("POSTGRES_USER", "task_manager_user"),
        "password": os.getenv("POSTGRES_PASSWORD", "task_manager_password"),
    }

    with psycopg.connect(**connection_parameters, row_factory=dict_row) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, title, description, status, created_at
                FROM tasks
                ORDER BY created_at ASC, id ASC
                """
            )
            tasks = cursor.fetchall()

    output_path = get_output_path()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", encoding="utf-8-sig", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        writer.writerows(tasks)

    return len(tasks), output_path


def main() -> None:
    try:
        task_count, output_path = export_tasks()
    except (psycopg.Error, OSError, ValueError) as error:
        print(f"Ошибка экспорта: {error}", file=sys.stderr)
        raise SystemExit(1) from error

    print(f"Экспорт завершён. Задач выгружено: {task_count}")
    print(f"CSV-файл: {output_path}")


if __name__ == "__main__":
    main()