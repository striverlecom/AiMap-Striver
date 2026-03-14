import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { cookies } from 'next/headers';

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "7 Ngày Xây Dựng Bản Đồ AI",
  description: "Khám phá bản đồ ứng dụng AI cho doanh nghiệp bạn trong 7 ngày. Phong cách tinh giản từ Apple.",
};

import NavLinks from '@/components/NavLinks';
import SubNav from '@/components/SubNav';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const hasSession = cookieStore.has('session')

  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <header className="nav-header">
          <nav className="nav-container">
            <Link href="/" className="nav-logo">
              STRIVER.AI.VN
            </Link>
            <NavLinks hasSession={hasSession} />
          </nav>
        </header>
        <SubNav hasSession={hasSession} />
        <main style={{ paddingTop: '5vh', paddingBottom: '10vh', minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
