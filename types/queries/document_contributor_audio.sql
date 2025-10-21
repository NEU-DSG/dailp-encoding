select
  media_slice.id as "id",
  media_slice.time_range as "range?",
  media_resource.url as "resource_url",
  document_user_media.include_in_edited_collection as "include_in_edited_collection",
  media_resource.recorded_at as "recorded_at?",
  contributor.id as "recorded_by?",
  contributor.display_name as "recorded_by_name?",
  editor.id as "edited_by?",
  editor.display_name as "edited_by_name?"
from document_user_media
  left join media_slice on media_slice.id = document_user_media.media_slice_id
  left join media_resource on media_resource.id = media_slice.resource_id
  left join dailp_user contributor on contributor.id = media_resource.recorded_by
  left join dailp_user editor on editor.id = document_user_media.edited_by
where
  document_id = $1
order by media_resource.recorded_at desc
