-- Drop a page's references to images its content no longer mentions.
-- $1 page_id, $2 the image ids the content still refers to. An empty array
-- clears every reference, which is what a page with no images left needs.
delete from page_image_reference
where page_id = $1
  and image_id <> all ($2::uuid[]);
