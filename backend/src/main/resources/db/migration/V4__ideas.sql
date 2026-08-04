CREATE TABLE ideas (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    problem TEXT,
    solution TEXT,
    audience TEXT,
    monetization TEXT,
    status VARCHAR(50) NOT NULL,
    ai_architecture TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
