import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  throw new Error('Isi GOOGLE_DRIVE_CLIENT_ID dan GOOGLE_DRIVE_CLIENT_SECRET di .env terlebih dahulu.');
}

const redirectUri = 'http://localhost:8787/callback';
const state = randomUUID();
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: 'https://www.googleapis.com/auth/drive.file',
  access_type: 'offline',
  prompt: 'consent',
  state,
}).toString();

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', redirectUri);
  if (url.pathname !== '/callback') {
    response.writeHead(404).end('Not found');
    return;
  }
  if (url.searchParams.get('state') !== state) {
    response.writeHead(400).end('State tidak cocok. Ulangi proses otorisasi.');
    return;
  }
  const code = url.searchParams.get('code');
  if (!code) {
    response.writeHead(400).end('Google tidak memberikan kode otorisasi.');
    return;
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok || !token.refresh_token) {
      throw new Error('Refresh token tidak tersedia. Coba ulangi persetujuan akses Google.');
    }
    console.log('\nTambahkan baris berikut ke .env. Jangan bagikan nilainya:\n');
    console.log(`GOOGLE_DRIVE_REFRESH_TOKEN=${token.refresh_token}\n`);
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Koneksi Google Drive berhasil. Salin refresh token dari terminal ke .env, lalu tutup proses ini.');
  } catch (error) {
    response.writeHead(502).end('Otorisasi gagal. Periksa terminal untuk detail.');
    console.error(error instanceof Error ? error.message : error);
  } finally {
    server.close();
  }
});

server.listen(8787, () => {
  console.log('Buka URL ini di browser, lalu izinkan akses ke akun Google Drive Anda:\n');
  console.log(`${authUrl}\n`);
});
