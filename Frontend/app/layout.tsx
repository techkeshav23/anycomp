import type { Metadata } from 'next';
import { Red_Hat_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

const redHatDisplay = Red_Hat_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-red-hat-display'
});

export const metadata: Metadata = {
  title: 'Anycomp - Register Your Company',
  description: 'Incorporate Your Company, Appoint a Secretary & Manage Everything in One Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={redHatDisplay.variable}>
      <body className={redHatDisplay.className}>
        <ThemeRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
