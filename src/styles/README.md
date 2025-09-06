# CSS Structure Documentation

Struktur CSS telah diorganisir ulang untuk memudahkan maintenance dan debugging. Berikut adalah penjelasan struktur folder dan file:

## Struktur Folder

```
src/styles/
├── variables.css           # CSS Variables dan tema
├── animations.css          # Animasi dan efek visual
├── components/            # Styling untuk komponen reusable
│   └── modal.css          # Modal styling
└── views/                 # Styling khusus untuk setiap view
    ├── gallery.css        # Main import file untuk Gallery
    ├── gallery-header.css # Header section Gallery
    ├── gallery-filters.css # Filter tabs dan hint components
    ├── gallery-grid.css   # Gallery grid dan card structure
    ├── gallery-overlay.css # Card overlay dan hover effects
    └── gallery-card-back.css # Card back content styling
```

## File CSS Utama

### 1. **variables.css**
- CSS Variables untuk warna, spacing, transition, dll
- Dark theme variables
- Konsisten di seluruh aplikasi

### 2. **animations.css**
- Keyframe animations (@keyframes)
- Utility classes untuk animasi
- Performance optimizations (will-change)

### 3. **views/gallery.css**
- File import utama untuk Gallery view
- Mengimpor semua file CSS yang diperlukan

## File CSS Gallery Specific

### 4. **gallery-header.css**
- Styling untuk header section
- Title dan subtitle animations
- Background gradients dan patterns

### 5. **gallery-filters.css**
- Filter tabs styling
- Hint container dan interaction guides
- Responsive design untuk mobile

### 6. **gallery-grid.css**
- Gallery grid layout
- Card 3D structure
- Focus mode effects
- Empty state styling

### 7. **gallery-overlay.css**
- Card overlay effects
- Flip button styling
- Hover animations
- Enhanced effects untuk flipped cards

### 8. **gallery-card-back.css**
- Card back content layout
- Scrollbar styling
- Project information sections
- Footer buttons

### 9. **components/modal.css**
- Modal overlay dan content
- Close button styling
- Responsive modal design

## Cara Menggunakan

1. **Untuk mengedit styling Gallery**, edit file yang sesuai:
   - Header → `gallery-header.css`
   - Filter → `gallery-filters.css`
   - Grid → `gallery-grid.css`
   - dst.

2. **Untuk menambah variabel baru**, tambahkan di `variables.css`

3. **Untuk menambah animasi baru**, tambahkan di `animations.css`

4. **Untuk styling komponen baru**, buat file di folder `components/`

## Keuntungan Struktur Baru

1. **Modular**: Setiap bagian memiliki file terpisah
2. **Maintainable**: Mudah menemukan dan mengedit styling specific
3. **Reusable**: Variables dan components bisa digunakan ulang
4. **Debuggable**: Easier to trace styling issues
5. **Scalable**: Mudah menambah styling baru tanpa mengotori file utama

## Import di Vue Component

Di file Vue component, cukup import file utama:

```vue
<style scoped>
@import '@/styles/views/gallery.css';

/* Component-specific overrides jika diperlukan */
</style>
```

## Tips Maintenance

1. **Jangan edit CSS di file Vue component** kecuali untuk override specific
2. **Gunakan CSS Variables** untuk nilai yang sering berubah
3. **Group related styles** dalam file yang sama
4. **Comment complex animations** untuk dokumentasi
5. **Test responsive design** setelah perubahan

## Future Improvements

1. Bisa ditambahkan SCSS/Sass untuk nesting
2. PostCSS untuk autoprefixer
3. CSS modules untuk scoping yang lebih baik
4. Build-time optimization untuk production
