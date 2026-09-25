import { NextResponse } from 'next/server';
import { getProjectImageFromDrive, isGoogleDriveConfigured } from '@/lib/googleDrive';
import { readPortfolioData } from '@/lib/portfolioStore';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return new NextResponse(null, { status: 404 });

  try {
    const data = await readPortfolioData();
    const imagePath = `/api/project-image/${id}`;
    if (!data.projects.some(project => project.image === imagePath)) {
      return new NextResponse(null, { status: 404 });
    }
    if (!isGoogleDriveConfigured()) {
      return NextResponse.json({ error: 'Google Drive belum dikonfigurasi' }, { status: 503 });
    }

    const response = await getProjectImageFromDrive(id);
    if (!response.ok || !response.body) {
      return new NextResponse(null, { status: response.status === 404 ? 404 : 502 });
    }
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    if (!contentType.startsWith('image/')) return new NextResponse(null, { status: 502 });
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil gambar proyek' }, { status: 502 });
  }
}
