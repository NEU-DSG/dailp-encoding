select
  d.id,
  d.short_name,
  d.title,
  d.is_reference,
  d.written_at,
  d.audio_slice_id,
  media_resource.url as "audio_url?",
  media_resource.recorded_at as "recorded_at?",
  dailp_user.id as "recorded_by?",
  dailp_user.display_name as "recorded_by_name?",
  media_slice.time_range as "audio_slice?",
  ubd.bookmarked_on as "bookmarked_on?",
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'name', contributor.full_name, 'role', attr.contribution_role
      )
    ) filter (where contributor is not null),
    '[]'
  )
  as contributors,
  (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', l.id,
          'name', l.name,
          'autonym', l.autonym,
          'status', l.status
        )
      ),
      '[]'
    )
    from document_language dl
    join language l on l.id = dl.language_id
    where dl.document_id = d.id
  ) as languages
from document as d
  left join contributor_attribution as attr on attr.document_id = d.id
  left join contributor on contributor.id = attr.contributor_id
  left join media_slice on media_slice.id = d.audio_slice_id
  left join media_resource on media_resource.id = media_slice.resource_id
  left join dailp_user on dailp_user.id = media_resource.recorded_by
  left join user_bookmarked_document as ubd on ubd.document_id = d.id
where d.id = any($1)
group by d.id,
  media_slice.id,
  media_resource.id,
  dailp_user.id,
  ubd.bookmarked_on