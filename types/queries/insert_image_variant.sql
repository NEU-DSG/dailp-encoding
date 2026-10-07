-- Record one resized copy of an image that has already been uploaded to S3.
-- $1 image_id, $2 width, $3 height, $4 s3_url, $5 mime_type.
-- Nothing is returned: the caller already holds every value it wrote.
insert into image_variant (image_id, width, height, s3_url, mime_type)
values ($1, $2, $3, $4, $5);
