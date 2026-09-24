CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tasks_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT tasks_status_allowed CHECK (
        status IN ('new', 'in_progress', 'done')
    )
);
