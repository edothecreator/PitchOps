import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PitchOps',
    template: '%s · PitchOps',
  },
  description:
    'Professional football analytics — live scores, standings, statistics for La Liga and Champions League.',
  keywords: ['football', 'analytics', 'la liga', 'champions league', 'standings', 'statistics'],
  openGraph: {
    title: 'PitchOps',
    description: 'Professional football analytics dashboard',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
