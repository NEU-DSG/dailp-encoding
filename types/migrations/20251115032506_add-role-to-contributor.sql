-- Add role column to contributor
alter table contributor
add column role type contributor_role
usng role::contributor_role;