import './globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { AppProvider } from '@/components/providers/app-provider';
import { Toaster } from '@/components/ui/sonner';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kareem Al-Rashid | Video Editor & Content Creator',
  description: 'Professional video editor, script writer, and content creator specializing in cinematic storytelling, motion graphics, and social media content.',
  openGraph: {
    title: 'Kareem Al-Rashid | Video Editor & Content Creator',
    description: 'Cinematic storytelling through video editing, script writing, and content creation.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexArabic.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased font-body">
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
