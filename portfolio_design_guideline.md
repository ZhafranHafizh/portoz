# Design Guideline — One Page Software Engineer Portfolio

Dokumen ini berisi panduan desain dan implementasi untuk menyesuaikan codebase portfolio agar mengikuti style one-page portfolio modern, minimalis, dan personal. Gunakan guideline ini sebagai instruksi untuk agent coder.

---

## 1. Tujuan Desain

Bangun website portfolio one-page untuk seorang Software Engineer dengan karakter:

- Modern, minimalis, dan premium.
- Tidak terlihat seperti template AI-generated.
- Banyak ruang kosong, typography kuat, dan layout clean.
- Fokus pada konten: profil singkat, project, gallery, dan kontak.
- Interaksi sederhana namun terasa polished.
- Responsif di desktop, tablet, dan mobile.

Portfolio harus terasa seperti website personal engineer yang matang, bukan landing page generik.

---

## 2. Struktur Halaman

Website harus berupa single page dengan urutan section berikut:

1. `Home`
2. `About`
3. `Projects`
4. `Gallery`
5. `Contact`

Gunakan anchor link untuk navigasi:

```txt
#home
#about
#projects
#gallery
#contact
```

Navbar harus fixed di atas halaman dengan efek translucent/blur.

---

## 3. Visual Direction

### Style Umum

Gunakan pendekatan visual:

- Minimalis
- Warm
- Editorial
- Personal
- Clean engineering aesthetic

Hindari:

- Gradient berlebihan
- Warna neon
- Shadow terlalu tebal
- Card terlalu ramai
- Banyak emoji
- Copywriting yang terlalu generik
- Tampilan seperti dashboard SaaS template

### Warna Utama

Gunakan palet warna hangat dan netral:

```css
background: #f7f4ef;
text-primary: #181716;
text-muted: rgba(0, 0, 0, 0.55);
border-soft: rgba(0, 0, 0, 0.10);
card-bg: rgba(255, 255, 255, 0.40);
dark-section: #000000;
```

Gunakan warna hitam sebagai aksen utama untuk button, contact section, dan selected CTA.

### Typography

Gunakan font sans-serif modern. Prioritaskan font yang sudah tersedia di project.

Rekomendasi:

- Inter
- Geist
- Satoshi
- Manrope
- Neue Haas Grotesk jika tersedia

Karakter typography:

- Heading besar
- Letter spacing sedikit negatif
- Body text lega dan mudah dibaca
- Uppercase label kecil untuk nama section

Contoh style heading:

```css
font-size: clamp(3rem, 8vw, 7rem);
font-weight: 600;
letter-spacing: -0.06em;
line-height: 0.95;
```

Contoh label section:

```css
font-size: 0.875rem;
text-transform: uppercase;
letter-spacing: 0.35em;
color: rgba(0, 0, 0, 0.45);
```

---

## 4. Layout Global

Gunakan container max width:

```css
max-width: 72rem; /* Tailwind: max-w-6xl */
padding-inline: 1.25rem; /* Tailwind: px-5 */
margin-inline: auto;
```

Spacing antar section:

```css
padding-block: 7rem; /* Tailwind: py-28 */
```

Gunakan border top tipis untuk memisahkan section:

```css
border-top: 1px solid rgba(0, 0, 0, 0.10);
padding-top: 2.5rem;
```

---

## 5. Navbar

Navbar harus:

- Fixed di bagian atas.
- Background semi transparan.
- Menggunakan backdrop blur.
- Border bawah tipis.
- Logo pendek di kiri.
- Link section di tengah atau kanan.
- CTA kecil di kanan: `Let's talk`.

Style:

```css
position: fixed;
top: 0;
left: 0;
right: 0;
z-index: 40;
background: rgba(247, 244, 239, 0.8);
backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(0, 0, 0, 0.10);
```

Logo bisa berupa inisial, contoh:

```txt
RZ.
```

Silakan ganti sesuai nama user.

---

## 6. Section Home

Home adalah section pertama dan harus memenuhi tinggi layar.

Konten utama:

- Label kecil: `Software Engineer`
- Headline besar dan kuat
- Deskripsi singkat
- CTA:
  - `View projects`
  - `More about me`
- Foto profil atau portrait placeholder
- Status kecil seperti `Available for selected work`
- Lokasi singkat

Contoh headline:

```txt
Building clean, useful, and quietly reliable digital products.
```

Contoh deskripsi:

```txt
Saya mengembangkan aplikasi web yang rapi, cepat, dan mudah digunakan — dari frontend yang halus sampai backend yang terstruktur.
```

Layout desktop:

```txt
[Text besar kiri] [Foto portrait kanan]
```

Layout mobile:

```txt
[Text]
[CTA]
[Foto]
```

Foto:

- Aspect ratio 4:5
- Rounded besar
- Bisa grayscale
- Tidak perlu terlalu formal
- Pastikan `alt` jelas

---

## 7. Section About

About harus berisi:

- Label: `About`
- Heading pendek yang terasa personal
- Paragraf brief tentang user
- Button download CV/resume

Contoh heading:

```txt
I care about details, but I care more about shipping things that work.
```

Contoh body:

```txt
Halo, saya [Nama Kamu], seorang software engineer yang suka membangun produk digital dengan pendekatan sederhana: pahami masalahnya, rancang alurnya, lalu buat solusi yang stabil dan nyaman dipakai. Saya terbiasa bekerja dengan JavaScript ecosystem, API, database, dan deployment modern.
```

Button download:

```html
<a href="/resume.pdf" download>Download CV / Resume</a>
```

Pastikan file resume tersedia di folder public dengan nama:

```txt
public/resume.pdf
```

---

## 8. Section Projects

Projects harus menampilkan daftar project yang pernah dikerjakan.

Setiap project minimal punya data:

```ts
type Project = {
  title: string;
  type: string;
  year: string;
  description: string;
  detail: string;
  stack: string[];
  link: string;
};
```

Tampilan list project:

- Gunakan row list, bukan card grid biasa.
- Setiap row punya:
  - Nomor urut
  - Nama project
  - Deskripsi singkat
  - Icon arrow
- Row bisa diklik.
- Saat diklik, tampilkan modal detail project.

Contoh project data:

```ts
const projects = [
  {
    title: "Fintrack Dashboard",
    type: "Web App",
    year: "2025",
    description: "Dashboard keuangan untuk memantau cashflow, kategori pengeluaran, dan laporan bulanan secara ringkas.",
    detail: "Project ini fokus pada pengalaman pengguna yang cepat dan jelas. Saya membangun struktur data transaksi, filter laporan, visualisasi ringkas, serta layout dashboard yang tetap nyaman digunakan di layar kecil.",
    stack: ["React", "TypeScript", "Tailwind", "Chart.js"],
    link: "#"
  }
];
```

### Project Modal

Modal detail harus muncul saat project diklik.

Isi modal:

- Project type
- Year
- Title
- Detail description
- Tech stack chips
- Link button: `Open project`
- Close button

Modal behavior:

- Klik backdrop menutup modal.
- Klik tombol close menutup modal.
- Klik isi modal tidak menutup modal.
- Gunakan `role="dialog"` dan `aria-modal="true"` untuk accessibility.

Jangan gunakan alert atau halaman detail terpisah kecuali diminta.

---

## 9. Section Gallery

Gallery berisi foto-foto personal atau aktivitas user beserta caption.

Tampilan:

- Grid 2 kolom di desktop.
- 1 kolom di mobile.
- Gambar aspect ratio 4:3.
- Card rounded besar.
- Caption singkat di bawah gambar.
- Hover image scale sangat halus.

Data gallery:

```ts
const gallery = [
  {
    src: "/gallery/photo-1.jpg",
    caption: "Weekend recharge — keluar sebentar dari layar."
  },
  {
    src: "/gallery/photo-2.jpg",
    caption: "Desk setup ketika sedang fokus membangun fitur baru."
  }
];
```

Jika belum ada foto asli, gunakan placeholder sementara. Namun struktur harus memudahkan user mengganti foto ke asset lokal.

Rekomendasi folder:

```txt
public/gallery/photo-1.jpg
public/gallery/photo-2.jpg
public/gallery/photo-3.jpg
public/gallery/photo-4.jpg
```

---

## 10. Section Contact

Contact harus terasa kuat sebagai final CTA.

Gunakan background hitam penuh pada card besar.

Isi:

- Label: `Contact`
- Heading besar
- Email
- GitHub
- LinkedIn
- Lokasi

Contoh heading:

```txt
Have an idea? Let's build it properly.
```

Contoh kontak:

```txt
hello@email.com
github.com/username
linkedin.com/in/username
Jakarta, Indonesia
```

Pastikan semua link benar:

```html
<a href="mailto:hello@email.com">hello@email.com</a>
<a href="https://github.com/username">github.com/username</a>
<a href="https://linkedin.com/in/username">linkedin.com/in/username</a>
```

---

## 11. Icon Guideline

Jangan bergantung pada CDN eksternal untuk icon.

Jika project tidak menjamin package icon tersedia, gunakan inline SVG lokal.

Hindari import seperti ini jika environment sering gagal fetch dependency:

```ts
import { ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";
```

Gunakan alternatif:

- Inline SVG component
- Asset SVG lokal di folder `public/icons`
- Icon system yang sudah tersedia di codebase

Contoh inline icon:

```tsx
function ArrowUpRightIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
```

---

## 12. Animation Guideline

Gunakan animasi secukupnya.

Boleh menggunakan:

- Fade in
- Slight translate Y
- Hover scale kecil
- Modal entrance
- Image hover scale

Hindari:

- Animasi terlalu cepat
- Animasi berlebihan di setiap elemen
- Parallax berat
- Cursor custom yang mengganggu

Jika menggunakan Framer Motion:

```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
>
  ...
</motion.div>
```

Jika dependency Framer Motion tidak tersedia, gunakan CSS transition biasa.

---

## 13. Responsiveness

Breakpoint utama:

- Mobile: default
- Tablet/Desktop: `md`
- Large desktop: `lg`

Rules:

- Home desktop: 2 kolom.
- Home mobile: 1 kolom.
- Navbar link bisa disembunyikan di mobile.
- Gallery desktop: 2 kolom.
- Projects tetap list, bukan carousel.
- Contact section stack di mobile.

Pastikan tidak ada horizontal scroll.

---

## 14. Accessibility

Wajib:

- Gunakan semantic HTML:
  - `main`
  - `header`
  - `nav`
  - `section`
  - `footer`
- Semua gambar punya `alt`.
- Button punya `type="button"` jika bukan submit.
- Modal punya:
  - `role="dialog"`
  - `aria-modal="true"`
  - `aria-labelledby`
- Close button punya `aria-label`.
- Link harus jelas dan bisa difokuskan dengan keyboard.

Disarankan:

- Tambahkan visible focus state.
- Pastikan contrast cukup.
- Hindari text terlalu kecil pada body.

---

## 15. Testing Guideline

Tambahkan `data-testid` pada section dan elemen interaktif utama.

Minimal test id:

```txt
portfolio-page
home-section
about-section
projects-section
project-card-1
project-card-2
project-card-3
gallery-section
gallery-item-1
contact-section
project-modal
project-modal-backdrop
```

Test minimal yang perlu dibuat:

1. Page render tanpa crash.
2. Semua section utama tampil.
3. Project list tampil minimal 1 project.
4. Klik project membuka modal.
5. Klik close button menutup modal.
6. Klik backdrop menutup modal.
7. Link download resume mengarah ke `/resume.pdf`.
8. Contact links punya href yang valid.

Contoh test dengan React Testing Library:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import PortfolioTemplate from "./PortfolioTemplate";

describe("PortfolioTemplate", () => {
  it("renders all main sections", () => {
    render(<PortfolioTemplate />);

    expect(screen.getByTestId("portfolio-page")).toBeInTheDocument();
    expect(screen.getByTestId("home-section")).toBeInTheDocument();
    expect(screen.getByTestId("about-section")).toBeInTheDocument();
    expect(screen.getByTestId("projects-section")).toBeInTheDocument();
    expect(screen.getByTestId("gallery-section")).toBeInTheDocument();
    expect(screen.getByTestId("contact-section")).toBeInTheDocument();
  });

  it("opens project modal when a project is clicked", () => {
    render(<PortfolioTemplate />);

    fireEvent.click(screen.getByTestId("project-card-1"));

    expect(screen.getByTestId("project-modal")).toBeInTheDocument();
  });

  it("has resume download link", () => {
    render(<PortfolioTemplate />);

    const resumeLink = screen.getByText(/Download CV/i);
    expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
  });
});
```

---

## 16. Content Replacement Rules

Agent coder harus mengganti placeholder berikut:

```txt
[Nama Kamu]
hello@email.com
github.com/username
linkedin.com/in/username
Jakarta, Indonesia
/resume.pdf
```

Ganti juga:

- Project dummy dengan project asli.
- Gallery placeholder dengan foto asli.
- Logo inisial `RZ.` dengan inisial user.
- Foto profil placeholder dengan foto asli.

Jangan mengubah struktur utama section kecuali diminta.

---

## 17. Implementation Notes

Jika menggunakan Next.js:

- Component bisa diletakkan di `app/page.tsx`.
- Asset resume di `public/resume.pdf`.
- Gallery images di `public/gallery`.
- Gunakan `next/image` jika ingin optimasi image.
- Pastikan semua external link menggunakan `target="_blank"` dan `rel="noreferrer"` jika dibuka di tab baru.

Jika menggunakan Vite React:

- Component bisa diletakkan di `src/App.tsx`.
- Asset public tetap di folder `public`.
- Pastikan Tailwind sudah aktif.

Jika Tailwind belum tersedia:

- Setup Tailwind terlebih dahulu, atau konversi class Tailwind menjadi CSS module/global CSS.
- Jangan mencampur terlalu banyak inline style.

---

## 18. Definition of Done

Portfolio dianggap selesai jika:

- Semua section ada dan berfungsi.
- Navbar anchor berjalan.
- Project bisa diklik dan modal detail muncul.
- Modal bisa ditutup.
- Gallery tampil rapi dan responsif.
- Contact link valid.
- Resume download link tersedia.
- Tidak ada error build.
- Tidak bergantung pada CDN icon eksternal.
- Tampilan tetap clean di mobile dan desktop.
- Test minimal berhasil dijalankan.

---

## 19. Final Reminder for Agent

Prioritaskan hasil yang terlihat natural, personal, dan rapi.

Jangan membuat desain terlalu ramai. Jangan menambahkan section baru tanpa instruksi. Jangan menggunakan icon/package eksternal jika environment tidak mendukung. Pertahankan visual warm minimal dengan spacing lega, border tipis, rounded besar, dan typography yang kuat.
