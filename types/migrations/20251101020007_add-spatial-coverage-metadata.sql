-- Spatial Coverages
create table if not exists spatial_coverage (
  id autouuid primary key,
  name text not null,
  status approval_status default 'pending'
);

-- Join table between document and spatial coverage to map which spatial coverages are 
-- associated with which documents
create table if not exists document_spatial_coverage (
  document_id uuid not null references document(id) on delete cascade,
  spatial_coverage_id uuid not null references spatial_coverage(id) on delete cascade,
  primary key (document_id, spatial_coverage_id)
);