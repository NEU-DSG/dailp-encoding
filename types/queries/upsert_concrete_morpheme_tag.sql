INSERT INTO morpheme_tag (gloss, title, description, abstract_ids, system_id, representation_system_type)
SELECT $1, $1, $1, ARRAY[$2::uuid], ab.id, $3::representation_system_type
FROM abbreviation_system ab
WHERE ab.short_name = $3
ON CONFLICT DO NOTHING