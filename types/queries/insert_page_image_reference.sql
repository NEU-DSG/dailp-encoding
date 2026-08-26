-- Record that a page refers to an image. $1 page_id, $2 image_id
-- Re-referencing the same image on the same page is a no-op.
insert into page_image_reference (page_id, image_id)
values ($1, $2)
on conflict (page_id, image_id) do nothing
returning page_id, image_id, inserted_at;
