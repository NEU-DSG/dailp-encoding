insert into document_source (name, url)
select
  input_data.name,
  input_data.url
from
  unnest(
    $1::text[], $2::text[]
  ) as input_data(name, url)
-- If this document already has this source, move on.
on conflict do nothing