-- Fix the user documents collection slug to be ltree-compatible
UPDATE edited_collection SET slug = 'user_documents' WHERE slug = 'user-documents'; 