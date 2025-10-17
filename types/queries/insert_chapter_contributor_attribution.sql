insert into collection_chapter_attribution (
  chapter_id,
  contributor_id,
  contribution_role
)
values (
  $1, $2, $3
)
on conflict (chapter_id, contributor_id) do update set
  contribution_role = excluded.contribution_role; 