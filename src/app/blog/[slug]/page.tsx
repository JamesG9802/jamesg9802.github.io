import { get_all_posts_static } from "lib/blog-store/data";
import BlogPostClient from "./client";
import { Post } from "@jamesg9802/blog-store/dist/lib/post";

export async function generateStaticParams() {
  const posts = await get_all_posts_static();

  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await get_all_posts_static();
  const post: Post | undefined = posts.find(p => p.slug === slug);

  if (!post) {
    // Optional: notFound()
    throw new Error("Post not found.");
  }

  const { previous, next } = get_adjacent_posts(post, posts);

  return <BlogPostClient post={post} previous={previous} next={next} />;
}

/**
 * Given a post, find the adjacent posts (before and after), if they exist. 
 * @param current_post the post to check
 * @param posts the array of posts
 * @returns an object potentially containing the previous and next posts.
 */
function get_adjacent_posts(current_post: Post, posts: Post[]): { previous?: Post, next?: Post } {
  const sorted = [...posts].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const index = sorted.findIndex(
    post => post.slug === current_post.slug
  );

  return {
    previous: index > 0 ? sorted[index - 1] : undefined,
    next: index < sorted.length - 1 ? sorted[index + 1] : undefined
  };
}