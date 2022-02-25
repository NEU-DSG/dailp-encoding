-- Insert a collection with a certain slug.
INSERT INTO collection (super_collection, parent_id, slug, title, index_in_parent)
    VALUES ('', $1, $2, $3, $4)
ON CONFLICT (super_collection, slug)
    DO UPDATE SET
        title = EXCLUDED.title, parent_id = EXCLUDED.parent_id, index_in_parent = EXCLUDED.index_in_parent
    RETURNING
        id
