export type UserRole = 'student' | 'admin' | 'business_admin' | 'ceo';

export interface User {
  id: string;
  name: string;
  // email removed to match auth.users
  role: UserRole;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  price: number;
  instructor_id?: string;
  category: "Certification" | "Mentorship" | "Placement";
  level: "Beginner" | "Intermediate" | "Advanced";
  overview?: string;
  skills?: string[]; // Stringified array or actual array if JSONB
  outcomes?: string[];
  audience?: string;
  duration?: string;
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  module_id?: string; // Opt-in module grouping
  title: string;
  video_url: string | null;
  notes: string | null;
  order_index: number;
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  image: string | null;
  published: boolean;
  created_at: string;
}

export interface WebsiteSection {
  id: string;
  section_name: string;
  content_json: any;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  source: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string | null;
  company: string | null;
  content: string;
  image: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  issued_at: string;
  certificate_url: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Course, 'id' | 'created_at'>>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Lesson, 'id' | 'created_at'>>;
      };
      lesson_progress: {
        Row: LessonProgress;
        Insert: Omit<LessonProgress, 'id' | 'completed_at'> & { id?: string; completed_at?: string };
        Update: Partial<Omit<LessonProgress, 'id' | 'completed_at'>>;
      };
      enrollments: {
        Row: Enrollment;
        Insert: Omit<Enrollment, 'id' | 'enrolled_at'> & { id?: string; enrolled_at?: string };
        Update: Partial<Omit<Enrollment, 'id' | 'enrolled_at'>>;
      };
      blogs: {
        Row: Blog;
        Insert: Omit<Blog, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Blog, 'id' | 'created_at'>>;
      };
      website_sections: {
        Row: WebsiteSection;
        Insert: Omit<WebsiteSection, 'id' | 'updated_at'> & { id?: string; updated_at?: string };
        Update: Partial<Omit<WebsiteSection, 'id' | 'updated_at'>>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Lead, 'id' | 'created_at'>>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Testimonial, 'id' | 'created_at'>>;
      };
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<TeamMember, 'id' | 'created_at'>>;
      };
      certificates: {
        Row: Certificate;
        Insert: Omit<Certificate, 'id' | 'issued_at'> & { id?: string; issued_at?: string };
        Update: Partial<Omit<Certificate, 'id' | 'issued_at'>>;
      };
    };
  };
}
