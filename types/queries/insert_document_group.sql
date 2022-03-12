-- Insert a collection with a certain slug.
INSERT INTO document_group (slug, title)
    VALUES ($1, $2)
ON CONFLICT (slug)
    DO UPDATE SET
        title = EXCLUDED.title
    RETURNING
        id
