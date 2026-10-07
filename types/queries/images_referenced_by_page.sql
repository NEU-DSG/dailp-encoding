-- Library images referred to by the body of the page at path $1.
--
-- Keyed on the path rather than the page id because that is how a page is
-- identified everywhere else on the front end, and it saves the caller a
-- lookup just to turn one into the other.
--
-- Soft-deleted images are returned too, following the other image listings: a
-- page still pointing at a deleted image is worth showing rather than hiding.
select
  i.id,
  i.folder_id,
  i.created_at,
  i.deleted_at,
  i.uploaded_by,
  i.filename,
  i.mime_type,
  i.size_bytes,
  i.width,
  i.height,
  i.alt_text,
  i.caption,
  i.s3_url,
  i.scope as "scope: ImageScope"
from page_image_reference r
inner join images i on i.id = r.image_id
inner join page p on p.page_id = r.page_id
where p.path = $1
order by i.filename;
