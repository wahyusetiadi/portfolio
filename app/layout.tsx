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
  title: 'Wahyu Setiadi — Fullstack Web Developer',
  description: 'Portfolio Wahyu Setiadi, Fullstack Web Developer yang membangun aplikasi web end-to-end dengan React, Next.js, Node.js, dan TypeScript.',
  keywords: ['fullstack developer', 'web developer', 'React', 'Next.js', 'Node.js', 'TypeScript'],
  authors: [{ name: 'Wahyu Setiadi' }],
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
  alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: '/' } : undefined,
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: ['/favicon.svg'],
    apple: [{ url: '/logo.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    title: 'Wahyu Setiadi — Fullstack Web Developer',
    description: 'Portfolio Wahyu Setiadi, Fullstack Web Developer.',
    siteName: 'Wahyu Setiadi',
    ...(process.env.NEXT_PUBLIC_SITE_URL ? { url: process.env.NEXT_PUBLIC_SITE_URL } : {}),
  },
  twitter: { card: 'summary_large_image', title: 'Wahyu Setiadi — Fullstack Web Developer' },
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
