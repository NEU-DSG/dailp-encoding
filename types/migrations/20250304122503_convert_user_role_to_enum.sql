CREATE TYPE user_role AS ENUM ('Readers', 'Editors', 'Contributors');

UPDATE dailp_user SET role = 'Readers' WHERE role = 'READER';
UPDATE dailp_user SET role = 'Editors' WHERE role = 'EDITOR';
UPDATE dailp_user SET role = 'Contributors' WHERE role = 'CONTRIBUTOR';

ALTER TABLE dailp_user 
    ALTER COLUMN role DROP DEFAULT;

ALTER TABLE dailp_user 
    ALTER COLUMN role TYPE user_role USING role::user_role;

ALTER TABLE dailp_user 
    ALTER COLUMN role SET DEFAULT 'Readers';