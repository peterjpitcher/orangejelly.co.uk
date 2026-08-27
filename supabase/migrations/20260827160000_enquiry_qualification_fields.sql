-- Enquiry qualification fields for the repositioning.
--
-- The contacts table was built for a hospitality contact form: pub_name is NOT NULL
-- and package_interest assumes priced packages. Neither survives the repositioning. A
-- professional services enquiry has no pub name, so the current schema physically
-- cannot accept one, and D3 removed pricing so package_interest has nothing to hold.
--
-- Additive only. Nothing is dropped:
--   * pub_name and package_interest stay, stop being written, and remain readable so
--     the five historic pub leads are not orphaned. Dropping them is a destructive
--     migration and needs its own approval and a function audit.
--   * pub_name and message lose NOT NULL rather than being removed, because the new
--     two-step form has neither at step one.
--
-- Checked before writing: no view and no routine in the public schema references
-- contacts, pub_name or package_interest.
--
-- @see tasks/repositioning/SUB-SPECS.md part 1.4

ALTER TABLE contacts ALTER COLUMN pub_name DROP NOT NULL;
ALTER TABLE contacts ALTER COLUMN message DROP NOT NULL;

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS size_band text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS situation text;

-- blocker, success and why_now live here rather than as columns so their shape can
-- change without another migration. schema_version travels with them so a later reader
-- knows which shape it is looking at.
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS qualification jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS schema_version smallint NOT NULL DEFAULT 1;

-- 1 = the enquiry exists and can be answered. 2 = the qualification answers arrived
-- too. Step one writes the lead so an abandonment at step two still leaves a real
-- enquiry rather than nothing.
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS completed_step smallint NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS contacts_completed_step_idx ON contacts (completed_step);
