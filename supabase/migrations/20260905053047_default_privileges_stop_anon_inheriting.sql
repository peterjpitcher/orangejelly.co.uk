-- Applied directly to production on 5 September 2026 and committed after the
-- fact so a local stack matches production. Everything below this header is
-- byte-for-byte the SQL recorded in supabase_migrations.schema_migrations for
-- version 20260905053047; do not edit it.

-- Stop new objects granting themselves to anon.
-- Existing objects are untouched; this only changes what future tables,
-- sequences and functions created by this role inherit.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
