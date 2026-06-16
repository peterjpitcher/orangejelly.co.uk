ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE newsletter_subscribers IS 'Server-only lead data. RLS enabled; writes happen through trusted server code.';
COMMENT ON TABLE contacts IS 'Server-only contact enquiries. RLS enabled; writes happen through trusted server code.';
COMMENT ON TABLE lead_sources IS 'Server-only attribution data. RLS enabled; writes happen through trusted server code.';
COMMENT ON TABLE conversion_events IS 'Server-only conversion event log. RLS enabled; writes happen through trusted server code.';
