select
  document.id,
  document.short_name,
  document.title,
  document.written_at,
  document.is_reference,
  ubd.bookmarked_on as "bookmarked_on?",
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'name',
        contributor.full_name,
        'role',
        contributor_attribution.contribution_role
      )
    ) filter (where contributor is not null),
    '[]'
  )
  as contributors
from document
  left join
    contributor_attribution on contributor_attribution.document_id = document.id
  left join contributor on contributor.id = contributor_attribution.contributor_id
  left join user_bookmarked_document as ubd on ubd.document_id = document.id
group by
  document.id, 
  ubd.bookmarked_on
