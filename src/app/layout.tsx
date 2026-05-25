import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from 'next/link';
import { cookies } from 'next/headers';
import Image from 'next/image';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Bản Đồ Hành Động AI Cho Doanh Nghiệp - STRIVER AI",
  description: "7 ngày hành động thật • Dữ liệu thật • Kết quả thật Không phải lý thuyết. Không phải xu hướng. Đừng trả tiền cho thử nghiệm AI nữa, hãy trả tiền cho kết quả. 'Thời đại này không cần quá nhiều thông tin hay công cụ, chỉ cần MỘT CHỈ DẪN HÀNH ĐỘNG cụ thể rõ ràng'",
  openGraph: {
    type: "website",
    title: "Bản Đồ Hành Động AI Cho Doanh Nghiệp - STRIVER AI",
    description: "7 ngày hành động thật • Dữ liệu thật • Kết quả thật Không phải lý thuyết. Không phải xu hướng. Đừng trả tiền cho thử nghiệm AI nữa, hãy trả tiền cho kết quả. 'Thời đại này không cần quá nhiều thông tin hay công cụ, chỉ cần MỘT CHỈ DẪN HÀNH ĐỘNG cụ thể rõ ràng'",
    images: [
      {
        url: "https://lh3.googleusercontent.com/pw/AP1GczNxpXiE29j2HySTgxtMQMURYCS4xmMYynU2EVlGQweuIqQQVwNnfeKiRBRM1YLxLfzGAMFgEoWZbo9lV6fPMABzontemUzPz0z4G8ubeZMd_6mu70fqhFFaiJn57FSivLAY1NoEt4Zvxmc1JKti0KILIg=w1920-h1080-s-no-gm",
        width: 1920,
        height: 1080,
        alt: "Bản Đồ Hành Động AI Cho Doanh Nghiệp - STRIVER AI"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bản Đồ Hành Động AI Cho Doanh Nghiệp - STRIVER AI",
    description: "7 ngày hành động thật • Dữ liệu thật • Kết quả thật",
    images: ["https://lh3.googleusercontent.com/pw/AP1GczNxpXiE29j2HySTgxtMQMURYCS4xmMYynU2EVlGQweuIqQQVwNnfeKiRBRM1YLxLfzGAMFgEoWZbo9lV6fPMABzontemUzPz0z4G8ubeZMd_6mu70fqhFFaiJn57FSivLAY1NoEt4Zvxmc1JKti0KILIg=w1920-h1080-s-no-gm"],
  }
};

import NavLinks from '@/components/NavLinks';
import SubNav from '@/components/SubNav';
import ScrollToTop from '@/components/ScrollToTop';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const hasSession = cookieStore.has('session')

  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-N0HJH5EFHE"></script>
        <script
          dangerouslySetInnerHTML={{
             __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-N0HJH5EFHE');
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ScrollToTop />
        <header className="nav-header">
          <nav className="nav-container">
            <Link href="/" className="nav-brand">
              <Image src="/logo.png" alt="AI ACTION MAP Logo" width={28} height={28} className="rounded-md" style={{ borderRadius: '6px' }} />
              <span className="nav-logo">AI ACTION MAP</span>
            </Link>
            <NavLinks hasSession={hasSession} />
          </nav>
        </header>
        <SubNav hasSession={hasSession} />
        <main style={{ paddingTop: 'calc(48px + 16px)', paddingBottom: '10vh', minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
