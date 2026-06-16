CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  email_normalized text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source_page text,
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  consented_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  email_normalized text NOT NULL,
  phone text,
  pub_name text NOT NULL,
  package_interest text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  source_page text,
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lead_sources (
  id uuid PRIMARY KEY,
  owner_type text NOT NULL CHECK (owner_type IN ('contact', 'newsletter_subscriber', 'conversion_event')),
  owner_id uuid NOT NULL,
  source_page text,
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversion_events (
  id uuid PRIMARY KEY,
  event_name text NOT NULL,
  owner_type text CHECK (owner_type IN ('contact', 'newsletter_subscriber')),
  owner_id uuid,
  email_normalized text,
  source_page text,
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS contacts_email_normalized_idx ON contacts (email_normalized);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_created_at_idx ON newsletter_subscribers (created_at DESC);
CREATE INDEX IF NOT EXISTS conversion_events_created_at_idx ON conversion_events (created_at DESC);
CREATE INDEX IF NOT EXISTS conversion_events_event_name_idx ON conversion_events (event_name);
CREATE INDEX IF NOT EXISTS lead_sources_owner_idx ON lead_sources (owner_type, owner_id);
