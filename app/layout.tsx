import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from './components/AppProvider';
import type { Theme, Lang } from './lib/types';
import { readPortfolioData } from '@/lib/portfolioStore';

export const dynamic = 'force-dynamic';

async function getSettings() {
  try {
    const d = await readPortfolioData();
    return d.settings as { defaultTheme: Theme; defaultLang: Lang; multiLangEnabled: boolean };
  } catch {
    return { defaultTheme: 'dark' as Theme, defaultLang: 'id' as Lang, multiLangEnabled: true };
  }
}

export const metadata: Metadata = {
  title: 'Portfolio — Fullstack Web Developer',
  description: 'Personal portfolio of a fullstack web developer. React, Next.js, Node.js, PostgreSQL, TypeScript.',
  keywords: ['fullstack developer', 'web developer', 'React', 'Next.js', 'Node.js', 'TypeScript'],
  authors: [{ name: 'Fullstack Developer' }],
  openGraph: {
    type: 'website',
    title: 'Portfolio — Fullstack Web Developer',
    description: 'Building end-to-end web applications with modern technologies.',
    siteName: 'Portfolio',
  },
  twitter: { card: 'summary_large_image', title: 'Portfolio — Fullstack Web Developer' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { defaultTheme, defaultLang, multiLangEnabled } = await getSettings();
  return (
    <html lang={defaultLang} suppressHydrationWarning>
      <head>
        {/* Prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('pf-theme')||'${defaultTheme}';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();` }} />
      </head>
      <body suppressHydrationWarning>
        <AppProvider defaultTheme={defaultTheme} defaultLang={defaultLang} multiLangEnabled={multiLangEnabled}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
