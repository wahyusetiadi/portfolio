# DESIGN.md

# Portfolio Design System

## 1. Design Direction

Website ini adalah personal portfolio untuk **Fullstack Web Developer**.

Tujuan utama desain adalah menghilangkan kesan:

* AI-generated website
* Generic SaaS landing page
* Template portfolio yang terlalu umum
* Terlalu banyak gradient
* Terlalu banyak glassmorphism
* Card berlebihan
* Animasi dekoratif yang tidak memiliki fungsi
* Typography yang terasa seperti template AI
* Section yang semuanya menggunakan pola visual yang sama

Desain harus terasa seperti dibuat oleh seorang designer/developer yang memiliki **opini visual yang jelas**.

### Design Personality

Gunakan karakter berikut:

* Minimal
* Editorial
* Technical
* Personal
* Confident
* Clean
* Slightly unconventional
* Professional
* Human

Hindari desain yang terlalu:

* Futuristic
* Corporate
* Playful
* SaaS-like
* Neon
* Decorative

---

# 2. Core Design Principle

## Content First

Konten adalah elemen utama.

Jangan menambahkan visual hanya karena sebuah section terlihat kosong.

Whitespace bukan masalah yang harus selalu diisi.

Jika sebuah section sudah memiliki hierarchy yang baik, jangan menambahkan:

* gradient
* blob
* floating icon
* glowing orb
* random illustration
* decorative line
* excessive shadow

hanya untuk membuatnya terlihat "lebih menarik".

---

## Intentional Visual Hierarchy

Setiap halaman harus memiliki hierarchy yang jelas:

1. Primary message
2. Supporting message
3. Primary action
4. Supporting information
5. Secondary content

User harus dapat memahami:

> Siapa saya → apa yang saya kerjakan → apa yang sudah saya kerjakan → bagaimana menghubungi saya.

dalam waktu singkat.

---

# 3. Layout System

Gunakan layout yang konsisten tetapi tidak monoton.

## Container

Desktop:

```css
max-width: 1200px;
margin-inline: auto;
padding-inline: 32px;
```

Tablet:

```css
padding-inline: 24px;
```

Mobile:

```css
padding-inline: 20px;
```

Jangan membuat content terlalu lebar.

Text-heavy content sebaiknya memiliki maximum width sekitar:

```css
max-width: 720px;
```

---

# 4. Spacing

Gunakan spacing system yang konsisten.

Recommended scale:

```text
4px
8px
12px
16px
24px
32px
48px
64px
80px
96px
120px
```

Section spacing:

Desktop:

```text
96px - 140px
```

Tablet:

```text
72px - 96px
```

Mobile:

```text
56px - 80px
```

Jangan menggunakan spacing besar hanya untuk membuat website terlihat "premium".

Spacing harus mengikuti hierarchy konten.

---

# 5. Typography

Typography adalah salah satu elemen visual utama website.

Gunakan maksimal:

* 1 display/heading font
* 1 body font

Hindari menggunakan terlalu banyak font.

## Heading

Heading harus memiliki karakter kuat.

Contoh hierarchy:

```text
Display
64-80px

H1
48-64px

H2
36-48px

H3
24-32px

Body Large
18-20px

Body
16px

Small
14px
```

Mobile:

```text
Display
40-48px

H1
36-44px

H2
30-36px

H3
22-26px

Body
16px
```

Line-height heading:

```text
0.95 - 1.1
```

Body:

```text
1.5 - 1.7
```

Jangan menggunakan heading yang terlalu kecil hanya agar seluruh kalimat masuk dalam satu baris.

---

# 6. Color System

Gunakan palet warna yang restrained.

Default direction:

```text
Background:
#F7F7F5

Foreground:
#171717

Muted:
#6B6B6B

Border:
#E5E5E2

Accent:
#2563EB
```

Accent hanya digunakan untuk:

* CTA
* Link
* Interactive state
* Important highlight
* Small visual emphasis

Jangan menggunakan accent color di setiap section.

---

# 7. Background

Background harus sederhana.

Preferred:

```text
Solid
Off-white
White
Very subtle neutral variation
```

Avoid:

```text
Large gradients
Animated gradients
Mesh gradients
Noise everywhere
Glow effects
Multiple colored backgrounds
```

Background variation boleh digunakan untuk membuat section separation, tetapi harus subtle.

---

# 8. Cards

Card tidak boleh menjadi default container untuk semua konten.

Gunakan card hanya ketika konten memang membutuhkan grouping.

Contoh yang cocok:

* Project
* Experience
* Technical information
* Case study
* Contact information

Tidak semua text harus berada di dalam card.

### Card Style

Preferred:

```text
border: 1px solid var(--border)
border-radius: 8px - 12px
background: transparent / white
```

Shadow harus sangat subtle.

Hindari:

```text
huge shadow
glassmorphism
backdrop-filter
excessive rounded corners
```

---

# 9. Navigation

Navigation harus sederhana.

Desktop:

```text
Logo / Name

About
Work
Experience
Contact

Resume / Contact CTA
```

Mobile:

Gunakan simple menu.

Jangan membuat navigation terlalu kompleks.

Navbar tidak harus selalu floating dengan glass effect.

Jika menggunakan sticky navbar, gunakan:

```text
solid / semi-solid background
subtle border
minimal blur
```

---

# 10. Hero Section

Hero adalah bagian paling penting.

Hero tidak boleh terlihat seperti SaaS landing page.

## Structure

```text
Small introduction

Large personal statement

Short description

Primary CTA
Secondary CTA

Optional supporting information
```

Contoh hierarchy:

```text
FULLSTACK DEVELOPER

I build digital products
that solve real problems.

Fullstack developer focused on building reliable,
useful and thoughtful web applications.

[View Work] [Get in Touch]
```

Jangan menggunakan:

* 3D object
* floating badges
* excessive gradient
* glowing background
* random decorative shapes
* animated particles

kecuali memang memiliki hubungan dengan personal brand.

---

# 11. About Section

About section harus terasa personal.

Hindari copywriting generik seperti:

> "Passionate developer with a strong passion for technology..."

Gunakan bahasa yang lebih natural.

Fokus pada:

* siapa saya
* bagaimana saya bekerja
* apa yang saya sukai
* bagaimana saya memecahkan masalah

Gunakan layout editorial.

Contoh:

```text
ABOUT

I like turning messy ideas into
simple, useful products.

[short paragraph]

[short paragraph]
```

---

# 12. Skills

Jangan membuat grid berisi puluhan logo.

Prioritaskan teknologi yang benar-benar digunakan.

Contoh:

```text
Frontend
Next.js
React
TypeScript

Backend
Node.js
PostgreSQL
Prisma

Tools
Git
Docker
...
```

Gunakan typography atau simple list.

Logo hanya digunakan jika memang meningkatkan recognition.

---

# 13. Projects

Projects adalah bagian terpenting setelah Hero.

Project harus terasa seperti karya nyata, bukan placeholder.

Setiap project minimal memiliki:

```text
Project name
Description
Role
Technology
Outcome
Link
```

Jika tersedia:

```text
Screenshot
Live demo
GitHub
```

---

## Project Layout

Jangan membuat semua project menjadi:

```text
Image
Title
Description
Button
```

Gunakan variasi layout editorial.

Contoh:

```text
Project 01

Large image
Project information
Technology
```

Project berikutnya dapat menggunakan:

```text
Text
Large image
```

Namun variasi harus tetap konsisten dengan grid.

---

# 14. Experience

Gunakan timeline atau editorial list.

Contoh:

```text
2025 — Present
Fullstack Developer
Company Name

Description...

2024 — 2025
Internship
Company Name

Description...
```

Jangan menggunakan card bertumpuk untuk setiap pekerjaan kecuali diperlukan.

---

# 15. Contact

Contact section harus sederhana dan direct.

Contoh:

```text
LET'S WORK TOGETHER

Have a project in mind?
Let's talk.

email@example.com

[Email Me]
[LinkedIn]
[GitHub]
```

Jangan menggunakan form yang terlalu panjang.

---

# 16. Footer

Footer minimal.

Isi:

```text
Name

GitHub
LinkedIn
Email

© 2026 Name
```

Tidak perlu menambahkan banyak link yang tidak diperlukan.

---

# 17. Border Radius

Gunakan radius secara restrained.

Recommended:

```text
Small:
4px

Default:
8px

Large:
12px
```

Hindari:

```text
rounded-full
```

kecuali untuk:

* avatar
* pill
* status
* tag

---

# 18. Animation

Animation harus memiliki tujuan.

Gunakan:

```text
fade
translate
scale
hover
reveal
```

Durasi:

```text
150ms
200ms
300ms
500ms
```

Hindari animation yang terlalu lambat.

Jangan membuat setiap element melakukan animation.

### Preferred

Saat page load:

* Hero muncul
* Navigation muncul
* Main content reveal

Saat interaction:

* button hover
* project hover
* image transition

### Avoid

* infinite floating animation
* rotating shapes
* animated gradients
* excessive parallax
* bouncing elements

Respect:

```css
prefers-reduced-motion
```

---

# 19. Responsive Design

Mobile bukan versi kecil dari desktop.

Layout harus dirancang ulang berdasarkan content priority.

## Desktop

Gunakan:

```text
2-column
asymmetric grid
large typography
generous whitespace
```

## Mobile

Gunakan:

```text
1-column
smaller typography
reduced spacing
full-width content
simplified navigation
```

Jangan mengecilkan desktop layout secara langsung.

---

# 20. Accessibility

Wajib memperhatikan:

* semantic HTML
* keyboard navigation
* visible focus
* sufficient contrast
* alt text
* accessible buttons
* accessible links
* reduced motion
* proper heading hierarchy

Jangan menggunakan warna sebagai satu-satunya indikator informasi.

---

# 21. Anti-AI Design Rules

Rules berikut wajib dipatuhi.

### Jangan

* menggunakan gradient sebagai solusi utama visual
* menggunakan glassmorphism di banyak tempat
* menggunakan rounded cards untuk semua section
* menggunakan terlalu banyak icon
* menggunakan generic AI copywriting
* menggunakan excessive badges
* menggunakan random decorative blobs
* menggunakan excessive shadows
* membuat semua section memiliki background berbeda
* membuat semua element terlihat "floating"
* menambahkan animation tanpa alasan
* menggunakan layout yang terlalu simetris jika content tidak membutuhkan
* membuat website seperti SaaS landing page

### Harus

* memiliki visual hierarchy
* menggunakan whitespace
* menggunakan typography sebagai visual
* menggunakan real project content
* menggunakan screenshot project yang nyata
* menggunakan copy yang personal
* menggunakan layout yang intentional
* menjaga visual restraint
* memiliki karakter personal

---

# 22. Definition of Good Design

Design dianggap berhasil apabila:

1. Website terlihat seperti personal portfolio.
2. Tidak terlihat seperti template AI.
3. Pengunjung langsung memahami siapa pemilik website.
4. Project menjadi fokus utama.
5. Typography terasa intentional.
6. Whitespace digunakan dengan baik.
7. Animasi tidak mengganggu.
8. Mobile experience tetap kuat.
9. Tidak ada visual decoration yang tidak memiliki fungsi.
10. Website memiliki personality yang konsisten.
