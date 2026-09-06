import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Tajawal, Cairo } from 'next/font/google';
import { AppProvider } from '@/components/providers/app-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '500', '700'], variable: '--font-tajawal', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '500', '700'], variable: '--font-cairo', display: 'swap' });

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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${tajawal.variable} ${cairo.variable}`} suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --font-body: var(--font-inter), system-ui, sans-serif;
            --font-heading: var(--font-space-grotesk), system-ui, sans-serif;
            --font-arabic-heading: var(--font-tajawal), system-ui, sans-serif;
            --font-arabic-body: var(--font-cairo), system-ui, sans-serif;
          }
        `}</style>
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
