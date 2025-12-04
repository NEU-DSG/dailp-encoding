/*
$1: str collection_slug
$2: str title
$3: str chapter_slug
$4: collection_section section
$5: uuid parent_id (optional, null for top-level)
$6: uuid document_id (optional)
*/
with collection_base as (
  select slug::ltree as base_path
  from edited_collection
  where slug = $1
),
parent_path as (
  select 
    case 
      when $5::uuid is null then (select base_path from collection_base)
      else (select chapter_path from collection_chapter where id = $5::uuid)
    end as path
),
final_path as (
  select (select path from parent_path) || $3::text as chapter_path
),
next_index as (
  select coalesce(max(index_in_parent), 0) + 1 as idx
  from collection_chapter cc
  cross join parent_path pp
  where cc.section = $4::collection_section
    and (
      ($5::uuid is null 
        and nlevel(cc.chapter_path) = 2 
        and ltree2text(subpath(cc.chapter_path, 0, 1)) = $1)
      or ($5::uuid is not null 
        and pp.path @> cc.chapter_path
        and nlevel(cc.chapter_path) = nlevel(pp.path) + 1)
    )
)
insert into collection_chapter (
  title,
  document_id,
  wordpress_id,
  index_in_parent,
  chapter_path,
  section
)
select
  $2,
  $6::uuid,
  null::bigint,
  (select idx from next_index),
  (select chapter_path from final_path),
  $4::collection_section
returning id

