CREATE TYPE user_role_new AS ENUM ('Readers', 'Editors', 'Contributors', 'Administrators');

ALTER TABLE dailp_user 
    ALTER COLUMN role TYPE user_role_new USING role::text::user_role_new;

DROP TYPE user_role;

ALTER TYPE user_role_new RENAME TO user_role;