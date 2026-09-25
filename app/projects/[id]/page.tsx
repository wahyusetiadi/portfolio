import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readPortfolioData } from '@/lib/portfolioStore';
import ProjectDetailClient from './ProjectDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await readPortfolioData();
  const project = data.projects.find(item => item.id === id);
  if (!project) return {};
  return {
    title: `${project.title} — ${data.profile.name}`,
    description: project.description[data.settings.defaultLang],
    alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: `/projects/${id}` } : undefined,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readPortfolioData();
  const project = data.projects.find(item => item.id === id);
  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
