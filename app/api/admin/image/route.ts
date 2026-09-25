import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { isGoogleDriveConfigured, trashDriveImage } from '@/lib/googleDrive';
import { readPortfolioData, writePortfolioData } from '@/lib/portfolioStore';

type DeleteRequest = { target?: 'project' | 'social'; projectId?: string };

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json() as DeleteRequest;
    if (!body || (body.target !== 'project' && body.target !== 'social')) {
      return NextResponse.json({ error: 'Target gambar tidak valid' }, { status: 400 });
    }

    const data = await readPortfolioData();
    const project = body.target === 'project' ? data.projects.find(item => item.id === body.projectId) : null;
    if (body.target === 'project' && !project) {
      return NextResponse.json({ error: 'Proyek tidak ditemukan' }, { status: 404 });
    }

    const oldUrl = body.target === 'social' ? data.profile.socialImageUrl || '' : project?.image || '';
    if (body.target === 'social') data.profile.socialImageUrl = '';
    else if (project) project.image = '';
    await writePortfolioData(data);

    const id = oldUrl.match(/^\/api\/(?:project|social)-image\/([a-zA-Z0-9_-]+)$/)?.[1];
    if (!id || !isGoogleDriveConfigured()) return NextResponse.json({ success: true });

    const stillReferenced = data.profile.socialImageUrl?.endsWith(`/${id}`) ||
      data.projects.some(item => item.image?.endsWith(`/${id}`));
    if (stillReferenced) return NextResponse.json({ success: true });

    try {
      await trashDriveImage(id);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ success: true, warning: 'Gambar telah dilepas dari portfolio, tetapi belum berhasil dipindahkan ke Sampah Google Drive.' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus gambar';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
