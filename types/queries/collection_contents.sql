select * from collection_chapter 
where chapter_path <@ (
      select slug from edited_collection where id=$1
)::ltree 
order by nlevel(chapter_path);