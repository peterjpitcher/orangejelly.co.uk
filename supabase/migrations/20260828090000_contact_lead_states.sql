-- Lead states for the enquiry pipeline.
--
-- `status` already existed as free text defaulting to 'new', which means the six
-- states in the sub-spec are only a convention until something enforces them. A
-- typo in an admin PATCH would create a seventh state silently and the lead would
-- disappear from every filter that knows about six.
--
-- Safe to constrain: every existing row is 'new', verified before writing this.
--
-- @see tasks/repositioning/SUB-SPECS.md part 1.9

ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_status_check;

ALTER TABLE contacts ADD CONSTRAINT contacts_status_check CHECK (
  status IN ('new', 'contacted', 'qualified', 'conversation_booked', 'declined', 'client')
);

-- The admin view filters on it, and the retention sweep will need to find the
-- states that are finished with.
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts (status);

-- Retention is 24 months from last contact (D25), and `updated_at` is what
-- measures it. Nothing was maintaining it: the column defaults to now() on insert
-- and then never moves unless a writer remembers, which is exactly the kind of
-- thing that is remembered until it is not.
CREATE OR REPLACE FUNCTION contacts_touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_touch_updated_at ON contacts;
CREATE TRIGGER contacts_touch_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION contacts_touch_updated_at();
