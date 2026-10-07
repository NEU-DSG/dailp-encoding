-- Record that a page refers to each of these images. $1 page_id, $2 image ids.
-- References that already exist are left alone so they keep their original
-- `inserted_at` across an edit.
insert into page_image_reference (page_id, image_id)
select $1, unnest($2::uuid[])
on conflict (page_id, image_id) do nothing;
