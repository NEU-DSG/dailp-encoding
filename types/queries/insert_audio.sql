with resource as (
  insert into audio_resource (url)
  values ($1)
  on conflict (url) do update set
     url = excluded.url
  returning id
)

insert into audio_slice (resource_id, time_range)
select
  id,
  $2
from resource
returning id
