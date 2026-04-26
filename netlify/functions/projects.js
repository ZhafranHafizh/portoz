import { neon } from '@netlify/neon'
import { neonConfig } from '@neondatabase/serverless'

neonConfig.fetchConnectionCache = true
const sql = neon() // otomatis pakai NETLIFY_DATABASE_URL dari extension

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
}

// Initial Data Seed
const initialProjects = [
  {
    "title": "System Monitoring Update at PT. JICT (GBOSS/MyJICT)",
    "description": "As part of my internship assignment, I modernized the front-end design for several core GBOSS/MYJICT displays. I also created several custom components, such as the application logo and icons, to give it a professional look. I was also responsible for making GBOSS responsive on all devices.",
    "imageUrl": "../galeri/ManifestL1.webp",
    "link": "https://my.jict.co.id/gboss-eunoia/",
    "github": "",
    "figma": "",
    "tags": ["Frontend Development", "UI/UX Enhancement", "System Monitoring", "User Experience", "Vue.js"],
    "category": "Web Development",
    "features": ["Modernized user interface for better usability", "Enhanced system monitoring capabilities", "Improved user experience flow", "Responsive design implementation", "Performance optimization", "Integration with existing GBOSS infrastructure"],
    "challenges": "Working with legacy systems while implementing modern frontend practices and ensuring seamless integration with existing workflows at a major port terminal company.",
    "duration": "Internship Period",
    "team": "Development Team at PT. JICT",
    "role": "Frontend Web Developer Intern"
  },
  {
    "title": "Teaching Plotting Information System (Siplongjar)",
    "description": "My final project, along with my group, was to create a system that could be used to plot courses and lecturers at the Telkom University Faculty of Informatics.",
    "imageUrl": "../galeri/Siplongjar.webp",
    "link": "https://siplongjar.com/",
    "github": "https://github.com/rasjidzz/cap-plongjar",
    "figma": "https://www.figma.com/design/JzMxkBh4CM8B18SBwH6RTr/UI-Sistem-Plottingan?node-id=2515-1038&t=t8OiDTzwDBauptRw-1",
    "tags": ["System Design", "UCD Methodology", "Information System", "Final Project"],
    "category": ["Web Development", "UI/UX Design"],
    "features": ["Complete system architecture design", "User-Centered Design implementation", "Teaching assignment management", "Automated plotting algorithms", "Comprehensive user interface", "Database design and optimization"],
    "challenges": "Some of the challenges faced were that the previous system used Excel with many complex relationships and calculations that complied with faculty and even university standards.",
    "duration": "Final Project Timeline",
    "team": "Five Person",
    "role": "System Designer & UI/UX Lead"
  },
  {
    "title": "UI/UX Design for Chevalier LAB",
    "description": "Professional UI/UX design project for Chevalier LAB, creating comprehensive designs for Learning Management System (LMS) and coffee shop application with modern, user-friendly interfaces.",
    "imageUrl": "../galeri/Lmscheva.webp",
    "link": "#",
    "github": "",
    "figma": "https://www.figma.com/design/VrFKV4lK8Esk2vEe32T0M8/LMS-Chevalier?node-id=0-1&t=2D62HaKtCBO5dfjO-1",
    "tags": ["UI/UX Design", "LMS Design", "Mobile App", "Figma", "Design System"],
    "category": "UI/UX Design",
    "features": ["Complete LMS interface design", "Coffee shop mobile app design", "Design system development", "User journey mapping", "Interactive prototyping", "Cross-platform design consistency"],
    "challenges": "Creating intuitive designs for both educational and commercial applications while maintaining consistency across different platforms and user types.",
    "duration": "Client Project Timeline",
    "team": "Chevalier LAB Design Team",
    "role": "Lead UI/UX Designer"
  },
  {
    "title": "Cardiovascular Detection System with AI",
    "description": "Advanced artificial intelligence project focused on cardiovascular disease detection, showcasing expertise in AI integration, medical technology, and complex system design.",
    "imageUrl": "../galeri/cardia.webp",
    "link": "https://cardiainsightt.humicprototyping.com/",
    "github": "",
    "figma": "",
    "tags": ["Artificial Intelligence", "Healthcare Tech", "Machine Learning", "Medical Detection", "Flask", "React JS"],
    "category": "Web Development",
    "features": ["AI-powered cardiovascular analysis", "Medical data processing", "Real-time detection algorithms", "Healthcare-compliant interface", "Data visualization for medical professionals", "Integration with medical devices"],
    "challenges": "Developing a highly accurate AI system for medical applications...",
    "duration": "Research Project Timeline",
    "team": "AI Research Team",
    "role": "AI Developer & Interface Designer"
  },
  {
    "title": "Mobile App \"Rent-It\"",
    "description": "Comprehensive mobile application development project for rental services, demonstrating cross-platform development skills and mobile-first design approach.",
    "imageUrl": "../galeri/rentit.webp",
    "link": "#",
    "github": "https://github.com/SuryaaAulia/Rent-It-App-Flutter",
    "figma": "https://www.figma.com/design/eudmS0XQSKFWt8dndjMIed/Rent-It?m=auto&t=dZyiGxhXRLTbMvL7-6",
    "tags": ["Flutter", "Mobile App", "Cross-Platform", "Rental Service"],
    "category": ["Mobile", "UI/UX Design"],
    "features": ["Cross-platform mobile application", "Rental booking system", "Payment integration", "User authentication", "Real-time availability tracking", "Push notifications"],
    "challenges": "Creating a seamless rental experience across different mobile platforms...",
    "duration": "Mobile Project Timeline",
    "team": "Mobile Development Team",
    "role": "Mobile Developer & UI Designer"
  },
  {
    "title": "Design & Prototype for \"DetectMe\" Project",
    "description": "End-to-end design project encompassing complete UI/UX design, prototyping, and asset creation for the DetectMe application, demonstrating full design process expertise.",
    "imageUrl": "../galeri/Detectme.webp",
    "link": "https://detectme.id/",
    "github": "",
    "figma": "https://www.figma.com/design/4EdpOtL2y0FS0y62IAowVI/DetectME?node-id=0-1&t=yt0aqYR2vwLm58LM-1",
    "tags": ["UI/UX Design", "Prototyping", "Design Assets", "Complete Design Process", "Figma"],
    "category": "UI/UX Design",
    "features": ["Complete UI/UX design system", "Interactive prototypes", "Development-ready assets", "User research integration", "Design documentation", "Handoff to development team"],
    "challenges": "Managing the complete design process from concept to development handoff...",
    "duration": "Still in Development",
    "team": "Design & Development Team",
    "role": "Lead Designer & Design Process Manager",
    "is_in_development": true
  }
];

let didInit = false
async function ensureSchema() {
  if (didInit) return
  // Create table
  await sql`CREATE TABLE IF NOT EXISTS portfolio_projects(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    link VARCHAR(255),
    github VARCHAR(255),
    figma VARCHAR(255),
    tags JSONB,
    category JSONB,
    features JSONB,
    challenges TEXT,
    duration VARCHAR(100),
    team VARCHAR(100),
    role VARCHAR(100),
    is_in_development BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
  await sql`ALTER TABLE portfolio_projects ADD COLUMN IF NOT EXISTS is_in_development BOOLEAN DEFAULT FALSE`

  // Check if empty, run seed
  const [{ count }] = await sql`SELECT COUNT(*) FROM portfolio_projects`
  if (parseInt(count) === 0) {
    console.log("Empty database detected. Running seed...");
    for (const proj of initialProjects) {
        await sql`
            INSERT INTO portfolio_projects (
                title, description, image_url, link, github, figma, tags, category, features, challenges, duration, team, role, is_in_development
            ) VALUES (
                ${proj.title}, ${proj.description || ''}, ${proj.imageUrl || ''}, ${proj.link || ''}, 
                ${proj.github || ''}, ${proj.figma || ''}, ${JSON.stringify(proj.tags || [])}, 
                ${JSON.stringify(proj.category || [])}, ${JSON.stringify(proj.features || [])}, 
                ${proj.challenges || ''}, ${proj.duration || ''}, ${proj.team || ''}, ${proj.role || ''},
                ${Boolean(proj.is_in_development)}
            )
        `;
    }
  }

  didInit = true
}

function checkAuth(event) {
    const authHeader = event.headers.authorization;
    const requiredPassword = process.env.ADMIN_PASSWORD || 'portozadmin';
    if (!authHeader || authHeader !== requiredPassword) {
        throw new Error("Unauthorized");
    }
}

export async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }

    // Init DB state
    await sql`select 1 as ok`
    await ensureSchema()

    // 1. GET ALL PROJECTS
    if (event.httpMethod === 'GET') {
      const rows = await sql`SELECT * FROM portfolio_projects ORDER BY id ASC`
      
      // Parse JSON fields to match Vue frontend expectation
      const projects = rows.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          imageUrl: r.image_url,
          link: r.link,
          github: r.github,
          figma: r.figma,
          tags: r.tags || [],
          category: r.category || '',
          features: r.features || [],
          challenges: r.challenges,
          duration: r.duration,
          team: r.team,
          role: r.role,
          is_in_development: Boolean(r.is_in_development)
      }))
      return { statusCode: 200, headers, body: JSON.stringify(projects) }
    }

    // AUTHENTICATED ROUTES
    try {
        checkAuth(event);
    } catch (err) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized: Invalid Password' }) }
    }

    // 2. CREATE PROJECT
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body || '{}')
      const rows = await sql`
        INSERT INTO portfolio_projects (
            title, description, image_url, link, github, figma, tags, category, features, challenges, duration, team, role, is_in_development
        ) VALUES (
            ${data.title}, ${data.description || ''}, ${data.imageUrl || ''}, ${data.link || ''}, 
            ${data.github || ''}, ${data.figma || ''}, ${JSON.stringify(data.tags || [])}, 
            ${JSON.stringify(data.category || [])}, ${JSON.stringify(data.features || [])}, 
            ${data.challenges || ''}, ${data.duration || ''}, ${data.team || ''}, ${data.role || ''},
            ${Boolean(data.is_in_development)}
        )
        RETURNING *
      `;
      return { statusCode: 201, headers, body: JSON.stringify({ success: true, project: rows[0] }) }
    }

    // 3. UPDATE PROJECT
    if (event.httpMethod === 'PUT') {
        const data = JSON.parse(event.body || '{}')
        if (!data.id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'ID is required' }) }
        
        await sql`
          UPDATE portfolio_projects SET
              title = ${data.title}, description = ${data.description || ''}, image_url = ${data.imageUrl || ''}, 
              link = ${data.link || ''}, github = ${data.github || ''}, figma = ${data.figma || ''}, 
              tags = ${JSON.stringify(data.tags || [])}, category = ${JSON.stringify(data.category || [])}, 
              features = ${JSON.stringify(data.features || [])}, challenges = ${data.challenges || ''}, 
              duration = ${data.duration || ''}, team = ${data.team || ''}, role = ${data.role || ''},
              is_in_development = ${Boolean(data.is_in_development)},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${data.id}
        `;
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) }
    }

    // 4. DELETE PROJECT
    if (event.httpMethod === 'DELETE') {
        const body = JSON.parse(event.body || '{}');
        const id = body.id || event.queryStringParameters.id;
        if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'ID is required' }) }
        
        await sql`DELETE FROM portfolio_projects WHERE id = ${id}`;
        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  } catch (e) {
    console.error(e)
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) }
  }
}
