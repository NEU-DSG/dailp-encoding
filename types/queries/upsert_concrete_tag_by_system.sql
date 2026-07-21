insert into morpheme_tag (
  system_id, abstract_ids, gloss, title, role_override, description
)
select ab.id, ARRAY[$2::uuid], $3, $3, null, $3
from abbreviation_system ab
where ab.short_name = $1
on conflict (gloss, system_id) do update set
  abstract_ids = excluded.abstract_ids