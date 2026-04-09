# Gallery CMS Integration Guide

This guide will help you complete the integration of the Gallery CMS feature for your portfolio website.

## Overview

The Gallery CMS feature allows you to:
- ✅ Upload, edit, and delete gallery images through the Admin CMS
- ✅ Categorize images (UI/UX Design, Website, Mobile App, Branding)
- ✅ Control display order of gallery items
- ✅ Automatically sync gallery data with Supabase database

## Setup Steps

### 1. Run the SQL Migration in Supabase

You need to create the `gallery_images` table in your Supabase database:

1. Go to your Supabase project dashboard: https://app.supabase.com/
2. Navigate to **SQL Editor** (in the left sidebar)
3. Copy the contents of `supabase_gallery_setup.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the migration

This will:
- Create the `gallery_images` table
- Enable Row Level Security (RLS)
- Create read/write policies
- Seed initial data from your existing hardcoded gallery images

### 2. Configure Supabase Storage Bucket

The gallery uses the same `images` bucket as your projects. Make sure it exists:

1. Go to your Supabase project dashboard
2. Navigate to **Storage** (in the left sidebar)
3. Check if the `images` bucket exists
4. If it doesn't exist:
   - Click **New Bucket**
   - Name it `images`
   - Set it to **Public** (so images can be viewed on the frontend)

### 3. Test the Integration

#### Frontend Gallery Page
1. Navigate to `/gallery` on your local development server
2. The gallery should now load images from Supabase instead of hardcoded data
3. You should see a loading spinner while data fetches

#### Admin CMS
1. Navigate to `/admin` on your local development server
2. Login with your credentials
3. You should see two tabs: **Projects** and **Gallery**
4. Click the **Gallery** tab
5. Try the following:
   - Click **+ Add Gallery Image** to upload a new image
   - Edit an existing gallery item
   - Delete a gallery item
   - Change the display order to reorder images

### 4. Upload Your Own Images

To add your own gallery images:

1. Go to `/admin` → **Gallery** tab
2. Click **+ Add Gallery Image**
3. Fill in the form:
   - **Title**: Name of your project/work
   - **Description**: Brief description of the work
   - **Image Upload**: Select an image file (JPG, PNG, WebP recommended)
   - **Category**: Choose from dropdown (UI/UX Design, Website, Mobile App, Branding)
   - **Display Order**: Number to control sorting (lower = first)
4. Click **Save Gallery Image**

The image will be:
- Uploaded to Supabase Storage (`images/gallery/` path)
- Saved to the `gallery_images` table
- Immediately visible on the `/gallery` page

## Database Schema

### gallery_images Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `title` | TEXT | Title of the gallery item |
| `description` | TEXT | Description (optional) |
| `image_url` | TEXT | URL to the image (required) |
| `category` | TEXT | Category: UI/UX Design, Website, Mobile App, Branding |
| `display_order` | INTEGER | Sort order (lower numbers appear first) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## File Upload Path Structure

Images are stored in the `images` bucket with the following structure:

```
images/
├── project-images/     # Project images (from Projects CMS)
│   └── [random].jpg
└── gallery/            # Gallery images (new)
    └── [random].jpg
```

## Features

### Admin CMS (Gallery Tab)
- ✅ View all gallery items in a table
- ✅ Add new gallery images with file upload
- ✅ Edit existing gallery items
- ✅ Delete gallery images
- ✅ Set display order for custom sorting
- ✅ Category dropdown for easy categorization

### Gallery Page
- ✅ Fetches data from Supabase in real-time
- ✅ Loading state while fetching
- ✅ Category filtering (All, UI/UX Design, Website, Mobile App, Branding)
- ✅ 3D card flip for descriptions
- ✅ Parallax hover effect
- ✅ Modal preview
- ✅ Empty state when no images

## Troubleshooting

### Gallery not loading on frontend?
1. Check browser console for errors
2. Verify Supabase credentials in environment variables
3. Check if the `gallery_images` table exists in Supabase
4. Verify RLS policies are set correctly

### Image upload failing?
1. Check if the `images` storage bucket exists in Supabase
2. Ensure the bucket is set to **Public**
3. Check browser console for upload errors
4. Verify file size (Supabase free tier: max 50MB per file)

### CORS issues?
- Make sure your Supabase URL is correctly set in `.env` or Netlify environment variables
- Check that CORS is properly configured in Supabase settings

## Next Steps

You can now:
1. Remove the hardcoded image data from Gallery.vue (already done ✅)
2. Add more images through the CMS
3. Reorder them using the `display_order` field
4. Categorize them properly for better filtering

## Files Modified

1. **supabase_gallery_setup.sql** - New file with database migration
2. **src/views/Admin.vue** - Added Gallery tab and CRUD functionality
3. **src/views/Gallery.vue** - Updated to fetch from Supabase instead of hardcoded data

## Environment Variables

Make sure these are set in Netlify (or your `.env` file for local development):

```
VUE_APP_SUPABASE_URL=your_supabase_project_url
VUE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

If you encounter any issues, check the browser console for errors and verify your Supabase setup.
