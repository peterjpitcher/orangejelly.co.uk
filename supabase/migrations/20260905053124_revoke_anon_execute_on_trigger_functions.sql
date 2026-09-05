-- Take EXECUTE away from anon and PUBLIC on trigger functions.
--
-- Applied to production on 5 September 2026. A trigger function is invoked by its
-- trigger, never called directly, so no API role needs EXECUTE on it. These held
-- it only through the default privileges CREATE FUNCTION applies.

REVOKE EXECUTE ON FUNCTION public.contacts_touch_updated_at() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon;
