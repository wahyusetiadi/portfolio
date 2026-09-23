# Pending Tasks Portfolio

Dokumen ini berisi pekerjaan yang masih membutuhkan data nyata dari pemilik portfolio. Isi datanya melalui menu Admin, kemudian klik **Simpan Perubahan**.

## 1. Data Project Nyata

Menu: **Admin → Proyek**

Untuk setiap project, lengkapi:

- Judul yang spesifik dan mudah dipahami.
- Deskripsi dalam 1–2 kalimat: jelaskan produk yang dibuat dan masalah yang diselesaikan.
- Teknologi yang benar-benar digunakan.
- Tahun pengerjaan.
- Link GitHub yang dapat dibuka.
- Link demo yang aktif, jika tersedia.
- Screenshot antarmuka atau hasil project melalui upload gambar.
- Status Featured hanya untuk project yang paling relevan.

Gunakan pola penulisan:

> Saya membangun [jenis produk] untuk [pengguna atau kebutuhan]. Saya mengerjakan [peran/kontribusi utama] menggunakan [teknologi]. Hasilnya [dampak yang dapat dibuktikan].

Hindari klaim seperti “terbaik”, “revolusioner”, atau angka pengguna/performa jika tidak memiliki bukti.

## 2. Detail Project dan Case Study

Halaman detail project sudah tersedia melalui judul project. Pastikan data project cukup kuat untuk dibaca sebagai case study:

- **Context:** mengapa project ini dibuat.
- **Problem:** masalah teknis atau bisnis yang dihadapi.
- **Contribution:** bagian yang Anda kerjakan sendiri.
- **Implementation:** keputusan teknis penting dan alasannya.
- **Result:** hasil yang dapat diverifikasi.
- **Links:** demo, repository, atau dokumentasi.

Tulis berdasarkan fakta. Jika project bersifat internal, gunakan deskripsi umum tanpa membocorkan data rahasia.

## 3. Pengalaman Kerja

Menu: **Admin → Pengalaman**

Untuk setiap pengalaman, isi:

- Nama perusahaan atau “Freelance” jika memang pekerjaan mandiri.
- Posisi yang benar-benar dijalankan.
- Periode yang akurat.
- Tanggung jawab utama.
- Teknologi atau sistem yang digunakan.
- Hasil yang dapat dibuktikan.

Contoh struktur deskripsi profesional:

> Mengembangkan [fitur/sistem] menggunakan [teknologi] untuk [kebutuhan]. Bertanggung jawab atas [kontribusi]. Hasilnya [dampak terukur atau perbaikan yang dapat dijelaskan].

Jangan menulis angka seperti jumlah pengguna, persentase peningkatan, atau penghematan waktu jika tidak dapat diverifikasi.

## 4. Link dan Identitas Kontak [x]

Menu: **Admin → Profil → Kontak & Sosial**

Periksa kembali:

- WhatsApp menggunakan nomor internasional, contoh `628xxxxxxxxxx`.
- LinkedIn mengarah ke profil pribadi yang benar.
- GitHub mengarah ke akun yang benar.
- Email dapat menerima pesan.
- URL CV/Resume mengarah ke file yang dapat diakses.

## 5. CV / Resume

Upload CV ke layanan penyimpanan yang memiliki URL publik, lalu masukkan URL-nya pada field **URL CV / Resume** di menu Profil.

CV sebaiknya berisi:

- Ringkasan profesional 2–3 kalimat.
- Pengalaman berdasarkan fakta.
- Project paling relevan.
- Teknologi yang benar-benar dikuasai.
- Link portfolio, GitHub, LinkedIn, dan email.
- Format PDF yang rapi dan mudah dibaca ATS.

## 6. Open Graph dan Social Preview

Metadata dasar dan gambar preview sudah disiapkan. Sebelum production, siapkan gambar preview dengan:

- Ukuran 1200 × 630 px.
- Nama dan role yang mudah dibaca.
- Kontras tinggi.
- Tanpa terlalu banyak teks.
- Tanpa klaim yang tidak dapat dibuktikan.

Ganti asset `/public/logo.png` jika ingin menggunakan preview khusus portfolio.

## 7. Pemeriksaan Sebelum Production

- Buka halaman pada 375, 390, 430, 768, 1024, 1280, dan 1440 px.
- Pastikan tidak ada horizontal scroll.
- Uji menu mobile dengan keyboard.
- Uji semua link project dan kontak.
- Kirim satu pesan melalui form dan pastikan masuk ke email serta Admin → Pesan.
- Pastikan gambar project memiliki alt text yang sesuai dengan judul project.
- Pastikan environment email tidak disimpan ke repository.

## Urutan pengerjaan yang disarankan

1. Lengkapi project nyata dan screenshot.
2. Validasi pengalaman kerja dan semua klaim.
3. Upload CV dan isi URL di Admin.
4. Ganti gambar social preview.
5. Lakukan pemeriksaan responsive dan link sebelum deployment.
