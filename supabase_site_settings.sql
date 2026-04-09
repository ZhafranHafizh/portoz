-- Create the site_settings table for site-wide configurations
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read site settings
CREATE POLICY "Allow public read access for site_settings" ON site_settings
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to manage site settings
CREATE POLICY "Allow authenticated management for site_settings" ON site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
('site_status', '{"is_public": true, "maintenance_message": "Website is currently under development. Please check back soon!"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
