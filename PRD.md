# PRD.md

# Product Requirements Document — Personal Portfolio Redesign

## 1. Product Overview

### Product

Personal Portfolio Website

### Purpose

Membangun ulang portfolio website agar terlihat lebih personal, profesional, modern, dan memiliki karakter visual yang kuat tanpa memberikan kesan website yang dibuat secara otomatis oleh AI.

Website harus berfungsi sebagai:

* Personal brand
* Developer portfolio
* Project showcase
* Professional profile
* Contact point

---

# 2. Problem Statement

Versi website saat ini memiliki masalah utama:

> Visual terasa terlalu generic dan memiliki karakteristik umum website yang dibuat menggunakan AI.

Masalah tersebut dapat muncul dari:

* layout yang terlalu predictable
* penggunaan card yang berlebihan
* visual decoration berlebihan
* typography kurang memiliki karakter
* penggunaan gradient/effect yang terlalu sering
* copywriting yang terasa generik
* section yang mengikuti pola landing page SaaS
* kurangnya storytelling personal

Redesign harus mengatasi masalah tersebut tanpa mengorbankan usability.

---

# 3. Product Goals

## Primary Goals

### G1 — Human-designed appearance

Website harus terlihat seperti hasil keputusan desain manusia, bukan hasil template generator.

### G2 — Strong personal identity

Pengunjung harus dapat mengingat:

* siapa pemilik website
* apa yang dikerjakan
* bagaimana cara menghubungi

### G3 — Showcase real work

Projects menjadi salah satu fokus utama.

### G4 — Professional presentation

Website harus cukup profesional untuk digunakan sebagai portfolio ketika:

* mencari pekerjaan
* mencari freelance project
* networking
* memperkenalkan kemampuan teknis

### G5 — Excellent responsive experience

Website harus memiliki pengalaman yang baik pada:

* desktop
* laptop
* tablet
* mobile

---

# 4. Non-Goals

Redesign tidak bertujuan membuat:

* SaaS landing page
* startup landing page
* overly futuristic website
* highly animated website
* design experiment yang mengorbankan usability
* website dengan banyak decorative elements

---

# 5. Target Audience

## Primary

### Recruiter

Membutuhkan informasi cepat tentang:

* identity
* skills
* experience
* projects
* contact

### Developer / Technical Person

Ingin melihat:

* technology stack
* architecture
* project quality
* GitHub
* technical implementation

### Potential Client

Ingin mengetahui:

* apa yang bisa dibuat
* kualitas hasil
* cara menghubungi

---

# 6. User Journey

Primary journey:

```text
Landing
  ↓
Understand who the developer is
  ↓
Read short introduction
  ↓
View projects
  ↓
Explore experience / skills
  ↓
Build trust
  ↓
Contact
```

Website tidak boleh memaksa user membaca semua section.

Information harus dapat dipindai dengan cepat.

---

# 7. Information Architecture

Recommended structure:

```text
/
├── Hero
├── Selected Work
├── About
├── Experience
├── Skills / Stack
├── Contact
└── Footer
```

Optional:

```text
/projects
/projects/[slug]
```

Jika jumlah project cukup banyak.

---

# 8. Functional Requirements

## FR-01 Navigation

User harus dapat berpindah ke section utama dengan mudah.

Navigation minimal:

```text
Home
Work
About
Experience
Contact
```

---

## FR-02 Hero

Hero harus menampilkan:

* name
* role
* short statement
* primary CTA
* secondary CTA

Primary CTA:

```text
View Work
```

Secondary CTA:

```text
Contact Me
```

---

## FR-03 Projects

Setiap project harus memiliki:

* title
* description
* stack
* role
* project image
* live link jika tersedia
* repository link jika tersedia

Project harus menjadi visual focal point.

---

## FR-04 About

About section harus menjelaskan:

* background
* development philosophy
* working approach

Copy harus personal.

---

## FR-05 Experience

Experience harus menampilkan:

* year
* position
* company
* description
* relevant responsibilities

---

## FR-06 Skills

Skills harus dikelompokkan berdasarkan kategori.

Contoh:

```text
Frontend
Backend
Database
Tools
```

Tidak perlu menampilkan teknologi yang tidak benar-benar dikuasai/digunakan.

---

## FR-07 Contact

User harus dapat menghubungi developer melalui:

* Email
* GitHub
* LinkedIn

Contact form bersifat optional.

---

# 9. UX Requirements

## UX-01

User harus dapat memahami role developer dalam ≤ 5 detik.

## UX-02

User harus menemukan project dalam ≤ 10 detik.

## UX-03

CTA utama harus terlihat tanpa scrolling terlalu jauh.

## UX-04

Navigation harus tetap mudah digunakan pada mobile.

## UX-05

Tidak boleh ada interaction yang menghambat content discovery.

---

# 10. Visual Requirements

Visual direction harus mengikuti `DESIGN.md`.

Prioritas:

```text
Typography
Whitespace
Layout
Content
Photography / project screenshots
Color
Animation
Decoration
```

Decoration memiliki prioritas paling rendah.

---

# 11. Content Requirements

Copywriting harus:

* natural
* concise
* specific
* personal
* credible

Hindari:

> "I am a passionate developer who loves turning ideas into innovative digital solutions."

Lebih baik:

> "I build web applications that turn complex workflows into simpler tools."

Copy harus berdasarkan pengalaman nyata.

Jangan membuat klaim yang tidak dapat dibuktikan.

---

# 12. Performance Requirements

Target:

* fast initial load
* optimized images
* lazy loading untuk content non-critical
* minimal JavaScript
* avoid unnecessary animation libraries
* avoid unnecessary dependencies

Images harus menggunakan optimization bawaan framework jika tersedia.

---

# 13. Accessibility Requirements

Minimum:

* WCAG-conscious contrast
* semantic HTML
* keyboard support
* focus states
* screen-reader friendly labels
* alt text
* reduced motion

---

# 14. SEO Requirements

Homepage harus memiliki:

```text
title
description
Open Graph metadata
favicon
canonical URL
```

Recommended title:

```text
[Name] — Fullstack Web Developer
```

Description harus menjelaskan:

* siapa
* role
* specialization
* value

---

# 15. Responsive Requirements

Breakpoints harus mengikuti kebutuhan content, bukan hanya device names.

Minimum testing:

```text
Desktop
1440px
1280px

Tablet
1024px
768px

Mobile
430px
390px
375px
```

Tidak boleh ada:

* horizontal overflow
* clipped text
* broken navigation
* oversized images
* inaccessible buttons
* overlapping content

---

# 16. Animation Requirements

Animation harus:

* subtle
* fast
* purposeful

Animation tidak boleh:

* menghalangi interaction
* memperlambat page
* menjadi fokus utama
* digunakan pada setiap section

---

# 17. Technical Requirements

Project harus mempertahankan stack yang sudah digunakan selama tidak ada alasan kuat untuk menggantinya.

Prioritas:

```text
Existing framework
Existing deployment
Existing data model
Existing integrations
```

Jangan melakukan migration besar hanya untuk redesign visual.

---

# 18. Component Requirements

Reusable components dapat digunakan untuk:

```text
Navbar
Button
SectionHeader
ProjectCard
ProjectList
ExperienceItem
SkillGroup
SocialLink
Footer
```

Namun jangan memaksa semua content menjadi component yang sama jika kebutuhan visual berbeda.

Reusable ≠ visually identical.

---

# 19. Design Validation

Setiap section harus melalui pertanyaan:

### Q1

Apakah section ini memiliki tujuan?

### Q2

Apakah content-nya benar-benar diperlukan?

### Q3

Apakah decoration meningkatkan UX?

### Q4

Apakah section ini terlihat seperti template AI?

### Q5

Apakah typography dan spacing memiliki hierarchy?

### Q6

Apakah section masih bekerja dengan baik di mobile?

Jika jawaban terhadap Q4 adalah "ya", redesign section tersebut.

---

# 20. Acceptance Criteria

Redesign dianggap selesai apabila:

* [ ] Website memiliki visual identity yang konsisten.
* [ ] Website tidak terlihat seperti generic AI portfolio.
* [ ] Hero memiliki personal identity yang jelas.
* [ ] Project showcase menjadi focal point.
* [ ] Copywriting terasa natural.
* [ ] Tidak ada excessive gradient.
* [ ] Tidak ada excessive glassmorphism.
* [ ] Tidak semua content menggunakan card.
* [ ] Animation digunakan secara restrained.
* [ ] Mobile layout tidak memiliki horizontal overflow.
* [ ] Navigation mudah digunakan.
* [ ] Accessibility dasar terpenuhi.
* [ ] SEO metadata tersedia.
* [ ] Images dioptimalkan.
* [ ] Tidak ada placeholder content pada production.
* [ ] Tidak ada decorative component yang tidak memiliki tujuan.

---

# 21. Success Metrics

Qualitative:

* Website terasa personal.
* Website terasa professionally designed.
* Project terlihat credible.
* Visual memiliki karakter.
* User dapat memahami profile dengan cepat.

Technical:

* No horizontal overflow.
* No major responsive issues.
* No accessibility blocker.
* No console errors.
* Good Lighthouse performance.

---

# 22. Priority

### P0 — Critical

* Hero
* Navigation
* Projects
* Responsive
* Typography
* Overall visual identity

### P1 — Important

* About
* Experience
* Skills
* Contact
* Animation
* SEO

### P2 — Nice to Have

* Project detail pages
* Advanced transitions
* Case studies
* Theme customization

---

# 23. Final Product Principle

The portfolio should communicate:

> "This is a developer who knows what they are building and why."

Not:

> "This is a website generated by an AI with many modern UI effects."
