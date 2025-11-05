-- Shared enum for approval status of contributor suggestions
drop type if exists approval_status cascade;
create type approval_status as enum (
  'pending', 
  'approved', 
  'rejected'
);
