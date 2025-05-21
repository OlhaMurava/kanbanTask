CREATE TABLE boards (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE columns (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  column_id UUID REFERENCES columns(id) ON DELETE CASCADE
);