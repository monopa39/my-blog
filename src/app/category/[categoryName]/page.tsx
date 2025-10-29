import { getAllCategories, getPostsByCategory, PostData } from '@/lib/posts';
import Link from 'next/link';

export function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(category => ({
    categoryName: category.categoryName,
  }));
}

export default async function CategoryPage({ params }: { params: { categoryName: string } }) {
  const { categoryName } = await Promise.resolve(params);
  const posts = getPostsByCategory(categoryName);

  return (
    <section>
      <h1>Category: {categoryName}</h1>
      <hr />
      {posts.map(({ id, date, title, summary, category, slug }: PostData) => (
        <article key={id}>
          <h3>
            <Link href={`/posts/${slug}`}>{title}</Link>
          </h3>
          <small>
            {date} &bull; <Link href={`/category/${category}`}>{category}</Link>
          </small>
          <p>{summary}</p>
        </article>
      ))}
        <br />
        <Link href="/">← Back to home</Link>
    </section>
  );
}
