import { getSortedPostsData, getAllCategories } from '@/lib/posts';

const URL = 'https://www.monopa39.org';

export async function GET() {
    const posts = getSortedPostsData();
    const categories = getAllCategories().map(cat => cat.categoryName);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${URL}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>

    ${posts
        .map(({ id, date }) => {
            return `
        <url>
            <loc>${`${URL}/posts/${id}`}</loc>
            <lastmod>${new Date(date).toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
    `;
        })
        .join('')}

    ${categories
        .map((category) => {
            return `
        <url>
            <loc>${`${URL}/category/${category}`}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.6</priority>
        </url>
    `;
        })
        .join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
