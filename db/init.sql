-- Example initialization SQL script
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO todos (task, completed) VALUES
    ('Learn Docker', false),
    ('Build React frontend', false),
    ('Setup MinIO file storage', false);
