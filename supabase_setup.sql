-- Create the portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link TEXT,
    github TEXT,
    figma TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    category JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    challenges TEXT,
    duration TEXT,
    team TEXT,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read projects
CREATE POLICY "Allow public read access" ON portfolio_projects
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to manage projects
CREATE POLICY "Allow authenticated management" ON portfolio_projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial data (Seed)
INSERT INTO portfolio_projects (title, description, image_url, link, github, figma, tags, category, features, challenges, duration, team, role)
VALUES 
(
    'System Monitoring Update at PT. JICT (GBOSS/MyJICT)',
    'As part of my internship assignment, I modernized the front-end design for several core GBOSS/MYJICT displays. I also created several custom components, such as the application logo and icons, to give it a professional look. I was also responsible for making GBOSS responsive on all devices.',
    '../galeri/ManifestL1.webp',
    'https://my.jict.co.id/gboss-eunoia/',
    '',
    '',
    '["Frontend Development", "UI/UX Enhancement", "System Monitoring", "User Experience", "Vue.js"]'::jsonb,
    '["Web Development"]'::jsonb,
    '["Modernized user interface for better usability", "Enhanced system monitoring capabilities", "Improved user experience flow", "Responsive design implementation", "Performance optimization", "Integration with existing GBOSS infrastructure"]'::jsonb,
    'Working with legacy systems while implementing modern frontend practices and ensuring seamless integration with existing workflows at a major port terminal company.',
    'Internship Period',
    'Development Team at PT. JICT',
    'Frontend Web Developer Intern'
),
(
    'Teaching Plotting Information System (Siplongjar)',
    'My final project, along with my group, was to create a system that could be used to plot courses and lecturers at the Telkom University Faculty of Informatics.',
    '../galeri/Siplongjar.webp',
    'https://siplongjar.com/',
    'https://github.com/rasjidzz/cap-plongjar',
    'https://www.figma.com/design/JzMxkBh4CM8B18SBwH6RTr/UI-Sistem-Plottingan?node-id=2515-1038&t=t8OiDTzwDBauptRw-1',
    '["System Design", "UCD Methodology", "Information System", "Final Project"]'::jsonb,
    '["Web Development", "UI/UX Design"]'::jsonb,
    '["Complete system architecture design", "User-Centered Design implementation", "Teaching assignment management", "Automated plotting algorithms", "Comprehensive user interface", "Database design and optimization"]'::jsonb,
    'Some of the challenges faced were that the previous system used Excel with many complex relationships and calculations that complied with faculty and even university standards.',
    'Final Project Timeline',
    'Five Person',
    'System Designer & UI/UX Lead'
),
(
    'UI/UX Design for Chevalier LAB',
    'Professional UI/UX design project for Chevalier LAB, creating comprehensive designs for Learning Management System (LMS) and coffee shop application with modern, user-friendly interfaces.',
    '../galeri/Lmscheva.webp',
    '#',
    '',
    'https://www.figma.com/design/VrFKV4lK8Esk2vEe32T0M8/LMS-Chevalier?node-id=0-1&t=2D62HaKtCBO5dfjO-1',
    '["UI/UX Design", "LMS Design", "Mobile App", "Figma", "Design System"]'::jsonb,
    '["UI/UX Design"]'::jsonb,
    '["Complete LMS interface design", "Coffee shop mobile app design", "Design system development", "User journey mapping", "Interactive prototyping", "Cross-platform design consistency"]'::jsonb,
    'Creating intuitive designs for both educational and commercial applications while maintaining consistency across different platforms and user types.',
    'Client Project Timeline',
    'Chevalier LAB Design Team',
    'Lead UI/UX Designer'
),
(
    'Cardiovascular Detection System with AI',
    'Advanced artificial intelligence project focused on cardiovascular disease detection, showcasing expertise in AI integration, medical technology, and complex system design.',
    '../galeri/cardia.webp',
    'https://cardiainsightt.humicprototyping.com/',
    '',
    '',
    '["Artificial Intelligence", "Healthcare Tech", "Machine Learning", "Medical Detection", "Flask", "React JS"]'::jsonb,
    '["Web Development"]'::jsonb,
    '["AI-powered cardiovascular analysis", "Medical data processing", "Real-time detection algorithms", "Healthcare-compliant interface", "Data visualization for medical professionals", "Integration with medical devices"]'::jsonb,
    'Developing a highly accurate AI system for medical applications...',
    'Research Project Timeline',
    'AI Research Team',
    'AI Developer & Interface Designer'
),
(
    'Mobile App "Rent-It"',
    'Comprehensive mobile application development project for rental services, demonstrating cross-platform development skills and mobile-first design approach.',
    '../galeri/rentit.webp',
    '#',
    'https://github.com/SuryaaAulia/Rent-It-App-Flutter',
    'https://www.figma.com/design/eudmS0XQSKFWt8dndjMIed/Rent-It?m=auto&t=dZyiGxhXRLTbMvL7-6',
    '["Flutter", "Mobile App", "Cross-Platform", "Rental Service"]'::jsonb,
    '["Mobile", "UI/UX Design"]'::jsonb,
    '["Cross-platform mobile application", "Rental booking system", "Payment integration", "User authentication", "Real-time availability tracking", "Push notifications"]'::jsonb,
    'Creating a seamless rental experience across different mobile platforms...',
    'Mobile Project Timeline',
    'Mobile Development Team',
    'Mobile Developer & UI Designer'
),
(
    'Design & Prototype for "DetectMe" Project',
    'End-to-end design project encompassing complete UI/UX design, prototyping, and asset creation for the DetectMe application, demonstrating full design process expertise.',
    '../galeri/Detectme.webp',
    'https://detectme.id/',
    '',
    'https://www.figma.com/design/4EdpOtL2y0FS0y62IAowVI/DetectME?node-id=0-1&t=yt0aqYR2vwLm58LM-1',
    '["UI/UX Design", "Prototyping", "Design Assets", "Complete Design Process", "Figma"]'::jsonb,
    '["UI/UX Design"]'::jsonb,
    '["Complete UI/UX design system", "Interactive prototypes", "Development-ready assets", "User research integration", "Design documentation", "Handoff to development team"]'::jsonb,
    'Managing the complete design process from concept to development handoff...',
    'Still in Development',
    'Design & Development Team',
    'Lead Designer & Design Process Manager'
);
