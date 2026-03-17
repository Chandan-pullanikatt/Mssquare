import { blogsApi } from "@/lib/api/blogs";
import { notFound } from "next/navigation";
import BlogClient from "./BlogClient";
import { BlogPost } from "@/content/blogs/blogs";

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const postData = await blogsApi.getBlogBySlug(params.slug);

  if (!postData) {
    notFound();
  }

  // Fetch all blogs to get related posts
  const allBlogs = await blogsApi.getBlogs();
  
  const relatedBlogs = allBlogs
    .filter(b => b.category === postData.category && b.slug !== postData.slug)
    .slice(0, 3);

  const mapToBlogPost = (blog: any): BlogPost => ({
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    image: blog.image || "",
    category: blog.category || "Uncategorized",
    author: blog.author || "MSsquare Team",
    date: blog.date || blog.created_at,
    readTime: blog.read_time || 5
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
