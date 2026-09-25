import type { Metadata } from 'next';
import { readPortfolioData, toPublicPortfolioData } from '@/lib/portfolioStore';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await readPortfolioData();
  return {
    title: `Proyek — ${data.profile.name}`,
    description: `Daftar proyek ${data.profile.name}.`,
    alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: '/projects' } : undefined,
  };
}

export default async function ProjectsPage() {
  const data = await readPortfolioData();
  return <ProjectsClient initialData={toPublicPortfolioData(data)} />;
}
