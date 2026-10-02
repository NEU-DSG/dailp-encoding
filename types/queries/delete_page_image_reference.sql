-- Drop a page's reference to an image. $1 page_id, $2 image_id
delete from page_image_reference
where page_id = $1 and image_id = $2
returning page_id, image_id, inserted_at;
