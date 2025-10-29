import Link from 'next/link';
import { getPaginatedPostsData, PostData, getSortedPostsData } from '@/lib/posts';

const POSTS_PER_PAGE = 3;

export default function Home() {
  const { paginatedPosts, totalPages } = getPaginatedPostsData(1, POSTS_PER_PAGE);
  const totalPosts = getSortedPostsData().length;

  return (
    <section style={{ width: '100%' }}>
      <hr />
      <h2>すべての投稿 ({totalPosts})</h2>
      {paginatedPosts.map(({ id, date, title, summary, category, slug }: PostData) => (
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
      <nav className="pagination-nav">
        <ul>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={page === 1 ? 'active' : ''}>
              <Link href={page === 1 ? '/' : `/page/${page}`}>{page}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}