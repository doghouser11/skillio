import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Skillio - Детски дейности и курсове в България',
  description: 'Намерете най-добрите извънкласни дейности, спортни школи, езикови курсове и творчески занимания за деца в цяла България.',
  metadataBase: new URL('https://skillio.live'),
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Skillio - Детски дейности и курсове',
    description: 'Свързваме семейства с качествени извънкласни дейности за деца в България.',
    url: 'https://skillio.live',
    siteName: 'Skillio',
    locale: 'bg_BG',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Skillio - Детски дейности и курсове',
    description: 'Свързваме семейства с качествени извънкласни дейности за деца.',
  },
  alternates: {
    canonical: 'https://skillio.live',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <body className={quicksand.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col" style={{backgroundColor: '#FDF6EC'}}>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}