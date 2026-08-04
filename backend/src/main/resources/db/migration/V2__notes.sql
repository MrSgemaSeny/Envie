CREATE TABLE notes (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE note_tags (
    id UUID PRIMARY KEY,
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

CREATE INDEX idx_note_tags_note_id ON note_tags(note_id);

CREATE TABLE note_media (
    id UUID PRIMARY KEY,
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    file_path VARCHAR(512) NOT NULL,
    media_type VARCHAR(100) NOT NULL,
    original_name VARCHAR(255) NOT NULL
);

CREATE INDEX idx_note_media_note_id ON note_media(note_id);
