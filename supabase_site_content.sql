-- Create the site_content table for editable page content
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    page TEXT NOT NULL, -- 'home', 'about', etc.
    section TEXT NOT NULL, -- 'hero', 'profile', 'philosophy', 'expertise', etc.
    key TEXT NOT NULL, -- 'title', 'subtitle', 'description', etc.
    value JSONB, -- Flexible value (text, rich text, URLs, etc.)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page, section, key)
);

-- Create the cv_files table for CV document management
CREATE TABLE IF NOT EXISTS cv_files (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT false,
    version_note TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read site content
CREATE POLICY "Allow public read access for site_content" ON site_content
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to manage site content
CREATE POLICY "Allow authenticated management for site_content" ON site_content
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policy to allow anyone to read active CV
CREATE POLICY "Allow public read access for cv_files" ON cv_files
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to manage CV files
CREATE POLICY "Allow authenticated management for cv_files" ON cv_files
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial Home page content
INSERT INTO site_content (page, section, key, value) VALUES
-- Hero Section
('home', 'hero', 'title', '"Hello, I''m **Zhafran Hafizh**!"'::jsonb),
('home', 'hero', 'subtitle', '"A Software Engineer Bridging Design, Development, and Quality"'::jsonb),
('home', 'hero', 'description', '"Hello! This is where design meets code. As a product development enthusiast, I excel at creating intuitive UI/UX, implementing robust front-end interfaces, and ensuring software quality. Take a look at my end-to-end projects."'::jsonb),
('home', 'hero', 'cta_text', '"See my works"'::jsonb),
('home', 'hero', 'cta_link', '"/projects"'::jsonb),
('home', 'hero', 'profile_image', '"../../public/galeri/Profil.png"'::jsonb),

-- About Page Content
('about', 'profile', 'heading', '"About Me"'::jsonb),
('about', 'profile', 'tagline', '"Linking  Ideas, Design,  and Code."'::jsonb),
('about', 'profile', 'intro', '"Hi! I''m **Zhafran Hafizh Izdihar Riyadi**, A Software Engineer who is passionate about creating intuitive, functional, and high-quality digital products."'::jsonb),
('about', 'profile', 'image', '"../../public/galeri/Profil.png"'::jsonb),
('about', 'philosophy', 'heading', '"My Philosophy"'::jsonb),
('about', 'philosophy', 'content', '"I believe that the best technology is technology that disappears, allowing users to focus on their goals rather than on how to use the tool. For me, bridging design and development is not just a technical matter, but a matter of empathy. Understanding what users need (from a UI/UX perspective) and translating that into clean, efficient, and scalable code (from a front-end perspective)."'::jsonb),
('about', 'expertise', 'heading', '"My Core Expertise"'::jsonb),
('about', 'expertise', 'intro', '"My journey in the software world has given me expertise in various fields. I most often work with:"'::jsonb),
('about', 'expertise', 'skills', '[{"title":"UI/UX Design","desc":"Creating wireframes, interactive prototypes, and design systems using Figma."},{"title":"Front-End Development","desc":"Bringing designs to life as responsive and fast web applications using Vue.js."},{"title":"Quality Assurance & DevOps","desc":"Ensuring software runs bug-free and implementing CI/CD processes for efficient deployments."}]'::jsonb),
('about', 'connect', 'heading', '"Let''s Connect"'::jsonb),
('about', 'connect', 'content', '"I''m always open to collaborating on challenging projects or just discussing technology and design. If you''re looking for someone who can understand the big picture while also paying attention to technical details, I''d love to hear from you."'::jsonb),
('about', 'connect', 'cta_text', '"Contact Me \u2192"'::jsonb),
('about', 'connect', 'cta_link', '"/contact"'::jsonb);

-- Insert initial CV record (update the URL after uploading your CV)
INSERT INTO cv_files (filename, file_url, is_active, version_note) VALUES
('Zhafran_Hafizh_Resume_2025.pdf', '', true, 'Initial upload - Update URL after uploading to Storage');
