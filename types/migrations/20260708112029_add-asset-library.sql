create table folders (
  id uuid primary key,
  parent_id uuid references folders(id),
  name text not null,
  unique (parent_id, name)
);

create table files (
  id uuid primary key,
  folder_id uuid references folders(id),
  s3_url text not null,
  name text not null,
  unique (folder_id, name)
);