CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  founded_date TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL,
  services JSONB NOT NULL,
  about_cs TEXT NOT NULL,
  about_uk TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id SERIAL PRIMARY KEY,
  title_cs TEXT NOT NULL,
  title_uk TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  location TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  client_ip_hash TEXT PRIMARY KEY,
  attempt_count INTEGER NOT NULL,
  reset_at TIMESTAMPTZ NOT NULL
);