-- Which library images a page's content refers to. $1 is the whole page body.
--
-- A page holding a srcset contains several URLs for one image, the original
-- plus its resized copies, so `union` collapses them to one id per image.
select id as "id!"
from images
where position(s3_url in $1) > 0
union
select image_id as "id!"
from image_variant
where position(s3_url in $1) > 0;
