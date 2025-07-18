SELECT
    ec.slug
FROM
    edited_collection ec
JOIN
    collection_chapter cc ON ec.id = cc.collection_id
WHERE
    cc.id = $1
