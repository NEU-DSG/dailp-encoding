WITH resource AS (
INSERT INTO audio_resource (url)
        VALUES ($1)
    RETURNING
        id)
    INSERT INTO audio_slice (resource_id, time_range)
    SELECT
        id,
        $2
    FROM
        resource
    RETURNING
        id
