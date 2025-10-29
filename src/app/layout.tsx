import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CategoryNav from '@/components/CategoryNav';
import { getAllCategories } from '@/lib/posts';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "コード猫の開発ブログ",
  description: "様々なIT情報をお届けします",
  openGraph: {
    title: "コード猫の開発ブログ",
    description: "様々なIT情報をお届けします",
    url: "https://www.monopa39.org",
    siteName: "コード猫の開発ブログ",
    images: [
      {
        url: "https://www.monopa39.org/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "コード猫の開発ブログ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "コード猫の開発ブログ",
    description: "様々なIT情報をお届けします",
    images: ["https://www.monopa39.org/images/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getAllCategories();

  return (
    <html lang="ja">
      <head>
              
            </head>
      <body className={inter.className}>
        <main className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Link href="/">
              <h1 className="blog-title">コード猫の開発ブログ</h1>
            </Link>
            <CategoryNav categories={categories} />
          </div>
          {children}
        </main>
        <footer className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <hr />
          <p>&copy; {new Date().getFullYear()} コード猫の開発ブログ. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}