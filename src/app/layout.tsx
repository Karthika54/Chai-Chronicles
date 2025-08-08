import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from '@/components/SiteHeader';
import { ChaiDataProvider } from '@/context/ChaiDataContext';
import { StreakPopup } from '@/components/StreakPopup';

export const metadata: Metadata = {
  title: 'Chaya Kada Chronicles',
  description: 'A Gloriously Useless Ode to Chai Culture',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <ChaiDataProvider>
            <div className="flex flex-col min-h-screen">
                <SiteHeader />
                <main className="flex-1">
                    {children}
                </main>
                <footer className="bg-accent/20 text-accent-foreground/60 py-4">
                  <div className="container mx-auto text-center font-body">
                    <p>&copy; {new Date().getFullYear()} Chaya Kada Chronicles. All sips reserved.</p>
                  </div>
                </footer>
            </div>
            <Toaster />
            <StreakPopup />
        </ChaiDataProvider>
      </body>
    </html>
  );
}
