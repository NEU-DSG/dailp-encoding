select
  d.*,
  media_resource.url as "audio_url?",
  media_slice.time_range as "audio_slice?",
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'name', contributor.full_name, 'role', attr.contribution_role
      )
    ) filter (where contributor is not null),
    '[]'
  )
  as contributors,
  c.chapter_path as "chapter_path?"
from document as d
  left join contributor_attribution as attr on attr.document_id = d.id
  left join contributor on contributor.id = attr.contributor_id
  left join media_slice on media_slice.id = d.audio_slice_id
  left join media_resource on media_resource.id = media_slice.resource_id
  left join collection_chapter as c on c.document_id = d.id
where d.short_name = any($1)
group by d.id,
  media_slice.id,
  media_resource.id,
  c.chapter_path
