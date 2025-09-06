const { neon } = require('@neondatabase/serverless');

// Initialize Neon client - try multiple possible environment variable names
const databaseUrl = process.env.DATABASE_URL || 
                   process.env.NETLIFY_DATABASE_URL || 
                   process.env.NEON_DATABASE_URL ||
                   process.env.NETLIFY_DATABASE_URL_UNPOOLED;

if (!databaseUrl) {
  console.error('No database URL found in environment variables');
}

const sql = neon(databaseUrl);

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  console.log('Function called with method:', event.httpMethod);
  console.log('Database URL exists:', !!databaseUrl);
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Check if database URL is available
  if (!databaseUrl) {
    console.error('Database URL not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Database not configured',
        details: 'DATABASE_URL environment variable is missing'
      })
    };
  }

  try {
    // Initialize database tables if they don't exist
    console.log('Initializing database tables...');
    await initializeTables();

    if (event.httpMethod === 'GET') {
      console.log('Handling GET request...');
      return await getViewCounterData();
    } else if (event.httpMethod === 'POST') {
      console.log('Handling POST request...');
      const data = JSON.parse(event.body);
      console.log('POST data:', data);
      return await updateViewCounterData(data);
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};

async function initializeTables() {
  try {
    console.log('Creating view_counters table...');
    // Create view_counters table
    await sql`
      CREATE TABLE IF NOT EXISTS view_counters (
        id SERIAL PRIMARY KEY,
        page_name VARCHAR(50) NOT NULL UNIQUE,
        view_count INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Creating daily_stats table...');
    // Create daily_stats table
    await sql`
      CREATE TABLE IF NOT EXISTS daily_stats (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        page_name VARCHAR(50) NOT NULL,
        view_count INTEGER DEFAULT 0,
        unique_visitors INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, page_name)
      )
    `;

    console.log('Creating visitor_sessions table...');
    // Create visitor_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS visitor_sessions (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(100) NOT NULL,
        page_name VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT,
        referrer TEXT,
        ip_address INET
      )
    `;

    console.log('Creating global_stats table...');
    // Create global_stats table
    await sql`
      CREATE TABLE IF NOT EXISTS global_stats (
        id SERIAL PRIMARY KEY,
        total_views INTEGER DEFAULT 0,
        unique_visitors INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Checking global stats...');
    // Initialize global stats if empty
    const globalStats = await sql`SELECT * FROM global_stats LIMIT 1`;
    if (globalStats.length === 0) {
      console.log('Initializing global stats...');
      await sql`INSERT INTO global_stats (total_views, unique_visitors) VALUES (0, 0)`;
    }

    console.log('Initializing page counters...');
    // Initialize page counters if empty
    const pages = ['Home', 'About', 'Projects', 'Gallery', 'Contact', 'Analytics'];
    for (const page of pages) {
      await sql`
        INSERT INTO view_counters (page_name, view_count) 
        VALUES (${page}, 0) 
        ON CONFLICT (page_name) DO NOTHING
      `;
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

async function getViewCounterData() {
  try {
    // Get global stats
    const globalStats = await sql`SELECT * FROM global_stats LIMIT 1`;
    const global = globalStats[0] || { total_views: 0, unique_visitors: 0 };

    // Get page-specific view counts
    const pageCountsResult = await sql`SELECT page_name, view_count FROM view_counters ORDER BY page_name`;
    const pages = {};
    pageCountsResult.forEach(row => {
      pages[row.page_name] = row.view_count;
    });

    // Get last 7 days stats
    const last7Days = await sql`
      SELECT 
        date, 
        SUM(view_count) as total,
        SUM(unique_visitors) as unique
      FROM daily_stats 
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date 
      ORDER BY date DESC 
      LIMIT 7
    `;

    // Get last 30 days stats
    const last30Days = await sql`
      SELECT 
        date, 
        SUM(view_count) as total,
        SUM(unique_visitors) as unique
      FROM daily_stats 
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY date 
      ORDER BY date DESC 
      LIMIT 30
    `;

    // Get today's stats
    const todayStats = await sql`
      SELECT 
        SUM(view_count) as total,
        SUM(unique_visitors) as unique
      FROM daily_stats 
      WHERE date = CURRENT_DATE
    `;
    const today = todayStats[0] || { total: 0, unique: 0 };

    const responseData = {
      total: global.total_views,
      uniqueVisitors: global.unique_visitors,
      pages,
      last7Days: last7Days.map(row => ({
        date: row.date,
        total: parseInt(row.total) || 0,
        unique: parseInt(row.unique) || 0
      })),
      last30Days: last30Days.map(row => ({
        date: row.date,
        total: parseInt(row.total) || 0,
        unique: parseInt(row.unique) || 0
      })),
      todayStats: {
        total: parseInt(today.total) || 0,
        unique: parseInt(today.unique) || 0
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };

  } catch (error) {
    console.error('Get data error:', error);
    throw error;
  }
}

async function updateViewCounterData(data) {
  try {
    const { pageName, visitorId, userAgent, referrer } = data;
    const clientIP = data.clientIP || 'unknown';
    const today = new Date().toISOString().split('T')[0];

    // Record visitor session
    await sql`
      INSERT INTO visitor_sessions (visitor_id, page_name, user_agent, referrer, ip_address)
      VALUES (${visitorId}, ${pageName}, ${userAgent}, ${referrer}, ${clientIP})
    `;

    // Update page view count
    await sql`
      UPDATE view_counters 
      SET view_count = view_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE page_name = ${pageName}
    `;

    // Check if visitor is unique for today
    const existingVisitor = await sql`
      SELECT COUNT(*) as count FROM visitor_sessions 
      WHERE visitor_id = ${visitorId} 
      AND DATE(timestamp) = ${today}
      AND id != (SELECT MAX(id) FROM visitor_sessions WHERE visitor_id = ${visitorId})
    `;

    const isUniqueToday = parseInt(existingVisitor[0].count) === 0;

    // Update daily stats
    await sql`
      INSERT INTO daily_stats (date, page_name, view_count, unique_visitors)
      VALUES (${today}, ${pageName}, 1, ${isUniqueToday ? 1 : 0})
      ON CONFLICT (date, page_name) 
      DO UPDATE SET 
        view_count = daily_stats.view_count + 1,
        unique_visitors = daily_stats.unique_visitors + ${isUniqueToday ? 1 : 0},
        updated_at = CURRENT_TIMESTAMP
    `;

    // Update global stats
    await sql`
      UPDATE global_stats 
      SET 
        total_views = total_views + 1,
        unique_visitors = CASE 
          WHEN ${isUniqueToday} THEN unique_visitors + 1 
          ELSE unique_visitors 
        END,
        last_updated = CURRENT_TIMESTAMP
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'View count updated',
        isUniqueToday
      })
    };

  } catch (error) {
    console.error('Update data error:', error);
    throw error;
  }
}
