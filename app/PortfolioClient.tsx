'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from './components/AppProvider';
import { UI, tx } from './lib/translations';
import type { PortfolioData } from './lib/types';

type Section = 'home' | 'work' | 'about' | 'experience' | 'contact';

function externalHref(label: string, value: string) {
  if (label === 'WhatsApp' && value && !/^https?:\/\//i.test(value)) return `https://wa.me/${value.replace(/\D/g, '')}`;
  return value;
}

export default function PortfolioPage({ initialData }: { initialData: PortfolioData }) {
  const { theme, lang, multiLangEnabled, toggleTheme, setLang } = useApp();
  const data = initialData;
  const [activeNav, setActiveNav] = useState<Section>('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections: Section[] = ['home', 'work', 'experience', 'about', 'contact'];
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
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    setMobileOpen(false);
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch('/api/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const result = await res.json();
      if (!res.ok) throw new Error('Message delivery failed');
      if (!result.emailSent) {
        setSendError(lang === 'id' ? 'Pesan tersimpan, tetapi email belum terkirim. Hubungi lewat email langsung untuk kepastian.' : 'Message was saved, but email delivery failed. Please use the direct email link to be sure.');
        return;
      }
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    } catch {
      setSendError(lang === 'id' ? 'Pesan belum berhasil dikirim. Silakan gunakan email langsung.' : 'Message could not be delivered. Please use the direct email link.');
    } finally {
      setSending(false);
    }
  };

  const { profile, skills, projects, experiences, contact } = data;
  const whatsappHref = contact?.links?.whatsapp ? externalHref('WhatsApp', contact.links.whatsapp) : '';
  const linkedinHref = contact?.links?.linkedin || profile.linkedin || '';
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
      <a href="#main-content" className="skip-link">{lang === 'id' ? 'Lewati navigasi' : 'Skip navigation'}</a>
      <nav aria-label={lang === 'id' ? 'Navigasi utama' : 'Main navigation'} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled || mobileOpen ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled || mobileOpen ? 'blur(16px)' : 'none',
        borderBottom: scrolled || mobileOpen ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => scrollTo('home')} aria-label="Home" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} style={{
                    background: lang === l ? 'var(--accent)' : 'transparent',
                    border: 'none', color: lang === l ? '#fff' : 'var(--text-2)',
                    padding: '5px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase',
                  }}>{l}</button>
                ))}
              </div>
            )}

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn-ghost" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'} style={{ marginLeft: 4, width: 36, height: 36 }}>
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
                  <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} style={{
                    background: lang === l ? 'var(--accent)' : 'transparent',
                    border: 'none', color: lang === l ? '#fff' : 'var(--text-2)',
                    padding: '4px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    cursor: 'pointer', textTransform: 'uppercase',
                  }}>{l}</button>
                ))}
              </div>
            )}
            <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} className="nav-mobile-menu btn-ghost" style={{ display: 'none', width: 34, height: 34 }}>
              {theme === 'dark'
                ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              }
            </button>
            <button className="nav-mobile-menu mobile-menu-button" type="button" aria-label={mobileOpen ? (lang === 'id' ? 'Tutup menu' : 'Close menu') : (lang === 'id' ? 'Buka menu' : 'Open menu')} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} style={{
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
          <div id="mobile-navigation" style={{ padding: '16px 28px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
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

      <main id="main-content">
      {/* ── HERO ── */}
      <section id="home" className="portfolio-hero">
        <div className="portfolio-container">
          <div className="hero-meta">
            <span>{tx(profile.title, lang)}</span>
            {profile.location && <span>{profile.location}</span>}
          </div>
          <div className="hero-copy">
            <h1>{profile.name}<span aria-hidden="true">.</span></h1>
            <p className="hero-intro">{tx(profile.bio, lang)}</p>
            <div className="hero-actions">
              <button onClick={() => scrollTo('work')} className="btn-primary">{tx(UI.hero.viewWork, lang)} <span aria-hidden="true">↗</span></button>
              <button onClick={() => scrollTo('contact')} className="text-link">{tx(UI.hero.contactMe, lang)} <span aria-hidden="true">↗</span></button>
            </div>
          </div>
          <div className="hero-footnote">
            <span>{profile.available ? tx(UI.hero.available, lang) : tx(profile.title, lang)}</span>
            {profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">CV / Resume ↗</a>}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="work" className="portfolio-section selected-work">
        <div className="portfolio-container">
          <div className="section-heading">
            <div>
              <span className="section-label">{tx(UI.projects.label, lang)}</span>
              <h2>{tx(UI.projects.title, lang)}</h2>
            </div>
            <Link href="/projects" className="text-link">{tx(UI.projects.viewAll, lang)} <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="project-list">
            {projects.filter(p => p.featured || projects.length <= 4).slice(0, 4).map((p, index) => (
              <article key={p.id} className="project-item">
                <div className="project-index">
                  <span>{String(index + 1).padStart(2, '0')} / {p.year}</span>
                  {p.featured && <span>{tx(UI.projects.featured, lang)}</span>}
                </div>
                <div className="project-body">
                  {p.image && <Link href={`/projects/${p.id}`} className="project-image-link"><img src={p.image} alt={`Screenshot ${p.title}`} loading="lazy" /></Link>}
                  <h3><Link href={`/projects/${p.id}`}>{p.title} <span aria-hidden="true">↗</span></Link></h3>
                  <p>{tx(p.description, lang)}</p>
                  <div className="project-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
                  <div className="project-links">
                    <Link href={`/projects/${p.id}`}>{lang === 'id' ? 'Lihat detail' : 'View details'} <span aria-hidden="true">↗</span></Link>
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer">{tx(UI.projects.github, lang)} <span aria-hidden="true">↗</span></a>}
                    {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer">{tx(UI.projects.demo, lang)} <span aria-hidden="true">↗</span></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
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
                  <label htmlFor="contact-name" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>{tx(UI.contact.name, lang)}</label>
                  <input id="contact-name" name="name" autoComplete="name" type="text" value={form.name} placeholder={tx(UI.contact.namePh, lang)} required onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="contact-email" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>{tx(UI.contact.email, lang)}</label>
                  <input id="contact-email" name="email" autoComplete="email" type="email" value={form.email} placeholder={tx(UI.contact.emailPh, lang)} required onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>{tx(UI.contact.message, lang)}</label>
                <textarea id="contact-message" name="message" value={form.message} placeholder={tx(UI.contact.messagePh, lang)} required rows={6} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              {sendError ? (
                  <div role="alert" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', fontSize: 13 }}>
                  {sendError}
                </div>
              ) : null}
              <button type="submit" disabled={sending} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: sending ? 0.7 : 1 }}>
                {sent ? tx(UI.contact.sent, lang) : sending ? tx(UI.contact.sending, lang) : tx(UI.contact.send, lang)}
              </button>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                {whatsappHref && <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>WhatsApp</a>}
                {linkedinHref && <a href={linkedinHref} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>LinkedIn</a>}
              </div>
            </form>

            {/* Social Info */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 10 }}>{tx(UI.contact.directMail, lang)}</div>
                  <a href={`mailto:${contact?.links?.email || profile.email}`} style={{ fontSize: 18, color: 'var(--text)', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, wordBreak: 'break-all' }}>{contact?.links?.email || profile.email}</a>
                </div>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 14 }}>{tx(UI.contact.social, lang)}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {([['GitHub', contact?.links?.github || profile.github], ['LinkedIn', linkedinHref], ['Instagram', profile.instagram], ['Website', contact?.links?.website || ''], ['WhatsApp', whatsappHref]] as [string, string][]).filter(([, h]) => h).map(([label, href]) => (
                      <a key={label} href={externalHref(label, href)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.2s' }}
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
                <Link href="/privacy" style={{ display: 'block', width: 'fit-content', marginTop: 12, color: 'var(--text-2)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                  {lang === 'id' ? 'Kebijakan privasi' : 'Privacy policy'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}
