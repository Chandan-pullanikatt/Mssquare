import { blogsApi } from "@/lib/api/blogs";
import { notFound } from "next/navigation";
import BlogClient from "./BlogClient";
import { BlogPost, BLOG_POSTS } from "@/content/blogs/blogs";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postData = await blogsApi.getBlogBySlug(slug);

  if (!postData) {
    notFound();
  }

  // Fetch all blogs to get related posts
  const allBlogs = await blogsApi.getBlogs();
  
  const relatedBlogs = allBlogs
    .filter(b => b.category === postData.category && b.slug !== postData.slug)
    .slice(0, 3);

  const staticPost = BLOG_POSTS.find(p => p.slug === postData.slug);
  
  const mapToBlogPost = (blog: any): BlogPost => ({
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt || staticPost?.excerpt || "",
    content: blog.content || staticPost?.content || "",
    image: blog.image || staticPost?.image || "",
    category: blog.category || staticPost?.category || "Uncategorized",
    author: blog.author || staticPost?.author || "MSsquare Team",
    date: blog.date || blog.created_at,
    readTime: blog.read_time || staticPost?.readTime || 5
  });

  const post = mapToBlogPost(postData);
  const relatedPosts = relatedBlogs.map(mapToBlogPost);

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
