'use client';

import Link from 'next/link';
import { useApp } from '../../components/AppProvider';
import { tx, UI } from '../../lib/translations';
import type { Project } from '../../lib/types';

export default function ProjectDetailClient({ project }: { project: Project }) {
  const { lang } = useApp();

  return (
    <main className="project-detail">
      <article className="project-detail-inner">
        <Link href="/projects" className="text-link">← {lang === 'id' ? 'Semua proyek' : 'All projects'}</Link>
        <header>
          <span className="section-label">PROJECT / {project.year}</span>
          <h1>{project.title}</h1>
          <p>{tx(project.description, lang)}</p>
        </header>
        {project.image && <img src={project.image} alt={`Screenshot ${project.title}`} className="project-detail-image" />}
        <dl className="project-detail-meta">
          <div><dt>{lang === 'id' ? 'Status' : 'Status'}</dt><dd>{tx(UI.ongoing.status[project.status], lang)}</dd></div>
          <div><dt>{lang === 'id' ? 'Teknologi' : 'Technology'}</dt><dd>{project.tags.join(' · ')}</dd></div>
          <div><dt>{lang === 'id' ? 'Tahun' : 'Year'}</dt><dd>{project.year}</dd></div>
        </dl>
        <div className="project-detail-links">
          {project.demo && <a className="btn-primary" href={project.demo} target="_blank" rel="noopener noreferrer">Live demo ↗</a>}
          {project.github && <a className="btn-secondary" href={project.github} target="_blank" rel="noopener noreferrer">Repository ↗</a>}
        </div>
      </article>
    </main>
  );
}
