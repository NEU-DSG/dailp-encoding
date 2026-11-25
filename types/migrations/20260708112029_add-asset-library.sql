-- Where an image is meant to be used across the site.
create type image_scope as enum ('Site', 'Collection');

create table folders (
  id          autouuid primary key,
  name        text not null,
  parent_id   uuid references folders (id),
  -- Slugified full path from the root, e.g. `partners.logos`. 
  path        ltree not null,
  created_at  timestamp not null default now(),
  deleted_at  timestamp,
  -- Sum of the sizes of this folder's contents.
  size_bytes  bigint not null default 0
);

create table images (
  id          autouuid primary key,
  -- Images have no path of their own: `.` is ltree's separator, so a filename
  -- like `banner.jpg` would parse as two labels. An image is located by its
  -- folder's path plus this filename.
  folder_id   uuid references folders (id),
  created_at  timestamp not null default now(),
  deleted_at  timestamp,
  uploaded_by uuid references dailp_user (id) on delete set null,
  filename    text not null,
  mime_type   text not null,
  size_bytes  bigint not null,
  width       integer not null,
  height      integer not null,
  alt_text    text,
  caption     text,
  s3_url      text not null,
  scope       image_scope not null
);

-- A live folder's path is unique, which also enforces unique sibling names:
-- the path is the parent's path plus this folder's slug. Soft-deleted rows drop
-- out, so a deleted folder frees its path for reuse.
--
-- Note this is slug-level uniqueness: "Partner Logos" and "Partner-Logos" both
-- slugify to `partner_logos` and so collide, which keeps paths unambiguous.
create unique index folders_live_path
  on folders (path)
  where deleted_at is null;

-- Ancestor/descendant lookups (`@>`, `<@`) use this.
create index folders_path_gist on folders using gist (path);

-- Names must be unique among LIVE siblings only, so soft-deleted rows free up
-- their name. Postgres 14 has no NULLS NOT DISTINCT, and NULLs are never equal
-- in a unique index, so the root group (null folder) needs its own index
-- alongside the non-root one.
create unique index images_live_child_name
  on images (folder_id, filename)
  where deleted_at is null and folder_id is not null;
create unique index images_live_root_name
  on images (filename)
  where deleted_at is null and folder_id is null;

-- Which images a content page refers to.
create table page_image_reference (
  page_id     uuid not null references page (page_id) on delete cascade,
  image_id    uuid not null references images (id) on delete cascade,
  inserted_at timestamp not null default now(),
  primary key (page_id, image_id)
);
