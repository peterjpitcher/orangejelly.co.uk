import { type BlogPost as BlogPostType, type AdjacentPostNavItem } from '@/lib/blog';
import BlogPost from './BlogPost';
import { preprocessMarkdown } from '@/lib/markdown/preprocess';
import { renderMarkdownToHtml } from '@/lib/markdown/render';

interface BlogPostServerProps {
  post: BlogPostType & { isPortableText?: boolean };
  relatedPosts?: BlogPostType[];
  adjacentPosts?: {
    previous?: AdjacentPostNavItem;
    next?: AdjacentPostNavItem;
  };
}

/**
 * Server component wrapper for BlogPost
 * Processes markdown content server-side for better performance
 */
export default async function BlogPostServer({
  post,
  relatedPosts = [],
  adjacentPosts,
}: BlogPostServerProps) {
  let processedPost = { ...post };

  if (!post.isPortableText && typeof post.content === 'string') {
    // Preprocess to handle emoji bullets, then render to HTML
    const pre = preprocessMarkdown(post.content);
    const contentHtml = await renderMarkdownToHtml(pre);

    processedPost = {
      ...post,
      contentHtml,
      isPreProcessed: true,
    } as BlogPostType & { contentHtml: string; isPreProcessed: boolean };
  }

  return (
    <BlogPost post={processedPost} relatedPosts={relatedPosts} adjacentPosts={adjacentPosts} />
  );
}
