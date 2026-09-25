# Simpan gambar proyek di Google Drive

Integrasi ini hanya berlaku untuk **upload gambar proyek baru**. Gambar proyek yang sudah berada di `public/uploads` tetap dapat digunakan. Upload social preview tetap memakai penyimpanan lokal.

## 1. Siapkan Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/) dan pilih atau buat project.
2. Aktifkan **Google Drive API** pada project tersebut.
3. Di **Google Auth Platform**, konfigurasi consent screen. Untuk Gmail pribadi pilih **External** dan tambahkan akun Anda sebagai test user jika status aplikasi masih **Testing**.
4. Buka **Google Auth Platform → Data Access → Add or Remove Scopes**. Cari `drive.file`, pilih `https://www.googleapis.com/auth/drive.file`, lalu klik **Update** dan **Save**. Jika scope Drive tidak muncul, pastikan **Google Drive API** sudah aktif di **APIs & Services → Library**.
5. Buat OAuth Client ID bertipe **Web application**. Daftarkan redirect URI persis `http://localhost:8787/callback`.
6. Untuk beralih ke **In production**, lengkapi **Branding**: nama aplikasi, email dukungan, homepage, dan kebijakan privasi. Setelah perubahan situs terpasang di Vercel, gunakan `https://wsdmc.vercel.app/` sebagai homepage dan `https://wsdmc.vercel.app/privacy` sebagai kebijakan privasi. Kedua URL harus bisa dibuka publik. Google mungkin meminta domain yang dapat diverifikasi kepemilikannya; jika domain `vercel.app` ditolak, gunakan domain pribadi yang terhubung ke Vercel dan diverifikasi melalui Google Search Console.
7. Jika Anda hanya mencoba dalam status **Testing**, refresh token yang diperoleh akan kedaluwarsa dalam 7 hari. Setelah status berubah ke **In production**, buat refresh token baru dengan akun Google dan OAuth Client yang sama.

## 2. Dapatkan refresh token

Tambahkan dua nilai dari OAuth Client ke `.env` lokal (file ini sudah diabaikan Git):

```dotenv
GOOGLE_DRIVE_CLIENT_ID=isi_client_id
GOOGLE_DRIVE_CLIENT_SECRET=isi_client_secret
```

Jalankan:

```powershell
node --env-file=.env scripts/drive-auth.mjs
```

Buka URL yang dicetak di terminal, login ke akun Drive yang akan dipakai, lalu izinkan akses. Setelah callback berhasil, terminal akan mencetak `GOOGLE_DRIVE_REFRESH_TOKEN`. Salin nilai itu ke `.env` dan restart server portfolio. Jangan kirim client secret atau refresh token melalui chat dan jangan commit `.env`.

Jika Anda sudah membuat token saat status **Testing**, jalankan kembali skrip otorisasi setelah mengubah status ke **In production**, lalu ganti refresh token lama di `.env` dan environment variable Vercel. Jangan kirim nilainya melalui chat.

## 3. Coba upload

1. Login ke Admin portfolio.
2. Pada menu Proyek, unggah JPG, PNG, WebP, atau AVIF (maksimal 5 MB).
3. Klik **Simpan Perubahan**.
4. Buka halaman proyek. URL gambar baru akan berawalan `/api/project-image/`; file berada di Google Drive dan disajikan melalui server portfolio. File Drive tidak perlu dibagikan secara publik.

Jika tidak ada variabel Google Drive, upload proyek menggunakan `public/uploads` seperti sebelumnya. Jika baru sebagian variabel yang terisi, upload proyek menampilkan error konfigurasi agar tidak tersimpan ke lokasi yang salah. Pada deployment, isi ketiga variabel yang sama di **Vercel → Project Settings → Environment Variables** untuk environment Production. Tambahkan `NEXT_PUBLIC_SITE_URL=https://wsdmc.vercel.app`. Gambar lama di `public/uploads` perlu tetap tersedia sampai diunggah ulang ke Drive.

Metadata proyek (termasuk URL gambar) disimpan terpisah dari file gambar. Pada Vercel, konfigurasi `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` diperlukan agar perubahan dari admin tersimpan setelah deployment. Kedua nilai harus berasal dari satu database Upstash yang sama. Setelah menambah atau mengganti environment variable di Vercel, lakukan redeploy agar deployment baru memakainya.

## 4. Verifikasi lokal dan Vercel

1. Lokal: jalankan `npm run dev`, buka `/privacy`, login admin, upload gambar proyek, simpan proyek, lalu buka halaman proyek dan pastikan gambarnya tampil.
2. Production: buka `https://wsdmc.vercel.app/privacy` dan pastikan status HTTP 200. Cek env Google Drive, Upstash, dan URL situs di Vercel; kemudian redeploy.
3. Login admin di Vercel, upload satu gambar proyek, simpan, dan buka halaman proyek dalam jendela baru. Refresh halaman untuk memastikan metadata dan gambar tetap ada.
4. Jangan hapus gambar lama dari Drive sebelum migrasi dan verifikasi selesai. Jika token tidak berlaku, file tetap di Drive, tetapi proxy gambar portfolio akan gagal sampai token diganti.

Referensi: [OAuth Web Server](https://developers.google.com/identity/protocols/oauth2/web-server), [scope Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth), [upload multipart](https://developers.google.com/workspace/drive/api/guides/manage-uploads).
