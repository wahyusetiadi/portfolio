'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../components/AppProvider';
import { UI, tx } from '../lib/translations';
import type { PortfolioData, OngoingProject, Project } from '../lib/types';

const STATUS_ORDER = ['planning', 'in-progress', 'review', 'completed'];

const STATUS_DOT_CLASS: Record<string, string> = {
  planning: 'bg-[var(--text-muted)]',
  'in-progress': 'bg-[var(--warning)]',
  review: 'bg-[var(--accent)]',
  completed: 'bg-[var(--success)]',
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  planning: 'border-[var(--text-muted)] text-[var(--text-muted)] bg-transparent',
  'in-progress': 'border-[var(--warning)] text-[var(--warning)] bg-[rgba(245,158,11,0.08)]',
  review: 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-glow)]',
  completed: 'border-[var(--success)] text-[var(--success)] bg-[rgba(16,185,129,0.08)]',
};

function StatusDot({ status }: { status: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-2 shrink-0 rounded-full ${STATUS_DOT_CLASS[status] || 'bg-[var(--text-muted)]'}`}
    />
  );
}

function formatDate(d?: string) {
  if (!d) return '—';
  const [y, m] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m)-1] || m} ${y}`;
}

export default function ProjectsPage() {
  const { theme, lang, multiLangEnabled, toggleTheme, setLang } = useApp();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => { fetch('/api/portfolio').then(r => r.json()).then(setData); }, []);

  if (!data) return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
    </div>
  );

  const { profile, projects, ongoingProjects } = data;
  const publicOngoing: OngoingProject[] = (ongoingProjects || []).filter(p => p.public);

  // Collect all tags from all projects
  const allTags = Array.from(new Set([
    ...projects.flatMap(p => p.tags),
    ...publicOngoing.flatMap(p => p.tags),
  ]));

  const filteredProjects: Project[] = projects.filter(p => {
    const tagOk = !filterTag || p.tags.includes(filterTag);
    const statusOk = filterStatus === 'all' || p.status === filterStatus || (filterStatus === 'completed' && !p.status);
    return tagOk && statusOk;
  });

  const filteredOngoing: OngoingProject[] = publicOngoing.filter(p =>
    (!filterTag || p.tags.includes(filterTag)) &&
    (filterStatus === 'all' || filterStatus === p.status)
  );

  const CATEGORY_COLORS: Record<string, string> = {
    Frontend: '#8B5CF6', Backend: '#22D3EE', Language: '#F59E0B',
    Database: '#10B981', DevOps: '#EF4444', Other: '#94A3B8',
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">

      {/* Navbar */}
      <nav className="sticky top-0 z-[100] border-b border-[var(--border)] bg-[var(--bg-surface)] backdrop-blur-lg">
        <div className="mx-auto flex h-[66px] max-w-[1200px] items-center justify-between px-7">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-mono text-[13px] text-[var(--text-2)] transition-colors hover:text-[var(--accent)]"
            >
              {tx(UI.projectsPage.backHome, lang)}
            </Link>
            <div className="h-4 w-px bg-[var(--border)]" />
            <span className="font-display text-base font-bold text-[var(--text)]">
              {profile.name.split(' ')[0]}<span className="text-[var(--accent)]">.</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {multiLangEnabled && (
              <div className="flex overflow-hidden rounded-md border border-[var(--border)]">
                {(['id', 'en'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={[
                      'px-2.5 py-1 font-mono text-[11px] uppercase transition-colors',
                      lang === l ? 'bg-[var(--accent)] text-white' : 'bg-transparent text-[var(--text-2)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]',
                    ].join(' ')}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg p-2 text-[var(--text-2)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]"
            >
              {theme === 'dark'
                ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="mx-auto max-w-[1200px] px-7 pt-[60px]">
        <span className="mb-2.5 block font-mono text-[11px] tracking-[0.12em] text-[var(--accent)]">{tx(UI.projectsPage.title, lang)}</span>
        <h1 className="mb-3 font-display text-[clamp(32px,5vw,56px)] font-bold tracking-[-1.5px] leading-[1.05]">
          {tx(UI.projects.title, lang)}
        </h1>
        <p className="mb-10 max-w-[500px] text-[15px] leading-[1.7] text-[var(--text-2)]">
          {publicOngoing.length > 0
            ? lang === 'id'
              ? `${publicOngoing.length} active · ${projects.length} selesai`
              : `${publicOngoing.length} active · ${projects.length} completed`
            : lang === 'id' ? `${projects.length} proyek` : `${projects.length} projects`
          }
        </p>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-3 border-b border-[var(--border)] pb-9">
          {/* Status filter */}
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'in-progress', 'review', 'planning', 'completed'] as const).map(s => {
              const labels: Record<string, { id: string; en: string }> = {
                all: UI.projectsPage.filterAll,
                'in-progress': UI.ongoing.status['in-progress'],
                review: UI.ongoing.status.review,
                planning: UI.ongoing.status.planning,
                completed: UI.ongoing.status.completed,
              };
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={[
                    'rounded-lg border px-[14px] py-1.5 text-xs transition-colors duration-150',
                    filterStatus === s
                      ? 'border-[var(--accent)] bg-[var(--accent-glow)] font-semibold text-[var(--accent)]'
                      : 'border-[var(--border)] bg-transparent font-normal text-[var(--text-2)] hover:border-[var(--border-hover)]',
                  ].join(' ')}
                >
                  {tx(labels[s], lang)}
                </button>
              );
            })}
          </div>
          <div className="w-px self-stretch bg-[var(--border)]" />
          {/* Tag filter */}
          <div className="flex flex-wrap gap-1.5">
            {allTags.slice(0, 10).map(t => (
              <button
                key={t}
                onClick={() => setFilterTag(filterTag === t ? null : t)}
                className={[
                  'inline-block rounded-md border px-2.5 py-[3px] font-mono text-[11px] transition-colors',
                  filterTag === t
                    ? 'border-[var(--accent)] bg-[var(--accent-glow)] text-[var(--accent)]'
                    : 'border-[var(--border)] bg-transparent text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-7 pb-20">

        {/* ── ONGOING PROJECTS ── */}
        {(filterStatus === 'all' || filterStatus === 'in-progress' || filterStatus === 'review' || filterStatus === 'planning') && filteredOngoing.length > 0 && (
          <div className="mb-[72px]">
            <div className="mb-7 flex items-center gap-3.5">
              <span className="mb-0 block font-mono text-[11px] tracking-[0.12em] text-[var(--accent)]">{tx(UI.ongoing.label, lang)}</span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {filteredOngoing.length} {lang === 'id' ? 'aktif' : 'active'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fill,minmax(320px,_1fr))]">
              {filteredOngoing.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)).map(p => (
                <div
                  key={p.id}
                  className="relative overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg-card)] p-7 transition hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-sm)]"
                >
                  {/* Status color accent bar */}
                  <div
                    className={[
                      'absolute left-0 right-0 top-0 h-[3px]',
                      p.status === 'in-progress'
                        ? 'bg-[var(--warning)]'
                        : p.status === 'review'
                          ? 'bg-[var(--accent)]'
                          : p.status === 'planning'
                            ? 'bg-[var(--text-muted)]'
                            : 'bg-[var(--success)]',
                    ].join(' ')}
                  />

                  <div className="mb-4 flex items-start justify-between">
                    <span
                      className={[
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] font-mono text-[10px] tracking-[0.08em]',
                        STATUS_BADGE_CLASS[p.status] || STATUS_BADGE_CLASS.planning,
                      ].join(' ')}
                    >
                      <StatusDot status={p.status} />
                      {tx(UI.ongoing.status[p.status] || { id: p.status, en: p.status }, lang)}
                    </span>
                    <div className="flex gap-2">
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--text)]">GH ↗</a>}
                      {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-[var(--accent)] hover:opacity-80">Demo ↗</a>}
                    </div>
                  </div>

                  <h3 className="mb-2.5 font-display text-lg font-semibold tracking-[-0.3px]">{p.title}</h3>
                  <p className="mb-[18px] text-sm leading-[1.7] text-[var(--text-2)]">{tx(p.description, lang)}</p>

                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {p.tags.map(t => (
                      <span
                        key={t}
                        className="inline-block rounded-md border border-[var(--border)] bg-transparent px-2.5 py-[3px] font-mono text-[11px] text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-5 border-t border-[var(--border)] pt-4">
                    <div>
                      <div className="mb-0.5 font-mono text-[10px] tracking-[0.08em] text-[var(--text-muted)]">{tx(UI.ongoing.started, lang)}</div>
                      <div className="font-mono text-xs text-[var(--text-2)]">{formatDate(p.startDate)}</div>
                    </div>
                    {p.expectedEnd && (
                      <div>
                        <div className="mb-0.5 font-mono text-[10px] tracking-[0.08em] text-[var(--text-muted)]">{tx(UI.ongoing.expectedEnd, lang)}</div>
                        <div className="font-mono text-xs text-[var(--text-2)]">{formatDate(p.expectedEnd)}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COMPLETED PROJECTS ── */}
        {(filterStatus === 'all' || filterStatus === 'completed') && (
          <div>
            <div className="mb-7 flex items-center gap-3.5">
              <span className="mb-0 block font-mono text-[11px] tracking-[0.12em] text-[var(--accent)]">{tx(UI.projectsPage.completed, lang)}</span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {filteredProjects.length} {tx(UI.projects.count, lang)}
              </span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-[var(--border)] p-[60px] text-center font-mono text-sm text-[var(--text-muted)]">
                {tx(UI.projectsPage.noItems, lang)}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fill,minmax(340px,_1fr))]">
                {filteredProjects.map(p => (
                  <div
                    key={p.id}
                    className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-card)] p-7 transition hover:border-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent),0_4px_24px_var(--accent-glow)]"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {p.featured && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent-glow)] px-2.5 py-[3px] font-mono text-[10px] tracking-[0.08em] text-[var(--accent)]">
                            {tx(UI.projects.featured, lang)}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-[var(--text-muted)]">{p.year}</span>
                    </div>
                    <h3 className="mb-2.5 font-display text-lg font-semibold tracking-[-0.3px]">{p.title}</h3>
                    <p className="mb-[18px] text-sm leading-[1.7] text-[var(--text-2)]">{tx(p.description, lang)}</p>
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {p.tags.map(t => (
                        <span
                          key={t}
                          onClick={() => setFilterTag(filterTag === t ? null : t)}
                          className={[
                            'inline-block cursor-pointer rounded-md border px-2.5 py-[3px] font-mono text-[11px] transition-colors',
                            filterTag === t
                              ? 'border-[var(--accent)] bg-[var(--accent-glow)] text-[var(--accent)]'
                              : 'border-[var(--border)] bg-transparent text-[var(--text-2)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
                          ].join(' ')}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 border-t border-[var(--border)] pt-4">
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">{tx(UI.projects.github, lang)}</a>}
                      {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-[var(--accent)] hover:opacity-80">{tx(UI.projects.demo, lang)}</a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
