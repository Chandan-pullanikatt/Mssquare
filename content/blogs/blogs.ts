/**
 * Blog Data Structure
 * Contains all blog posts with metadata
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "mssquare-match-day",
    title: "MSSquare Match Day: Team Spirit & Victory",
    excerpt: "Highlights from our annual sports day where competition meets camaraderie. See how our teams battled it out for the trophy.",
    content: `
# MSSquare Match Day: Team Spirit & Victory

Highlights from our annual sports day where competition meets camaraderie. See how our teams battled it out for the trophy.

At MSsquare, we believe that the strength of our organization lies in the dedication, creativity, and passion of our talented team members. Every individual brings their unique skills and perspective to the table, contributing to our collective success.

Our team members go above and beyond in their roles, demonstrating exceptional commitment to excellence. From developers to designers, from consultants to managers, each person plays a vital role in making MSsquare the dynamic organization it is today.

The collaboration and camaraderie within our team is what sets us apart. We celebrate every achievement together, support each other through challenges, and continuously strive to push the boundaries of what's possible in technology and learning.

This is what makes MSsquare truly special—not just our projects, but the incredible people who make them happen.
    `,
    image: "/assets/blog/matchdayblog.png",
    category: "Entertainment",
    author: "Admin Team",
    date: "2023-10-12",
    readTime: 4,
  },
  {
    id: "2",
    slug: "quarterly-town-hall",
    title: "Quarterly Town Hall: Road to 2024",
    excerpt: "Discussing the future roadmap, technical breakthroughs, and our vision for the upcoming fiscal year.",
    content: `
# Quarterly Town Hall: Road to 2024

Discussing the future roadmap, technical breakthroughs, and our vision for the upcoming fiscal year.

Our recent town hall meeting was a wonderful opportunity to reconnect as a team and celebrate our collective progress. We shared updates on our ongoing initiatives, discussed future direction, and celebrated notable achievements from across the organization.

During the meeting, team members from different departments shared insights about their work and the challenges they've overcome. These stories of resilience and problem-solving inspire us all to strive for excellence in our respective roles.

The town hall also provided a platform for open dialogue, where team members could ask questions and provide feedback. This transparent communication is essential for building trust and ensuring that everyone feels heard and valued.

As we move forward, we're energized by the milestones we've achieved together and excited about the opportunities that lie ahead. Every challenge we overcome only makes us stronger as an organization.
    `,
    image: "/assets/blog/townhall.png",
    category: "News",
    author: "Admin Team",
    date: "2023-10-10",
    readTime: 5,
  },
  {
    id: "3",
    slug: "celebrating-our-winners",
    title: "Celebrating Our Winners",
    excerpt: "Honoring the exceptional talent and hard work that drives MSSquare forward. Meet our quarterly award recipients.",
    content: `
# Celebrating Our Winners

Honoring the exceptional talent and hard work that drives MSSquare forward. Meet our quarterly award recipients.

In today's fast-paced world, facing setbacks and obstacles is inevitable. What separates winners from the rest is their mindset and approach to these challenges. Instead of viewing failures as endpoints, winners see them as valuable learning opportunities.

At MSsquare, we celebrate not just the victories, but more importantly, the journey and growth that comes from overcoming obstacles. Our team members demonstrate this winning spirit every day by:

- Embracing challenges with a positive attitude
- Learning from mistakes and failures
- Collaborating with teammates to find solutions
- Continuously improving and adapting
- Supporting each other through difficult times

The winners we see today are those who have faced adversity head-on and emerged stronger. They understand that excellence is not a destination but a continuous journey of growth and improvement.

By fostering a culture that values resilience and continuous learning, we nurture a team of true winners—individuals who are not just successful but are committed to making a positive impact in everything they do.
    `,
    image: "/assets/blog/winners.png",
    category: "Culture",
    author: "Admin Team",
    date: "2023-10-05",
    readTime: 4,
  },
  {
    id: "4",
    slug: "visionary-leadership-sai-santosh",
    title: "Visionary Leadership: Sai Santosh",
    excerpt: "A deep dive into the philosophy and journey of our founder and CEO in shaping the future of technology.",
    content: `
# Visionary Leadership: Sai Santosh

A deep dive into the philosophy and journey of our founder and CEO in shaping the future of technology. Mr. Pagidipalli Sai Santosh is the founder and CEO of MSsquare Technologies, a dynamic entrepreneur and business leader known for his dedication and strong leadership.

With a deep passion for technology and education, Santosh founded MSSquare with a clear mission: to bridge the gap between industry demands and educational institutions, while empowering individuals with the skills needed to thrive in the modern tech landscape.

## Vision and Mission

Under Santosh's leadership, MSSquare has grown from a startup to a recognized platform that collaborates with colleges, mentors aspiring professionals, and builds innovative solutions. His entrepreneurial journey is marked by:

- A relentless focus on quality and excellence
- A commitment to empowering the next generation of tech professionals
- An innovative approach to combining learning with real-world project experience
- A vision to create meaningful impact through technology

## Leadership Philosophy

Santosh believes in leading by example and fostering a culture of innovation, collaboration, and continuous learning. He champions the development of his team members and creates an environment where creativity and excellence are valued.

His leadership has earned MSSquare recognition as a forward-thinking organization in the ed-tech and technology services space, and his vision continues to guide the company's growth and evolution.
    `,
    image: "/assets/blog/ceo.png",
    category: "Founder",
    author: "Admin Team",
    date: "2023-09-28",
    readTime: 5,
  },
  {
    id: "5",
    slug: "meet-hyderabad-hub-team",
    title: "Meet the Hyderabad Hub Team",
    excerpt: "The brilliant minds behind our operations in Hyderabad. Discover what makes our local culture so unique and energetic.",
    content: `
# Meet the Hyderabad Hub Team

The brilliant minds behind our operations in Hyderabad. Discover what makes our local culture so unique and energetic. Our Hyderabad office represents the very best of what we do: diverse talent, unwavering commitment, and a shared passion for excellence.

Education is the foundation of progress, and at MSSquare, we're committed to transforming how students prepare for their careers. Through strategic partnerships with leading educational institutions, we've created pathways for students to gain real-world experience while still in college.

## Partnership Benefits

Our college collaboration programs offer comprehensive benefits:

### For Students
- Industry-relevant skill development
- Hands-on project experience
- Mentorship from experienced professionals
- Career guidance and placement opportunities
- Access to real-world projects and case studies

### For Colleges
- Curriculum enhancement with industry insights
- Guest lectures and workshops from tech professionals
- Student project opportunities with real clients
- Career support for graduates
- Partnership in innovation and research

## Making an Impact

Through our collaborations, we've successfully helped hundreds of students transition from academic learning to professional practice. Our mentorship programs have guided students through internships, provided career counseling, and opened doors to opportunities they might not have found otherwise.

The feedback from students and institutions has been overwhelmingly positive, with many noting how the practical experience and mentorship transformed their career trajectories.

As we continue to expand our college partnerships, we remain focused on bridging the gap between education and industry, ensuring that every student has the tools and support needed to succeed in their chosen field.
    `,
    image: "/assets/blog/hyd-team.png",
    category: "Tech",
    author: "Admin Team",
    date: "2023-09-20",
    readTime: 4,
  },
  {
    id: "6",
    slug: "hyderabad-our-vibrant-home",
    title: "Hyderabad: Our Vibrant Home",
    excerpt: "Exploring the fusion of tradition and technology in the city that hosts our main development hub.",
    content: `
# Hyderabad: Our Vibrant Home

Exploring the fusion of tradition and technology in the city that hosts our main development hub. MSsquare Technologies started with a dream and a lot of determination. Today we have a growing family of talented individuals working together in this vibrant city.

Our Hyderabad office is the heart of MSSquare's operations. It's where the magic happens—where ideas are born, projects come to life, and innovations are created. The team here represents the very best of what we do: diverse talent, unwavering commitment, and a shared passion for excellence.

## Our Journey

What started as a small team with big dreams has evolved into a diverse group of skilled professionals. Each team member brings their unique expertise and perspective, contributing to the rich tapestry of talent that defines MSSquare's Hyderabad office.

## Team Culture

Our Hyderabad team thrives on:

- **Collaboration**: We believe in the power of working together and leveraging collective intelligence
- **Innovation**: We encourage creative thinking and are always looking for better ways to solve problems
- **Growth**: We invest in our team members' professional development and career growth
- **Impact**: Every project we undertake is aimed at making a meaningful difference for our clients and students

## Looking Forward

As we continue to grow, our Hyderabad team remains committed to maintaining the values and culture that make MSSquare special. We're excited about the future and the opportunities ahead as we expand our team and take on bigger challenges.

The strength of our organization lies in our people, and we're proud of the incredible team we've built in Hyderabad.
    `,
    image: "/assets/blog/hyd.png",
    category: "Community",
    author: "Admin Team",
    date: "2023-09-01",
    readTime: 5,
  },
];

/**
 * Get blog posts with pagination
 */
export function getBlogPosts(page: number = 1, postsPerPage: number = 6) {
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = BLOG_POSTS.slice(startIndex, endIndex);
  const totalPosts = BLOG_POSTS.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return {
    posts,
    currentPage: page,
    totalPages,
    totalPosts,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Get blog post by slug
 */
export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/**
 * Get related blog posts
 */
export function getRelatedPosts(slug: string, limit: number = 3) {
  const currentPost = getBlogPostBySlug(slug);
  if (!currentPost) return [];

  return BLOG_POSTS.filter(
    (post) => post.category === currentPost.category && post.slug !== slug
  ).slice(0, limit);
}

/**
 * Search blog posts
 */
export function searchBlogPosts(query: string) {
  const lowerQuery = query.toLowerCase();
  return BLOG_POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string) {
  return BLOG_POSTS.filter((post) => post.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories() {
  const categories = new Set(BLOG_POSTS.map((post) => post.category));
  return Array.from(categories);
}

/**
 * Get recent posts
 */
export function getRecentPosts(limit: number = 5) {
  return BLOG_POSTS.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, limit);
}
