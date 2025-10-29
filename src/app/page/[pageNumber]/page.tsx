import Link from 'next/link';
import { getPaginatedPostsData, getSortedPostsData, PostData } from '@/lib/posts';
import { notFound } from 'next/navigation';

const POSTS_PER_PAGE = 3;

export async function generateStaticParams() {
  const allPosts = getSortedPostsData();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    pageNumber: (i + 1).toString(),
  }));

  return paths;
}

export default async function Page({ params }: { params: { pageNumber: string } }) {
  const { pageNumber } = await Promise.resolve(params);
  const currentPage = parseInt(pageNumber, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const { paginatedPosts, totalPages } = getPaginatedPostsData(currentPage, POSTS_PER_PAGE);
  const totalPosts = getSortedPostsData().length;

  if (currentPage > totalPages) {
    notFound();
  }

  return (
    <section style={{ width: '100%' }}>
      <hr />
      <h2>All Posts ({totalPosts}) (Page {currentPage})</h2>
      {paginatedPosts.map(({ id, date, title, summary, category }: PostData) => (
        <article key={id}>
          <h3>
            <Link href={`/posts/${id}`}>{title}</Link>
          </h3>
          <small>
            {date} &bull; <Link href={`/category/${category}`}>{category}</Link>
          </small>
          <p>{summary}</p>
        </article>
      ))}
      <nav className="pagination-nav">
        <ul>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={page === currentPage ? 'active' : ''}>
              <Link href={page === 1 ? '/' : `/page/${page}`}>{page}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
