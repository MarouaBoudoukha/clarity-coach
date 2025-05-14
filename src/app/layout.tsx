import { Inter } from 'next/font/google';
import '@worldcoin/mini-apps-ui-kit-react/styles.css';
import './globals.css';
import ClientLayout from './ClientLayout';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Clarity Coach',
  description: 'Your AI-powered coaching companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ClientLayout>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
