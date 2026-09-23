import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readPortfolioData } from '@/lib/portfolioStore';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readPortfolioData();
  const project = data.projects.find(item => item.id === id);
  if (!project) notFound();

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '40px 24px 100px' }}>
      <article style={{ maxWidth: 860, margin: '0 auto' }}>
        <Link href="/projects" style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, textDecoration: 'none' }}>← Semua proyek</Link>
        <header style={{ marginTop: 56, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
          <span className="section-label">PROJECT / {project.year}</span>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(38px, 7vw, 72px)', lineHeight: 1.05, letterSpacing: '-2px', margin: '12px 0 20px' }}>{project.title}</h1>
          <p style={{ maxWidth: 680, color: 'var(--text-2)', lineHeight: 1.8, fontSize: 18 }}>{project.description.id}</p>
        </header>
        {project.image && <img src={project.image} alt={`Screenshot ${project.title}`} style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', margin: '40px 0' }} />}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 28, padding: '28px 0', borderBottom: '1px solid var(--border)' }}>
          <div><small className="section-label">STATUS</small><p>{project.status}</p></div>
          <div><small className="section-label">TECHNOLOGY</small><p>{project.tags.join(' · ')}</p></div>
          <div><small className="section-label">YEAR</small><p>{project.year}</p></div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
          {project.demo && <a className="btn-primary" href={project.demo} target="_blank" rel="noopener noreferrer">Live demo ↗</a>}
          {project.github && <a className="btn-secondary" href={project.github} target="_blank" rel="noopener noreferrer">Repository ↗</a>}
        </div>
      </article>
    </main>
  );
}
