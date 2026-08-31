import BlogPostServer from '@/components/blog/BlogPostServer';
import { type BlogPost as BlogPostType, type Category } from '@/lib/blog';

interface BlogPostClientProps {
  post: BlogPostType & {
    isPortableText?: boolean;
    quickAnswer?: string;
    quickStats?: Array<{
      label: string;
      value: string;
      description?: string;
    }>;
    voiceSearchQueries?: string[];
    localSEO?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    faqs?: Array<{
      question: string;
      answer: string;
      isVoiceOptimized?: boolean;
    }>;
    ctaSettings?: {
      title?: string;
      subtitle?: string;
      buttonText?: string;
      whatsappMessage?: string;
    };
    rawContent?: string;
  };
  relatedPosts: BlogPostType[];
  adjacentPosts?: {
    previous?: {
      slug: string;
      title: string;
      excerpt: string;
      publishedDate?: string;
      category: Category;
    };
    next?: {
      slug: string;
      title: string;
      excerpt: string;
      publishedDate?: string;
      category: Category;
    };
  };
}

// This is now a server component that uses BlogPostServer for markdown processing
export default function BlogPostClient({ post, relatedPosts, adjacentPosts }: BlogPostClientProps) {
  return <BlogPostServer post={post} relatedPosts={relatedPosts} adjacentPosts={adjacentPosts} />;
}
