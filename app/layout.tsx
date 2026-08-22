import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces, Lexend } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['opsz', 'SOFT', 'WONK'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8B0000',
};

export const metadata: Metadata = {
  title: {
    default: 'KL SAC — Student Activity Center, KL University',
    template: '%s — KL SAC',
  },
  description:
    'KL SAC is KL University\'s Student Activity Center — 24 clubs across 5 domains developing student leaders through culture, technology, wellness, service, and entrepreneurship.',
  keywords: [
    'KL SAC',
    'KL University',
    'Student Activity Center',
    'student clubs',
    'student development',
    'Vijayawada',
    'Andhra Pradesh',
  ],
  authors: [{ name: 'KL SAC', url: 'https://sacactivities.kluniversity.in' }],
  creator: 'KL SAC',
  publisher: 'KL University',
  metadataBase: new URL('https://sacactivities.kluniversity.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sacactivities.kluniversity.in',
    siteName: 'KL SAC',
    title: 'KL SAC — Student Activity Center, KL University',
    description:
      '24 clubs. 5 domains. One mission: to develop the complete student. KL SAC is where KL University students discover their passion, develop their potential, and lead with purpose.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KL SAC — Student Activity Center' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KL SAC — Student Activity Center',
    description: '24 clubs. 5 domains. One mission.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${lexend.variable} h-full antialiased`}>
      <body>{children}</body>
    </html>
  );
}
