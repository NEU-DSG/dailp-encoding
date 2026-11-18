insert into page (slug, path, title, content)
values ($1, $2, $3, $4)
on conflict (path) do update set
title = excluded.title,
content = excluded.content