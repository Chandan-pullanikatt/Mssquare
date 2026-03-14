import {
  getBlogPostBySlug,
  getRelatedPosts,
  BLOG_POSTS,
} from "@/content/blogs/blogs";
import { notFound } from "next/navigation";
import BlogClient from "./BlogClient";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);
  const relatedPosts = getRelatedPosts(params.slug, 3);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <BlogClient 
      post={post} 
      relatedPosts={relatedPosts} 
      formattedDate={formattedDate} 
    />
  );
}
