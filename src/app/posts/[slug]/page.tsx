import { getPostData, getAllPostIds, PostData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

// Define a base URL for the canonical URL and schema markup
const BASE_URL = 'https://www.monopa39.org';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  let post: PostData;
  try {
    post = await getPostData(slug);
  } catch (e) {
    // If post not found, return a generic metadata or re-throw to let notFound() handle it
    return {
      title: "投稿が見つかりません",
      description: "要求されたブログ投稿が見つかりませんでした。",
    };
  }

  const imageUrl = post.image ? `${BASE_URL}${post.image}` : `${BASE_URL}/images/og-image.jpg`;

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${BASE_URL}/posts/${post.id}`,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: ['コード猫'],
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${BASE_URL}/posts/${post.id}`,
    },
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(params);
  let post: PostData;
  try {
    post = await getPostData(slug);
  } catch (e) {
    notFound();
  }

  const imageUrl = post.image ? `${BASE_URL}${post.image}` : `${BASE_URL}/images/og-image.jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    image: imageUrl,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: 'コード猫',
    },
    publisher: {
      '@type': 'Organization',
      name: 'コード猫の開発ブログ',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/posts/${post.id}`,
    },
  };

  return (
    <article className="post-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>{post.title}</h1>
      <p>
        {post.date} &bull; <Link href={`/category/${post.category}`}>{post.category}</Link>
      </p>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }} />
      <br />
      <Link href="/">← ホームに戻る</Link>
    </article>
  );
}