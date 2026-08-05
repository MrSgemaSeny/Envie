CREATE TABLE wallpapers (
    id UUID PRIMARY KEY,
    filename VARCHAR NOT NULL,
    original_name VARCHAR NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
