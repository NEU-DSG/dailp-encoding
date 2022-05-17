insert into chapter (chapter_title, document_title, author, document_id, wordpress_id, collection_path)
values ($1, $2, $3, $4, $5, $6)
on conflict (chapter_title, document_title)
do nothing