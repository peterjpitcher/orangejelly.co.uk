-- Applied directly to production on 5 September 2026 and committed after the
-- fact so a local stack matches production. Everything below this header is
-- byte-for-byte the SQL recorded in supabase_migrations.schema_migrations for
-- version 20260905053124; do not edit it.

-- Trigger functions are invoked by the trigger, not called directly, so no role
-- needs EXECUTE on them. They held it only through the default privileges that
-- CREATE FUNCTION applies.
REVOKE EXECUTE ON FUNCTION public.contacts_touch_updated_at() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon;
