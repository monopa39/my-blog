
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  slug: string; // Add slug for stable URLs
  originalFileName: string; // Add originalFileName
  title: string;
  date: string;
  summary: string;
  category: string;
  image?: string; // Optional image field
  contentHtml?: string;
}

export function getSortedPostsData(): PostData[] {
  console.log(`Reading posts from: ${postsDirectory}`); // Log the directory path
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    console.log(`Found files: ${fileNames.join(', ')}`); // Log the found files

    const allPostsData = fileNames
    .filter(fileName => fileName !== '.DS_Store') // Filter out .DS_Store files
    .map((fileName) => {
      const idFromFileName = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data: frontmatter } = matter(fileContents);

      // Essential fields for a post and for the RSS feed
      const requiredFields = ['title', 'date', 'summary', 'category'];
      for (const field of requiredFields) {
        if (!frontmatter[field]) {
          throw new Error(`Post "${fileName}" is missing required frontmatter field: "${field}"`);
        }
      }

      let slug = frontmatter.slug;

      if (!slug) {
        // Generate fallback slug if not provided in frontmatter
        const errorCodeMatch = idFromFileName.match(/^((0x[0-9A-Fa-f]+)|(Code-[0-9]+)|([A-Z0-9]+(?:-[A-Z0-9]+)*))/);
        if (errorCodeMatch) {
          if (errorCodeMatch[2]) {
            slug = errorCodeMatch[2];
          } else if (errorCodeMatch[3]) {
            slug = errorCodeMatch[3];
          } else if (errorCodeMatch[4]) {
            slug = errorCodeMatch[4];
          } else {
            slug = idFromFileName; // Fallback to full filename if no specific pattern matches
          }
        } else {
          slug = idFromFileName; // Fallback to full filename if no regex match
        }
        console.warn(`Warning: Post '${fileName}' is missing a 'slug' in its frontmatter. Using fallback slug: '${slug}'`);
      }

      return {
        id: slug, // Use slug as id for routing
        slug: slug, // Use slug for stable URLs
        originalFileName: fileName, // Store original filename
        title: frontmatter.title,
        date: frontmatter.date,
        summary: frontmatter.summary,
        category: frontmatter.category,
        image: frontmatter.image || null, // Extract image from frontmatter
      };
    });

  // No need for sequential ID assignment after sorting, as slugs are now stable
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  } catch (error) {
    console.error('Error reading posts directory:', error);
    throw error; // Re-throw the error to ensure it's caught by the server
  }
}

export function getAllPostIds() {
  const allPosts = getSortedPostsData();
  return allPosts.map(post => ({
    slug: post.slug,
  }));
}

export async function getPostData(slug: string): Promise<PostData> {
  const allPosts = getSortedPostsData();
  const post = allPosts.find(p => p.slug === slug);

  if (!post) {
    throw new Error(`Post with slug ${slug} not found.`);
  }

  const fullPath = path.join(postsDirectory, post.originalFileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = purify.sanitize(processedContent.toString()); // Sanitize HTML

  return {
    ...post,
    contentHtml,
  };
}

export interface CategoryData {
  categoryName: string;
  postCount: number;
}

export function getAllCategories(): CategoryData[] {
    const posts = getSortedPostsData();
    const categoryMap = new Map<string, number>();

    posts.forEach(post => {
        const count = categoryMap.get(post.category) || 0;
        categoryMap.set(post.category, count + 1);
    });

    return Array.from(categoryMap).map(([categoryName, postCount]) => ({
        categoryName,
        postCount,
    }));
}

export function getPostsByCategory(categoryName: string): PostData[] {
    const allPosts = getSortedPostsData();
    return allPosts.filter(post => post.category === categoryName);
}

export function getPaginatedPostsData(page: number, postsPerPage: number) {
  const allPosts = getSortedPostsData();
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  return {
    paginatedPosts,
    totalPages,
  };
}
