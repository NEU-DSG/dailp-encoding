-- Resized copies of many images at once, for the DataLoader that backs
-- `Image.variants`. Batching keeps a folder listing to one query instead of one
-- per image. Ordered smallest first: the picker uses the first as its thumbnail.
select image_id, width, height, s3_url, mime_type
from image_variant
where image_id = any($1::uuid[])
order by image_id, width;
