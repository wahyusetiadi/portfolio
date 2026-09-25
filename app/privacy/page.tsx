import type { Metadata } from 'next';
import Link from 'next/link';
import { readPortfolioData } from '@/lib/portfolioStore';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Wahyu Setiadi',
  description: 'Cara portfolio Wahyu Setiadi menangani pesan kontak dan gambar proyek.',
  alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: '/privacy' } : undefined,
};

export default async function PrivacyPage() {
  const data = await readPortfolioData();
  const contactEmail = data.contact.links?.email || data.profile.email;

  return (
    <main className="privacy-page">
      <div className="privacy-content">
        <Link href="/" className="privacy-back">← Kembali ke portfolio</Link>
        <header className="privacy-header">
          <span className="section-label">Informasi situs</span>
          <h1>Kebijakan privasi</h1>
          <p>Penjelasan singkat tentang data yang digunakan saat Anda mengunjungi portfolio ini atau mengirim pesan.</p>
        </header>

        <section aria-labelledby="privacy-contact">
          <h2 id="privacy-contact">Pesan kontak</h2>
          <p>Jika Anda memakai formulir kontak, nama, alamat email, isi pesan, dan waktu pengiriman disimpan agar saya dapat membaca dan membalasnya. Pesan juga dikirim ke email saya jika layanan email tersedia. Pesan tidak ditampilkan kepada pengunjung situs. Pesan disimpan sampai saya menghapusnya; Anda dapat meminta penghapusan melalui alamat email di bawah.</p>
        </section>

        <section aria-labelledby="privacy-drive">
          <h2 id="privacy-drive">Gambar proyek dan Google Drive</h2>
          <p>Saya menggunakan akun Google pribadi untuk menyimpan gambar proyek yang saya unggah melalui halaman admin. Aplikasi meminta izin <code>drive.file</code> agar dapat membuat dan membaca kembali file proyek yang digunakan portfolio. Pengunjung tidak perlu masuk dengan akun Google. Server portfolio mengambil gambar dari Google Drive dan menampilkannya pada halaman proyek. File Drive tidak dibagikan secara publik melalui izin berbagi Google.</p>
        </section>

        <section aria-labelledby="privacy-providers">
          <h2 id="privacy-providers">Layanan yang digunakan</h2>
          <p>Situs ini berjalan di Vercel. Data portfolio dan pesan kontak dapat disimpan di penyimpanan aplikasi yang dikonfigurasi untuk deployment. Google Drive memproses file gambar proyek, dan layanan email memproses pesan kontak ketika pengiriman email tersedia. Font halaman dimuat dari Google Fonts.</p>
        </section>

        <section aria-labelledby="privacy-preferences">
          <h2 id="privacy-preferences">Preferensi tampilan</h2>
          <p>Pilihan tema dan bahasa disimpan di browser Anda melalui penyimpanan lokal agar tetap berlaku saat Anda kembali. Anda dapat menghapusnya melalui pengaturan data situs di browser.</p>
        </section>

        <section aria-labelledby="privacy-requests">
          <h2 id="privacy-requests">Pertanyaan dan permintaan penghapusan</h2>
          <p>Untuk menanyakan penggunaan data atau meminta penghapusan pesan yang pernah Anda kirim, hubungi <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
        </section>
      </div>
    </main>
  );
}
