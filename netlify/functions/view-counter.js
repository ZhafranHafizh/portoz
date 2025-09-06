import { neon } from '@netlify/neon'       // wrapper resmi Netlify
import { neonConfig } from '@neondatabase/serverless'

neonConfig.fetchConnectionCache = true
const sql = neon() // otomatis pakai NETLIFY_DATABASE_URL(_UNPOOLED)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
}

let didInit = false
async function ensureSchema() {
  if (didInit) return
  await sql`CREATE TABLE IF NOT EXISTS view_counters(
    id SERIAL PRIMARY KEY,
    page_name VARCHAR(100) NOT NULL UNIQUE,
    view_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
  await sql`CREATE TABLE IF NOT EXISTS daily_stats(
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    page_name VARCHAR(100) NOT NULL,
    view_count INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, page_name)
  )`
  await sql`CREATE TABLE IF NOT EXISTS visitor_sessions(
    id SERIAL PRIMARY KEY,
    visitor_id VARCHAR(100) NOT NULL,
    page_name VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    referrer TEXT,
    ip_address INET
  )`
  await sql`CREATE TABLE IF NOT EXISTS global_stats(
    id SERIAL PRIMARY KEY,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
  await sql`INSERT INTO global_stats (total_views, unique_visitors)
            VALUES (0,0) ON CONFLICT DO NOTHING`
  didInit = true
}

export async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }

    // sanity check koneksi
    await sql`select 1 as ok`
    await ensureSchema()

    if (event.httpMethod === 'GET') {
      const [global] = await sql`SELECT * FROM global_stats LIMIT 1`
      const rows = await sql`SELECT page_name, view_count FROM view_counters ORDER BY page_name`
      const pages = Object.fromEntries(rows.map(r => [r.page_name, r.view_count]))
      return { statusCode: 200, headers, body: JSON.stringify({ total: global?.total_views ?? 0, pages }) }
    }

    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body || '{}')
      const { pageName = 'Home', visitorId = 'anon', userAgent = '', referrer = '' } = data
      const ip =
        event.headers['x-nf-client-connection-ip'] ||
        (event.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
        null
      const today = new Date().toISOString().slice(0, 10)

      await sql`INSERT INTO visitor_sessions(visitor_id, page_name, user_agent, referrer, ip_address)
                VALUES(${visitorId}, ${pageName}, ${userAgent}, ${referrer}, ${ip})`

      await sql`INSERT INTO view_counters(page_name, view_count)
                VALUES(${pageName}, 1)
                ON CONFLICT (page_name) DO UPDATE
                SET view_count = view_counters.view_count + 1, updated_at = CURRENT_TIMESTAMP`

      const [{ count }] = await sql`
        SELECT COUNT(*)::int AS count FROM visitor_sessions
        WHERE visitor_id = ${visitorId} AND DATE(timestamp) = ${today}
      `
      const isUniqueToday = count <= 1  // kunjungan pertama hari ini

      await sql`INSERT INTO daily_stats(date, page_name, view_count, unique_visitors)
                VALUES(${today}, ${pageName}, 1, ${isUniqueToday ? 1 : 0})
                ON CONFLICT (date, page_name) DO UPDATE
                SET view_count = daily_stats.view_count + 1,
                    unique_visitors = daily_stats.unique_visitors + ${isUniqueToday ? 1 : 0},
                    updated_at = CURRENT_TIMESTAMP`

      await sql`UPDATE global_stats
                SET total_views = total_views + 1,
                    last_updated = CURRENT_TIMESTAMP`

      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, isUniqueToday }) }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  } catch (e) {
    console.error(e)
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) }
  }
}
