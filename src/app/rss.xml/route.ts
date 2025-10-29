import { getSortedPostsData } from '@/lib/posts';
import RSS from 'rss';

const URL = 'https://www.monopa39.org';

export async function GET() {
    const posts = getSortedPostsData();

    const feed = new RSS({
        title: '컴냥이의 개발 블로그',
        description: '각종 IT정보 알려드립니다',
        feed_url: `${URL}/rss.xml`,
        site_url: URL,
        language: 'ja',
    });

    posts.forEach(post => {
        feed.item({
            title: post.title,
            description: post.summary,
            url: `${URL}/posts/${post.id}`,
            date: post.date,
            categories: [post.category],
        });
    });

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
