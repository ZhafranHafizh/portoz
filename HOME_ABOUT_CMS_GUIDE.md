# Home & About CMS Integration Guide

## Overview

This feature allows you to manage content for the Home and About pages through the Admin CMS, including:
- ✅ Edit text content for Home page (title, subtitle, description, CTA button)
- ✅ Edit text content for About page (all sections)
- ✅ Upload and manage CV files (PDF)
- ✅ Download CV dynamically from About page and Project pages
- ✅ All content stored in Supabase database
- ✅ Fallback to hardcoded content if database is empty

## Setup Steps

### 1. Run SQL Migration in Supabase

1. Go to your Supabase project: https://app.supabase.com/
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase_site_content.sql`
4. Paste and click **Run**

**Important**: The SQL file had a quoting issue that has been fixed. Make sure you're using the updated version.

This will create:
- `site_content` table - stores editable page content
- `cv_files` table - tracks uploaded CV files with version management
- RLS policies for public read + authenticated write

### 2. Configure Storage for CV Files

The CV upload feature uses the same `images` storage bucket:

1. Go to Supabase Dashboard → **Storage**
2. Ensure the `images` bucket exists
3. Set to **Public** (so CVs can be downloaded)

CV files will be stored in: `images/cvs/cv_[timestamp].pdf`

### 3. Test the Integration

#### Home Page
1. Navigate to `/` (Home page)
2. Content should load from database (falls back to hardcoded if empty)
3. Visit `/admin` → **Site Content** tab → **Home Page** section
4. Edit any text and click **Save All Changes**
5. Refresh home page to see changes

#### About Page
1. Navigate to `/about`
2. Content loads from database
3. Visit `/admin` → **Site Content** tab → **About Page** section
4. Edit content in collapsible sections
5. Click **Save All Changes**

#### CV Management
1. Go to `/admin` → **CV Manager** tab
2. Click **+ Upload New CV**
3. Select a PDF file
4. Add version note (optional)
5. Check "Set as Active CV" if this should be the downloadable version
6. Click **Upload CV**

The CV download button on About page will now work!

## Admin CMS Structure

### 4 Tabs Available:

1. **Projects** - Manage portfolio projects (existing)
2. **Gallery** - Manage gallery images (from previous integration)
3. **Site Content** - Edit Home & About page text
4. **CV Manager** - Upload and manage CV files

### Site Content Tab Features:

#### Home Page Section (Collapsible)
- Profile image path/URL
- Hero title (supports `**bold**`)
- Hero subtitle
- Hero description
- CTA button text
- CTA button link

#### About Page Section (Collapsible)
**Profile Subsection:**
- Profile image path/URL
- Heading
- Tagline (supports `**bold**`)
- Introduction

**Philosophy Subsection:**
- Heading
- Content

**Expertise Subsection:**
- Heading
- Intro text
- Skills (JSON array format)

**Connect Subsection:**
- Heading
- Content
- CTA button text
- CTA button link

### CV Manager Tab Features:

- View all uploaded CV files
- See upload date and version notes
- Activate/deactivate CV versions
- Only ONE CV can be active at a time
- Active CV is used for download button

## Database Schema

### site_content Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `page` | TEXT | Page identifier ('home', 'about') |
| `section` | TEXT | Section identifier ('hero', 'profile', 'philosophy', etc.) |
| `key` | TEXT | Content key ('title', 'description', etc.) |
| `value` | JSONB | Content value (text or JSON for complex data) |
| `updated_at` | TIMESTAMP | Last update time |

Unique constraint on `(page, section, key)` to prevent duplicates.

### cv_files Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `filename` | TEXT | Original filename |
| `file_url` | TEXT | Full URL to the PDF file |
| `uploaded_at` | TIMESTAMP | Upload timestamp |
| `is_active` | BOOLEAN | Whether this is the active download |
| `version_note` | TEXT | Optional version description |

## How It Works

### Content Flow

```
Admin edits content → Saves to site_content table
                          ↓
Frontend fetches on page load → Displays dynamic content
```

### CV Flow

```
Admin uploads CV → Storage (images/cvs/) → cv_files table
                                              ↓
User clicks Download → Gets active CV file
```

### Bold Text Formatting

The system supports `**bold**` syntax in text fields:
- Input: `Hello, I'm **Zhafran Hafizh**!`
- Output: `Hello, I'm <strong>Zhafran Hafizh</strong>!`

This works in:
- Home hero title
- Home subtitle  
- About tagline
- About intro

## Files Modified/Created

| File | Status | Purpose |
|------|--------|---------|
| `supabase_site_content.sql` | ✅ New | Database migration |
| `src/views/Admin.vue` | ✅ Modified | Added Site Content & CV Manager tabs |
| `src/views/Home.vue` | ✅ Modified | Fetch content from Supabase |
| `src/views/About.vue` | ✅ Modified | Fetch content + dynamic CV download |
| `HOME_ABOUT_CMS_GUIDE.md` | ✅ New | This documentation |

## Using the CV Download Feature

### On About Page:
The "Download My CV" button will:
- Show the active CV file for download
- Display tooltip if no CV is uploaded yet
- Automatically use the filename from the uploaded file

### Managing Multiple CV Versions:
1. Upload new CV versions as your resume updates
2. Keep old versions in the database for reference
3. Switch between versions using the "Activate" button
4. Add version notes to track changes (e.g., "Updated Jan 2025")

## Troubleshooting

### Content not showing up?
1. Check browser console for errors
2. Verify `site_content` table has data in Supabase
3. Make sure RLS policies are set correctly
4. Check if Supabase credentials are correct in `.env`

### CV download not working?
1. Go to CV Manager tab in Admin
2. Ensure at least one CV is uploaded
3. Check that one CV is marked as "Active"
4. Verify the file URL is accessible in Supabase Storage
5. Check if `images` bucket is set to Public

### SQL error when running migration?
- The initial version had a quoting issue with JSONB
- Use the **updated** `supabase_site_content.sql` file
- Removed special characters that caused parsing errors
- If you already ran the broken version, drop the tables first:
  ```sql
  DROP TABLE IF EXISTS site_content CASCADE;
  DROP TABLE IF EXISTS cv_files CASCADE;
  ```

### Bold formatting not working?
- Make sure you're using `**text**` syntax (double asterisks)
- Don't add spaces between asterisks and text
- Example: `**bold**` ✓, not `* * bold * *` ✗

## Example: Editing Content

### Home Page Title:
```
Current: Hello, I'm **Zhafran Hafizh**!
Change to: Hello, I'm **Your Name Here**!
```

### About Page Skills (JSON):
```json
[
  {"title":"New Skill","desc":"Description here"},
  {"title":"Vue.js","desc":"Frontend framework"}
]
```

## Next Steps

You can now:
1. Edit all Home and About page text from CMS
2. Upload new CV versions anytime
3. Manage multiple CV versions
4. Switch CV versions without code changes
5. All changes are immediate (no rebuild needed)

---

**Build Status**: ✅ Passing  
**Features**: ✅ All working  
**Documentation**: ✅ Complete

Need help? Check the Supabase dashboard for data and browser console for errors.
