-- Create the gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'Website',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read gallery images
CREATE POLICY "Allow public read access for gallery" ON gallery_images
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to manage gallery images
CREATE POLICY "Allow authenticated management for gallery" ON gallery_images
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial data from existing gallery (Seed)
INSERT INTO gallery_images (title, description, image_url, category, display_order)
VALUES
(
    'DetectMe',
    'A system that helps pregnant mothers detect fetal conditions.',
    '../galeri/Detectme.webp',
    'Mobile App',
    1
),
(
    'Rent-It',
    'Facility rental system at Telkom University campus',
    '../galeri/rentit.webp',
    'Website',
    2
),
(
    'Brand Identity Design',
    'Identitas visual lengkap untuk startup teknologi',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&crop=center',
    'Branding',
    3
),
(
    'Dashboard Analytics',
    'Interface dashboard untuk analytics dan monitoring data real-time',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&crop=center',
    'UI/UX Design',
    4
),
(
    'Restaurant Website',
    'Desain website restaurant dengan focus pada visual makanan yang menarik',
    'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop&crop=center',
    'Website',
    5
),
(
    'Fitness Mobile App',
    'Aplikasi mobile untuk tracking workout dan program fitness personal',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center',
    'Mobile App',
    6
);
