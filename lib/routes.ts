/**
 * MSSquare Routes
 * Centralized route definitions to prevent hardcoded paths and enable easy refactoring
 */

export const ROUTES = {
  // Public pages
  HOME: '/',
  ABOUT: '/about',
  PRIVACY: '/privacy',
  
  // Authentication
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  
  // Courses & Learning
  COURSES: '/courses',
  COURSE_DETAIL: (id: string) => `/courses/${id}`,
  
  // Student Portal
  STUDENT: {
    ROOT: '/student',
    DASHBOARD: '/student/dashboard',
    COURSES: '/student/courses',
    COURSE_LESSON: (courseId: string, lessonId: string) =>
      `/student/courses/${courseId}/${lessonId}`,
    EXPLORE: '/student/explore',
    AI_COACH: '/student/ai-coach',
    CERTIFICATIONS: '/student/certifications',
    PAYMENTS: '/student/payments',
    PROFILE: '/student/profile',
    PROJECTS: '/student/projects',
  },
  
  // Business Portal
  BUSINESS: {
    ROOT: '/business',
    DASHBOARD: '/business/dashboard',
    SUBMIT_REQUIREMENT: '/business/submit-requirement',
  },
  
  // Admin Dashboard
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_DETAIL: (id: string) => `/admin/users/${id}`,
    COURSES: '/admin/courses',
    COURSE_EDIT: (id: string) => `/admin/courses/${id}/edit`,
    ENROLLMENTS: '/admin/enrollments',
    CERTIFICATES: '/admin/certificates',
    PAYMENTS: '/admin/payments',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },
  
  // Content
  BLOG: {
    ROOT: '/blog',
    POST: (slug: string) => `/blog/${slug}`,
  },
  
  // Other
  CAREER: '/career',
  CAREERS: '/careers',
  PORTAL: '/portal',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  CHECKOUT_CANCEL: '/checkout/cancel',
  SUBMIT_PROJECT: '/submit-project',
  WEB_SERVICES: '/web-services',
  FAQ: '/faq',
  CONTACT: '/contact',
} as const;

// Type-safe route link helper
export const getRoute = (key: keyof typeof ROUTES): string => {
  const route = ROUTES[key];
  return typeof route === 'string' ? route : '';
};
