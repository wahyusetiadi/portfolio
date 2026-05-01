'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PortfolioData, Project, Skill, Experience, OngoingProject } from '../../lib/types';

type Tab = 'profile' | 'projects' | 'ongoing' | 'skills' | 'experience' | 'messages' | 'settings';

const STATUS_OPTS = ['planning', 'in-progress', 'review', 'completed'] as const;
const CAT_OPTS = ['Frontend', 'Backend', 'Language', 'Database', 'DevOps', 'Other'];
const LANG_OPTS = [{ v: 'id', l: 'Bahasa Indonesia' }, { v: 'en', l: 'English' }];
const THEME_OPTS = [{ v: 'dark', l: 'Dark (Gelap)' }, { v: 'light', l: 'Light (Terang)' }];

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [tab, setTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedOngoing, setExpandedOngoing] = useState<string | null>(null);
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/admin/portfolio').then(async r => {
      if (r.status === 401) { router.replace('/admin/login'); return null; }
      return r.json();
    }).then(d => { if (d) setData(d); });
  }, [router]);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    const res = await fetch('/api/admin/portfolio', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.status === 401) { router.replace('/admin/login'); return; }
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  if (!data) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const { profile, skills, projects, experiences, contact, ongoingProjects = [], settings } = data;

  /* ── helpers ── */
  const updateProfile = (k: string, v: string | boolean) => setData({ ...data, profile: { ...data.profile, [k]: v } });
  const updateProfileI18n = (k: string, lang: 'id' | 'en', v: string) => {
    const prev = (data.profile as unknown as Record<string, { id: string; en: string }>)[k] || { id: '', en: '' };
    setData({ ...data, profile: { ...data.profile, [k]: { ...prev, [lang]: v } } });
  };
  const updateProject   = (id: string, u: Partial<Project>) => setData({ ...data, projects: data.projects.map(p => p.id === id ? { ...p, ...u } : p) });
  const updateProjectI18n = (id: string, lang: 'id' | 'en', v: string) => setData({ ...data, projects: data.projects.map(p => p.id === id ? { ...p, description: { ...p.description, [lang]: v } } : p) });
  const deleteProject   = (id: string) => { setData({ ...data, projects: data.projects.filter(p => p.id !== id) }); if (expandedProject === id) setExpandedProject(null); };
  const addProject = () => {
    const np: Project = { id: Date.now().toString(), title: 'New Project', description: { id: '', en: '' }, tags: [], status: 'completed', startDate: '', image: '', github: '', demo: '', featured: false, year: new Date().getFullYear().toString() };
    setData({ ...data, projects: [...data.projects, np] }); setExpandedProject(np.id);
  };
  const updateOngoing   = (id: string, u: Partial<OngoingProject>) => setData({ ...data, ongoingProjects: ongoingProjects.map(p => p.id === id ? { ...p, ...u } : p) });
  const updateOngoingI18n = (id: string, lang: 'id' | 'en', v: string) => setData({ ...data, ongoingProjects: ongoingProjects.map(p => p.id === id ? { ...p, description: { ...p.description, [lang]: v } } : p) });
  const deleteOngoing   = (id: string) => { setData({ ...data, ongoingProjects: ongoingProjects.filter(p => p.id !== id) }); if (expandedOngoing === id) setExpandedOngoing(null); };
  const addOngoing = () => {
    const np: OngoingProject = { id: Date.now().toString(), title: 'Ongoing Project', description: { id: '', en: '' }, tags: [], status: 'in-progress', startDate: new Date().toISOString().slice(0,7), expectedEnd: '', github: '', demo: '', public: true };
    setData({ ...data, ongoingProjects: [...ongoingProjects, np] }); setExpandedOngoing(np.id);
  };
  const updateSkill     = (id: string, u: Partial<Skill>) => setData({ ...data, skills: data.skills.map(s => s.id === id ? { ...s, ...u } : s) });
  const deleteSkill     = (id: string) => setData({ ...data, skills: data.skills.filter(s => s.id !== id) });
  const addSkill = () => setData({ ...data, skills: [...data.skills, { id: Date.now().toString(), name: 'New Skill', level: 75, category: 'Frontend' }] });
  const updateExp       = (id: string, u: Partial<Experience>) => setData({ ...data, experiences: data.experiences.map(e => e.id === id ? { ...e, ...u } : e) });
  const updateExpI18n   = (id: string, field: 'role' | 'description', lang: 'id' | 'en', v: string) => setData({ ...data, experiences: data.experiences.map(e => e.id === id ? { ...e, [field]: { ...e[field], [lang]: v } } : e) });
  const deleteExp       = (id: string) => setData({ ...data, experiences: data.experiences.filter(e => e.id !== id) });
  const addExp = () => setData({ ...data, experiences: [...data.experiences, { id: Date.now().toString(), company: 'Company', role: { id: 'Posisi', en: 'Position' }, period: '2024 — Now', description: { id: '', en: '' } }] });
  const updateSettings  = (k: string, v: string | boolean) => setData({ ...data, settings: { ...data.settings, [k]: v } });
  const updateContactI18n = (field: 'headline' | 'subtext', lang: 'id' | 'en', v: string) => setData({ ...data, contact: { ...data.contact, [field]: { ...data.contact[field], [lang]: v } } });

  const addTag = (listKey: 'project' | 'ongoing', id: string) => {
    const key = `${listKey}-${id}`;
    const t = (tagInputs[key] || '').trim(); if (!t) return;
    if (listKey === 'project') { const p = projects.find(p => p.id === id); if (p) updateProject(id, { tags: [...p.tags, t] }); }
    else { const p = ongoingProjects.find(p => p.id === id); if (p) updateOngoing(id, { tags: [...p.tags, t] }); }
    setTagInputs(prev => ({ ...prev, [key]: '' }));
  };
  const removeTag = (listKey: 'project' | 'ongoing', id: string, tag: string) => {
    if (listKey === 'project') { const p = projects.find(p => p.id === id); if (p) updateProject(id, { tags: p.tags.filter(x => x !== tag) }); }
    else { const p = ongoingProjects.find(p => p.id === id); if (p) updateOngoing(id, { tags: p.tags.filter(x => x !== tag) }); }
  };

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'profile',    label: 'Profil' },
    { id: 'projects',   label: 'Proyek',     count: projects.length },
    { id: 'ongoing',    label: 'Ongoing',    count: ongoingProjects.length },
    { id: 'skills',     label: 'Keahlian',   count: skills.length },
    { id: 'experience', label: 'Pengalaman' },
    { id: 'messages',   label: 'Pesan',      count: contact?.messages?.length },
    { id: 'settings',   label: 'Pengaturan' },
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-2)', textDecoration: 'none' }}>← Portfolio</Link>
            <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Admin Panel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={save} disabled={saving} style={{
              background: saved ? 'var(--success)' : 'var(--accent)', color: '#fff', border: 'none',
              padding: '9px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.25s', opacity: saving ? 0.7 : 1,
            }}>
              {saved ? '✓ Tersimpan' : saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button onClick={logout} style={{
              background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)',
              padding: '9px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
            }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout" style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px', display: 'flex', gap: 40 }}>
        {/* Sidebar */}
        <aside className="admin-sidebar" style={{ width: 180, flexShrink: 0 }}>
          <nav style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                textAlign: 'left', cursor: 'pointer', padding: '9px 14px', fontSize: 13,
                borderRadius: 8, fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                border: tab === t.id ? '1px solid var(--border)' : '1px solid transparent',
                color: tab === t.id ? 'var(--text)' : 'var(--text-2)',
                fontWeight: tab === t.id ? 600 : 400, background: tab === t.id ? 'var(--bg-elevated)' : 'transparent',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {t.label}
                {t.count !== undefined && (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '1px 6px', borderRadius: 4 }}>{t.count}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div>
              <h2 style={H2}>Edit Profil</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card title="IDENTITAS">
                  <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Nama Lengkap" value={profile.name} onChange={v => updateProfile('name', v)} />
                    <Field label="Lokasi" value={profile.location} onChange={v => updateProfile('location', v)} />
                    <Field label="Tahun Pengalaman" value={profile.yearsExp} onChange={v => updateProfile('yearsExp', v)} />
                  </div>
                  <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                    <Field label="Judul — Indonesia" value={typeof profile.title === 'object' ? profile.title.id : profile.title} onChange={v => updateProfileI18n('title', 'id', v)} />
                    <Field label="Judul — English" value={typeof profile.title === 'object' ? profile.title.en : ''} onChange={v => updateProfileI18n('title', 'en', v)} />
                    <Field label="Bio — Indonesia" value={typeof profile.bio === 'object' ? profile.bio.id : profile.bio} onChange={v => updateProfileI18n('bio', 'id', v)} textarea />
                    <Field label="Bio — English" value={typeof profile.bio === 'object' ? profile.bio.en : ''} onChange={v => updateProfileI18n('bio', 'en', v)} textarea />
                  </div>
                </Card>
                <Card title="KONTAK & SOSIAL">
                  <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Email" value={profile.email} onChange={v => updateProfile('email', v)} />
                    <Field label="GitHub URL" value={profile.github} onChange={v => updateProfile('github', v)} />
                    <Field label="LinkedIn URL" value={profile.linkedin} onChange={v => updateProfile('linkedin', v)} />
                    <Field label="Twitter URL" value={profile.twitter} onChange={v => updateProfile('twitter', v)} />
                  </div>
                </Card>
                <Card title="STATUS">
                  <Toggle label="Tersedia untuk proyek baru" value={profile.available} onChange={v => updateProfile('available', v)} />
                </Card>
                <Card title="PESAN KONTAK">
                  <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Headline — Indonesia" value={typeof contact?.headline === 'object' ? contact.headline.id : ''} onChange={v => updateContactI18n('headline', 'id', v)} />
                    <Field label="Headline — English" value={typeof contact?.headline === 'object' ? contact.headline.en : ''} onChange={v => updateContactI18n('headline', 'en', v)} />
                    <Field label="Subtext — Indonesia" value={typeof contact?.subtext === 'object' ? contact.subtext.id : ''} onChange={v => updateContactI18n('subtext', 'id', v)} />
                    <Field label="Subtext — English" value={typeof contact?.subtext === 'object' ? contact.subtext.en : ''} onChange={v => updateContactI18n('subtext', 'en', v)} />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {tab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={H2}>Kelola Proyek</h2>
                <button onClick={addProject} style={AddBtn}>+ Tambah Proyek</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {projects.map(p => (
                  <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-card)' }}>
                    <div onClick={() => setExpandedProject(expandedProject === p.id ? null : p.id)} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: expandedProject === p.id ? 'var(--bg-elevated)' : 'var(--bg-card)', transition: 'background 0.15s' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{p.year} · {p.tags.join(', ') || '—'}</div>
                      </div>
                      {p.featured && <span style={{ fontSize: 10, color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 4, padding: '2px 8px', fontFamily: 'JetBrains Mono, monospace' }}>FEATURED</span>}
                      <button onClick={e => { e.stopPropagation(); deleteProject(p.id); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}>×</button>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{expandedProject === p.id ? '▲' : '▼'}</span>
                    </div>
                    {expandedProject === p.id && (
                      <div style={{ padding: 20, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <Field label="Judul" value={p.title} onChange={v => updateProject(p.id, { title: v })} />
                          <Field label="Tahun" value={p.year} onChange={v => updateProject(p.id, { year: v })} />
                        </div>
                        <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <Field label="Deskripsi — Indonesia" value={typeof p.description === 'object' ? p.description.id : ''} onChange={v => updateProjectI18n(p.id, 'id', v)} textarea />
                          <Field label="Deskripsi — English" value={typeof p.description === 'object' ? p.description.en : ''} onChange={v => updateProjectI18n(p.id, 'en', v)} textarea />
                        </div>
                        <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <Field label="GitHub URL" value={p.github} onChange={v => updateProject(p.id, { github: v })} />
                          <Field label="Demo URL" value={p.demo} onChange={v => updateProject(p.id, { demo: v })} />
                        </div>
                        <div>
                          <label style={LBL}>Tags</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            {p.tags.map(t => (
                              <span key={t} style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {t}
                                <button onClick={() => removeTag('project', p.id, t)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                              </span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input value={tagInputs[`project-${p.id}`] || ''} onChange={e => setTagInputs(prev => ({ ...prev, [`project-${p.id}`]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addTag('project', p.id)} placeholder="Tambah tag, Enter" style={{ flex: 1 }} />
                            <button onClick={() => addTag('project', p.id)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-2)', padding: '0 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>+</button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 20 }}>
                          <Toggle label="Featured" value={p.featured} onChange={v => updateProject(p.id, { featured: v })} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ONGOING ── */}
          {tab === 'ongoing' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={H2}>Ongoing Projects</h2>
                <button onClick={addOngoing} style={AddBtn}>+ Tambah</button>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Project yang sedang dikerjakan. Toggle "Tampilkan ke publik" agar muncul di halaman /projects.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ongoingProjects.map(p => (
                  <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-card)' }}>
                    <div onClick={() => setExpandedOngoing(expandedOngoing === p.id ? null : p.id)} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: expandedOngoing === p.id ? 'var(--bg-elevated)' : 'var(--bg-card)', transition: 'background 0.15s' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{p.status} · {p.startDate}</div>
                      </div>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace', border: '1px solid', color: p.public ? 'var(--success)' : 'var(--text-muted)', borderColor: p.public ? 'var(--success)' : 'var(--border)' }}>{p.public ? 'PUBLIC' : 'PRIVATE'}</span>
                      <button onClick={e => { e.stopPropagation(); deleteOngoing(p.id); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}>×</button>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{expandedOngoing === p.id ? '▲' : '▼'}</span>
                    </div>
                    {expandedOngoing === p.id && (
                      <div style={{ padding: 20, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <Field label="Judul" value={p.title} onChange={v => updateOngoing(p.id, { title: v })} />
                          <div>
                            <label style={LBL}>Status</label>
                            <select value={p.status} onChange={e => updateOngoing(p.id, { status: e.target.value as typeof p.status })}>
                              {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <Field label="Deskripsi — Indonesia" value={typeof p.description === 'object' ? p.description.id : ''} onChange={v => updateOngoingI18n(p.id, 'id', v)} textarea />
                          <Field label="Deskripsi — English" value={typeof p.description === 'object' ? p.description.en : ''} onChange={v => updateOngoingI18n(p.id, 'en', v)} textarea />
                        </div>
                        <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <Field label="Tanggal Mulai (YYYY-MM)" value={p.startDate} onChange={v => updateOngoing(p.id, { startDate: v })} placeholder="2025-01" />
                          <Field label="Target Selesai (YYYY-MM)" value={p.expectedEnd || ''} onChange={v => updateOngoing(p.id, { expectedEnd: v })} placeholder="2025-06" />
                        </div>
                        <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <Field label="GitHub URL" value={p.github || ''} onChange={v => updateOngoing(p.id, { github: v })} />
                          <Field label="Demo URL" value={p.demo || ''} onChange={v => updateOngoing(p.id, { demo: v })} />
                        </div>
                        <div>
                          <label style={LBL}>Tags</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            {p.tags.map(t => (
                              <span key={t} style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {t}
                                <button onClick={() => removeTag('ongoing', p.id, t)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                              </span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input value={tagInputs[`ongoing-${p.id}`] || ''} onChange={e => setTagInputs(prev => ({ ...prev, [`ongoing-${p.id}`]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addTag('ongoing', p.id)} placeholder="Tambah tag, Enter" style={{ flex: 1 }} />
                            <button onClick={() => addTag('ongoing', p.id)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-2)', padding: '0 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>+</button>
                          </div>
                        </div>
                        <Toggle label="Tampilkan ke publik (/projects)" value={p.public} onChange={v => updateOngoing(p.id, { public: v })} />
                      </div>
                    )}
                  </div>
                ))}
                {ongoingProjects.length === 0 && (
                  <div style={{ border: '1px dashed var(--border)', borderRadius: 10, padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
                    Belum ada ongoing project. Klik "+ Tambah" untuk mulai.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SKILLS ── */}
          {tab === 'skills' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={H2}>Kelola Keahlian</h2>
                <button onClick={addSkill} style={AddBtn}>+ Tambah Skill</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {skills.map(s => (
                  <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px auto', gap: 10, alignItems: 'center' }}>
                      <input value={s.name} onChange={e => updateSkill(s.id, { name: e.target.value })} placeholder="Nama skill" />
                      <select value={s.category} onChange={e => updateSkill(s.id, { category: e.target.value })}>
                        {CAT_OPTS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button onClick={() => deleteSkill(s.id)} style={{ background: 'none', border: '1px solid var(--danger)', color: 'var(--danger)', cursor: 'pointer', fontSize: 12, padding: '7px 14px', borderRadius: 6, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>Hapus</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={LBL}>Level</label>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{s.level}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={s.level} onChange={e => updateSkill(s.id, { level: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', padding: 0, background: 'none', border: 'none', boxShadow: 'none' }} />
                    <div style={{ height: 3, background: 'var(--bg-elevated)', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: `${s.level}%`, background: 'var(--accent-grad)', borderRadius: 99, transition: 'width 0.1s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── EXPERIENCE ── */}
          {tab === 'experience' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={H2}>Kelola Pengalaman</h2>
                <button onClick={addExp} style={AddBtn}>+ Tambah</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '20px 24px', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                      <button onClick={() => deleteExp(exp.id)} style={{ background: 'none', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Hapus</button>
                    </div>
                    <div className="admin-grid3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                      <Field label="Perusahaan" value={exp.company} onChange={v => updateExp(exp.id, { company: v })} />
                      <Field label="Posisi (ID)" value={typeof exp.role === 'object' ? exp.role.id : (exp.role as string)} onChange={v => updateExpI18n(exp.id, 'role', 'id', v)} />
                      <Field label="Posisi (EN)" value={typeof exp.role === 'object' ? exp.role.en : ''} onChange={v => updateExpI18n(exp.id, 'role', 'en', v)} />
                    </div>
                    <Field label="Periode" value={exp.period} onChange={v => updateExp(exp.id, { period: v })} />
                    <div className="admin-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                      <Field label="Deskripsi (ID)" value={typeof exp.description === 'object' ? exp.description.id : (exp.description as string)} onChange={v => updateExpI18n(exp.id, 'description', 'id', v)} textarea />
                      <Field label="Deskripsi (EN)" value={typeof exp.description === 'object' ? exp.description.en : ''} onChange={v => updateExpI18n(exp.id, 'description', 'en', v)} textarea />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {tab === 'messages' && (
            <div>
              <h2 style={H2}>Pesan Masuk</h2>
              {(!contact?.messages || contact.messages.length === 0) ? (
                <div style={{ border: '1px dashed var(--border)', borderRadius: 10, padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }}>Belum ada pesan</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[...contact.messages].reverse().map((msg, i) => (
                    <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '20px 24px', background: 'var(--bg-card)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{msg.name}</div>
                          <a href={`mailto:${msg.email}`} style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>{msg.email}</a>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{new Date(msg.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, paddingTop: 12, borderTop: '1px solid var(--border)' }}>{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div>
              <h2 style={H2}>Pengaturan</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Card title="BAHASA">
                  <Toggle
                    label="Aktifkan Multi-Bahasa (ID/EN toggle di navbar)"
                    value={settings?.multiLangEnabled ?? true}
                    onChange={v => updateSettings('multiLangEnabled', v)}
                  />
                  <div style={{ marginTop: 14 }}>
                    <label style={LBL}>Bahasa Default</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {LANG_OPTS.map(o => (
                        <button key={o.v} onClick={() => updateSettings('defaultLang', o.v)} style={{
                          flex: 1, padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13,
                          border: settings?.defaultLang === o.v ? '1px solid var(--accent)' : '1px solid var(--border)',
                          background: settings?.defaultLang === o.v ? 'var(--accent-glow)' : 'var(--bg-surface)',
                          color: settings?.defaultLang === o.v ? 'var(--accent)' : 'var(--text-2)', fontWeight: settings?.defaultLang === o.v ? 600 : 400,
                          transition: 'all 0.2s',
                        }}>{o.l}</button>
                      ))}
                    </div>
                  </div>
                </Card>
                <Card title="TAMPILAN">
                  <div>
                    <label style={LBL}>Tema Default (saat pertama kali dibuka)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {THEME_OPTS.map(o => (
                        <button key={o.v} onClick={() => updateSettings('defaultTheme', o.v)} style={{
                          flex: 1, padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13,
                          border: settings?.defaultTheme === o.v ? '1px solid var(--accent)' : '1px solid var(--border)',
                          background: settings?.defaultTheme === o.v ? 'var(--accent-glow)' : 'var(--bg-surface)',
                          color: settings?.defaultTheme === o.v ? 'var(--accent)' : 'var(--text-2)', fontWeight: settings?.defaultTheme === o.v ? 600 : 400,
                          transition: 'all 0.2s',
                        }}>{o.l}</button>
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                      * Pengunjung bisa override tema via tombol ☀/🌙 di navbar.
                    </p>
                  </div>
                </Card>
                <div style={{ padding: '14px 18px', background: 'rgba(139,92,246,0.06)', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    💡 Klik "Simpan Perubahan" di header untuk menerapkan semua pengaturan.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

/* ── Shared Components ── */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-card)' }}>
      <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{title}</span>
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string }) {
  return (
    <div>
      <label style={LBL}>{label}</label>
      {textarea
        ? <textarea value={value} rows={3} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ resize: 'vertical' as const }} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 99, cursor: 'pointer', transition: 'background 0.25s', position: 'relative', background: value ? 'var(--accent)' : 'var(--bg-elevated)', border: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: value ? 22 : 2, transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </div>
      <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{label}</span>
    </div>
  );
}

const H2: React.CSSProperties = { fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--text)', marginBottom: 20, letterSpacing: '-0.3px' };
const LBL: React.CSSProperties = { display: 'block', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 6 };
const AddBtn: React.CSSProperties = { background: 'var(--accent)', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600 };
