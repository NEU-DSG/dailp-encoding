select * from collection_chapter
  inner join
    edited_collection on edited_collection.slug = collection_chapter.collection_slug
where edited_collection = $1
order by nlevel(collection_chapter.chapter_path);
