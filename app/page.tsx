'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from './components/AppProvider';
import { UI, tx } from './lib/translations';
import type { PortfolioData } from './lib/types';

type Section = 'home' | 'work' | 'about' | 'experience' | 'contact';

export default function PortfolioPage() {
  const { theme, lang, multiLangEnabled, toggleTheme, setLang } = useApp();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeNav, setActiveNav] = useState<Section>('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio').then(r => r.json()).then(setData);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections: Section[] = ['home', 'work', 'about', 'experience', 'contact'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= 120 && bottom >= 120) { setActiveNav(s); break; }
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError(null);
    const res = await fetch('/api/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) {
      setSending(false);
      setSendError('Gagal mengirim pesan. Coba lagi.');
      return;
    }
    setSending(false); setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  if (!data) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const { profile, skills, projects, experiences, contact } = data;
  const catGroups = skills.reduce<Record<string, typeof skills>>((a, s) => {
    if (!a[s.category]) a[s.category] = [];
    a[s.category].push(s); return a;
  }, {});

  const NAV: { id: Section; label: { id: string; en: string } }[] = [
    { id: 'home',    label: UI.nav.home    },
    { id: 'work',    label: UI.nav.work    },
    { id: 'about',   label: UI.nav.about   },
    { id: 'experience', label: UI.nav.experience },
    { id: 'contact', label: UI.nav.contact },
  ];

  const CATEGORY_COLORS: Record<string, string> = {
    Frontend: '#8B5CF6', Backend: '#22D3EE', Language: '#F59E0B',
    Database: '#10B981', DevOps: '#EF4444', Other: '#94A3B8',
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled || mobileOpen ? 'rgba(7,7,15,0.92)' : 'transparent',
        backdropFilter: scrolled || mobileOpen ? 'blur(16px)' : 'none',
        borderBottom: scrolled || mobileOpen ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => scrollTo('home')} aria-label="Home" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo.png" alt="Logo" width={22} height={22} style={{ display: 'block' }} />
              <span>
                {profile.name.split(' ')[0] || 'Dev'}
                <span style={{ color: 'var(--accent)' }}>.</span>
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {NAV.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px',
                fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: activeNav === l.id ? 600 : 400,
                color: activeNav === l.id ? 'var(--text)' : 'var(--text-2)',
                borderBottom: activeNav === l.id ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s',
              }}>{tx(l.label, lang)}</button>
            ))}
            <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 8px' }} />
            <Link href="/projects" style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-2)',
              textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 14px',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
            >{tx(UI.nav.allProjects, lang)}</Link>

            {/* Lang toggle */}
            {multiLangEnabled && (
              <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', marginLeft: 4 }}>
                {(['id', 'en'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    background: lang === l ? 'var(--accent)' : 'transparent',
                    border: 'none', color: lang === l ? '#fff' : 'var(--text-2)',
                    padding: '5px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase',
                  }}>{l}</button>
                ))}
              </div>
            )}

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn-ghost" title={theme === 'dark' ? 'Light mode' : 'Dark mode'} style={{ marginLeft: 4, width: 36, height: 36 }}>
              {theme === 'dark'
                ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              }
            </button>

            {/* <Link href="/admin" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 6 }}>edit</Link> */}
          </div>

          {/* Mobile hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {multiLangEnabled && (
              <div className="nav-mobile-menu" style={{ display: 'none', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                {(['id', 'en'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    background: lang === l ? 'var(--accent)' : 'transparent',
                    border: 'none', color: lang === l ? '#fff' : 'var(--text-2)',
                    padding: '4px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    cursor: 'pointer', textTransform: 'uppercase',
                  }}>{l}</button>
                ))}
              </div>
            )}
            <button onClick={toggleTheme} className="nav-mobile-menu btn-ghost" style={{ display: 'none', width: 34, height: 34 }}>
              {theme === 'dark'
                ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              }
            </button>
            <button className="nav-mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} style={{
              display: 'none', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 22, height: 1.5, background: 'var(--text)', display: 'block', transition: 'all 0.25s',
                  transform: i === 0 && mobileOpen ? 'rotate(45deg) translate(3px,5px)' : i === 2 && mobileOpen ? 'rotate(-45deg) translate(3px,-5px)' : 'none',
                  opacity: i === 1 && mobileOpen ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ padding: '16px 28px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            {NAV.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none',
                cursor: 'pointer', padding: '13px 0', fontFamily: 'Space Grotesk, sans-serif', fontSize: 18,
                color: activeNav === l.id ? 'var(--accent)' : 'var(--text-2)', borderBottom: '1px solid var(--border)',
              }}>{tx(l.label, lang)}</button>
            ))}
            <Link href="/projects" onClick={() => setMobileOpen(false)} style={{ display: 'block', marginTop: 14, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>
              {tx(UI.nav.allProjects, lang)} ↗
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="hero-section" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 28px 80px', overflow: 'hidden' }}>
        {/* Dot grid bg */}
        <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
        {/* Gradient orb */}
        <div style={{ position: 'absolute', top: '-120px', right: '-100px', width: 700, height: 700, background: 'radial-gradient(circle, var(--accent-glow), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-100px', width: 500, height: 500, background: `radial-gradient(circle, rgba(34,211,238,0.07), transparent 65%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: 80, alignItems: 'center' }}>

            {/* Left */}
            <div>
              {profile.available && (
                <div className="fade-up fade-up-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, padding: '6px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 99 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', animation: 'glow 2s ease-in-out infinite', display: 'block' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--success)', letterSpacing: '0.06em' }}>
                    {tx(UI.hero.available, lang)}
                  </span>
                </div>
              )}

              <p className="fade-up fade-up-1" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>
                &gt; whoami
              </p>
              <h1 className="fade-up fade-up-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(48px, 7vw, 82px)', lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 10 }}>
                {profile.name}
                <span className="gradient-text">.</span>
              </h1>
              <p className="fade-up fade-up-3" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 'clamp(18px, 2.5vw, 26px)', color: 'var(--text-2)', marginBottom: 24, letterSpacing: '-0.5px' }}>
                {tx(profile.title, lang)}
              </p>
              <p className="fade-up fade-up-4" style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', color: 'var(--text-2)', lineHeight: 1.8, maxWidth: 500, marginBottom: 40 }}>
                {tx(profile.bio, lang)}
              </p>

              <div className="fade-up fade-up-5" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
                <button onClick={() => scrollTo('work')} className="btn-primary">
                  {tx(UI.hero.viewWork, lang)}
                </button>
                <button onClick={() => scrollTo('contact')} className="btn-secondary">
                  {tx(UI.hero.contactMe, lang)}
                </button>
              </div>

              <div className="fade-up fade-up-5 hero-stats" style={{ display: 'flex', gap: 36, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
                {[
                  { n: profile.yearsExp || '3+', l: UI.hero.yearsExp },
                  { n: `${projects.length}`,     l: UI.hero.projects },
                  { n: `${skills.length}`,       l: UI.hero.technologies },
                ].map(s => (
                  <div key={s.n + s.l.id}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-1px' }}>
                      <span className="gradient-text">{s.n}</span>
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.1em' }}>
                      {tx(s.l, lang)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Terminal card */}
            <div className="hero-right fade-up fade-up-4">
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                {/* Terminal header */}
                <div style={{ padding: '12px 16px', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)' }}>
                  {['#EF4444','#F59E0B','#10B981'].map(c => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.85 }} />
                  ))}
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>~/portfolio</span>
                </div>
                {/* Terminal body */}
                <div style={{ padding: '20px 22px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, lineHeight: 1.8 }}>
                  {[
                    { prompt: true,  text: 'cat skills.json' },
                    { prompt: false, text: '{', color: 'var(--text-2)' },
                    { prompt: false, text: `  frontend: "React, Next.js",`, color: 'var(--accent)' },
                    { prompt: false, text: `  backend:  "Node.js, Express",`, color: 'var(--accent-2)' },
                    { prompt: false, text: `  database: "PostgreSQL, Redis",`, color: 'var(--warning)' },
                    // { prompt: false, text: `  devops:   "Docker, CI/CD"`, color: 'var(--success)' },
                    { prompt: false, text: '}', color: 'var(--text-2)' },
                    { prompt: true,  text: 'status' },
                    { prompt: false, text: profile.available ? '✓ Available for hire' : '✗ Not available', color: profile.available ? 'var(--success)' : 'var(--danger)' },
                  ].map((line, i) => (
                    <div key={i} style={{ color: line.color || 'var(--text)' }}>
                      {line.prompt && <span style={{ color: 'var(--accent)' }}>$ </span>}
                      {line.text}
                    </div>
                  ))}
                  <div>
                    <span style={{ color: 'var(--accent)' }}>$ </span>
                    <span style={{ display: 'inline-block', width: 8, height: 14, background: 'var(--accent)', animation: 'blink 1.1s step-end infinite', verticalAlign: 'middle' }} />
                  </div>
                </div>
              </div>

              {/* Location chip */}
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {profile.location}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="work" className="section-pad" style={{ padding: '120px 28px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 36, borderBottom: '1px solid var(--border)', marginBottom: 60 }}>
            <div>
              <span className="section-label">{tx(UI.projects.label, lang)}</span>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 46px)', letterSpacing: '-1px', lineHeight: 1.1 }}>
                {tx(UI.projects.title, lang)}
              </h2>
            </div>
            <Link href="/projects" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
              {tx(UI.projects.viewAll, lang)}
            </Link>
          </div>

          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {projects.filter(p => p.featured || projects.length <= 4).slice(0, 4).map(p => (
              <div key={p.id} className="card card-glow" style={{ padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {p.featured && <span className="badge badge-featured">{tx(UI.projects.featured, lang)}</span>}
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)' }}>{p.year}</span>
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 20, marginBottom: 10, letterSpacing: '-0.3px' }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>{tx(p.description, lang)}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 16, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                  >{tx(UI.projects.github, lang)}</a>}
                  {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--accent)', textDecoration: 'none', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  >{tx(UI.projects.demo, lang)}</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section-pad" style={{ padding: '120px 28px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ paddingBottom: 36, borderBottom: '1px solid var(--border)', marginBottom: 60 }}>
            <span className="section-label">{tx(UI.about.label, lang)}</span>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 46px)', letterSpacing: '-1px' }}>
              {tx(UI.about.title, lang)}
            </h2>
          </div>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
            {/* Skills */}
            <div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 20, marginBottom: 32, color: 'var(--text-2)' }}>
                {tx(UI.about.techStack, lang)}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {Object.entries(catGroups).map(([cat, catSkills]) => (
                  <div key={cat}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[cat] || 'var(--accent)' }} />
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>{cat.toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {catSkills.map(s => (
                          <span
                            key={s.id}
                            className="tag"
                            style={{
                              cursor: 'default',
                              borderColor: (CATEGORY_COLORS[cat] ? `${CATEGORY_COLORS[cat]}66` : 'var(--border)'),
                            }}
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div id="experience" className="experience-block">
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 20, marginBottom: 32, color: 'var(--text-2)' }}>
                {tx(UI.about.experience, lang)}
              </h3>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'var(--border)' }} />
                {experiences.map((exp, i) => (
                  <div key={exp.id} style={{ paddingLeft: 28, paddingBottom: i < experiences.length - 1 ? 36 : 0, position: 'relative', marginBottom: i < experiences.length - 1 ? 36 : 0 }}>
                    <div style={{ position: 'absolute', left: -5, top: 7, width: 11, height: 11, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)' }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{exp.period}</span>
                    <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 16, color: 'var(--text)', marginTop: 4, marginBottom: 2 }}>{tx(exp.role, lang)}</h4>
                    <p style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>{exp.company}</p>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75 }}>{tx(exp.description, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section-pad" style={{ padding: '120px 28px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ paddingBottom: 36, borderBottom: '1px solid var(--border)', marginBottom: 60 }}>
            <span className="section-label">{tx(UI.contact.label, lang)}</span>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-1px', lineHeight: 1.1 }}>
              {tx(contact?.headline, lang)}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 12, maxWidth: 440, lineHeight: 1.7 }}>
              {tx(contact?.subtext, lang)}
            </p>
          </div>
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
            {/* Form */}
            <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="contact-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>{tx(UI.contact.name, lang)}</label>
                  <input type="text" value={form.name} placeholder={tx(UI.contact.namePh, lang)} required onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>{tx(UI.contact.email, lang)}</label>
                  <input type="email" value={form.email} placeholder={tx(UI.contact.emailPh, lang)} required onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>{tx(UI.contact.message, lang)}</label>
                <textarea value={form.message} placeholder={tx(UI.contact.messagePh, lang)} required rows={6} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              {sendError ? (
                <div style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', fontSize: 13 }}>
                  {sendError}
                </div>
              ) : null}
              <button type="submit" disabled={sending} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: sending ? 0.7 : 1 }}>
                {sent ? tx(UI.contact.sent, lang) : sending ? tx(UI.contact.sending, lang) : tx(UI.contact.send, lang)}
              </button>
            </form>

            {/* Social Info */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 10 }}>{tx(UI.contact.directMail, lang)}</div>
                  <a href={`mailto:${profile.email}`} style={{ fontSize: 18, color: 'var(--text)', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, wordBreak: 'break-all' }}>{profile.email}</a>
                </div>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 14 }}>{tx(UI.contact.social, lang)}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {([['GitHub', profile.github], ['LinkedIn', profile.linkedin], ['Twitter', profile.twitter]] as [string, string][]).filter(([, h]) => h).map(([label, href]) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'}
                      >
                        <div style={{ width: 24, height: 1, background: 'var(--border)' }} /> {label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)', marginTop: 32, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                © {new Date().getFullYear()} {profile.name} — Built with Next.js
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
