select * from collection_chapter 
where slug_tree <@ (
      select slug from edited_collection where id=$1
)::ltree 
order by nlevel(slug_tree);