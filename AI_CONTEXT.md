# MSSquare Technologies - AI Development Context

This file serves as a comprehensive reference for AI assistants developing the MSSquare platform. It documents the architecture, design system, component patterns, and development standards.

## 1. Project Overview

**Platform:** MSSquare Technologies - Technology training and services platform
**Website:** https://www.mssquaretechnologies.com
**Scope:** LMS, student portal, admin dashboard, business services, blog, course catalog

**Primary Users:**
- Students (learners)
- Corporate clients (B2B partners)
- Admins (platform management)

**Development Stack:**
- **Framework:** Next.js 16 with React 19 and TypeScript 5
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion + custom CSS keyframes
- **3D Graphics:** Three.js with React Three Fiber
- **Icons:** Lucide React
- **Fonts:** Urbanist (Google Fonts, variable)
- **Deployment:** Netlify

---

## 2. Design System

### 2.1 Color Palette

All colors are defined in `lib/design-tokens.ts` and imported from CSS variables in `app/globals.css`.

**Dark Mode (Primary Brand Theme):**
- Background: `#06070a`
- Surface: `#0d0f14`
- Card: `#111318`
- Border: `rgba(255, 255, 255, 0.07)`
- Foreground: `#f0f2f7`
- Muted: `#8892a4`

**Primary Accents:**
- Blue: `#3b82f6` (info, links)
- Cyan: `#06b6d4` (secondary)
- Green: `#10d98a` (success)
- Purple: `#7C3AED` (CTAs, highlights)

**Light Mode (Landing Page Sections):**
- Background: `#ffffff`
- Foreground: `#1f2937`
- Surface: `#f9fafb`
- Border: `rgba(0, 0, 0, 0.1)`

**Status Colors:**
- Success: `#10d98a`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#3b82f6`

### 2.2 Typography

**Font Family:** Urbanist (variable, 400-900 weights)
- Imported from Google Fonts in `app/layout.tsx`
- Applied via CSS variable: `--font-urbanist`
- Used for both body text and headings

**Font Weights:**
- Regular: 400
- Semibold: 600
- Bold: 700
- Extrabold: 800
- Black: 900

**Font Sizes:**
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px
- 5xl: 48px
- 6xl: 60px
- 7xl: 72px

**Line Heights:**
- Tight: 1.25
- Normal: 1.5
- Relaxed: 1.625
- Loose: 1.75

### 2.3 Spacing (8px Scale)

All spacing uses an 8px base scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px...

Common patterns:
- Section padding: `py-20 px-4 sm:px-6 lg:px-8`
- Container max-width: `max-w-7xl mx-auto`
- Gap between items: `gap-4`, `gap-6`, `gap-8`
- Card padding: `p-6`

### 2.4 Border Radius

- **sm:** 4px
- **md:** 8px
- **lg:** 12px
- **xl:** 16px
- **2xl:** 20px (buttons)
- **3xl:** 24px (cards)
- **full:** 9999px (pills)

### 2.5 Shadows

**Subtle Shadows:**
- sm: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- md: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- lg: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
- xl: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`

**Brand Glows:**
- Purple: `0 0 15px rgba(124, 58, 237, 0.3)`
- Blue: `0 0 15px rgba(59, 130, 246, 0.3)`
- Cyan: `0 0 15px rgba(6, 182, 212, 0.3)`
- Green: `0 0 15px rgba(16, 217, 138, 0.3)`

---

## 3. Project Structure

```
d:/mssquare/
├── app/                          # Next.js app router
│   ├── layout.tsx                # Root layout (Urbanist font import)
│   ├── globals.css               # Global styles, theme CSS variables, animations
│   │
│   ├── (landing)/                # Public landing pages
│   │   ├── layout.tsx            # Navbar + Footer layout
│   │   └── page.tsx              # Homepage with all sections
│   │
│   ├── admin/                    # Admin dashboard
│   │   ├── layout.tsx            # Sidebar + header layout
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── enrollments/
│   │   ├── payments/
│   │   ├── certificates/
│   │   ├── analytics/
│   │   └── settings/
│   │
│   ├── student/                  # Student learning portal
│   │   ├── layout.tsx            # Student layout
│   │   ├── dashboard/
│   │   ├── courses/              # Learning interface
│   │   ├── explore/
│   │   ├── ai-coach/
│   │   ├── certifications/
│   │   ├── profile/
│   │   ├── projects/
│   │   └── payments/
│   │
│   ├── business/                 # B2B portal
│   ├── auth/                     # Authentication
│   ├── blog/                     # Blog pages (TO CREATE)
│   ├── about/                    # About page (TO CREATE)
│   ├── courses/
│   ├── checkout/
│   └── api/                      # Backend API routes (TO BUILD)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Fixed header with scroll detection
│   │   └── Footer.tsx            # Multi-column footer
│   │
│   ├── sections/                 # Reusable page sections (14 total)
│   │   ├── Hero.tsx              # Full-screen hero with 3D/canvas
│   │   ├── Stats.tsx             # Stats grid with animations
│   │   ├── ProductsBuilt.tsx
│   │   ├── Solutions.tsx         # Services grid (4 columns)
│   │   ├── Programs.tsx          # Course cards (3 columns)
│   │   ├── Marquee.tsx
│   │   ├── Testimonials.tsx      # 3-column cards with star ratings
│   │   ├── CTA.tsx               # Call-to-action with email form
│   │   ├── FAQ.tsx
│   │   ├── Audience.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── TechStack.tsx
│   │   ├── Projects.tsx
│   │   ├── Services.tsx
│   │   ├── Team.tsx              # TO CREATE
│   │   ├── Timeline.tsx          # TO CREATE
│   │   └── BlogCard.tsx          # TO CREATE
│   │
│   ├── ui/
│   │   ├── Container.tsx         # Responsive wrapper
│   │   └── QuoteModal.tsx
│   │
│   ├── admin/
│   │   ├── StatsCard.tsx         # Stat card with trends
│   │   └── DataTable.tsx         # Reusable table
│   │
│   ├── courses/
│   │   └── CourseCard.tsx
│   │
│   └── backgrounds/              # SVG/image overlays
│
├── layouts/                      # Layout template components (TO CREATE)
│   ├── MainLayout.tsx            # Navbar + Footer
│   └── DashboardLayout.tsx       # Sidebar + main content
│
├── content/                      # Static content for CMS (TO CREATE)
│   ├── blogs/                    # Blog articles (JSON/MDX)
│   ├── courses/                  # Course metadata
│   ├── programs/
│   └── team/                     # Team members
│
├── hooks/
│   ├── useReveal.ts              # Scroll-triggered animations
│   └── (data fetching hooks)     # TO CREATE
│
├── lib/
│   ├── design-tokens.ts          # Design system constants
│   ├── routes.ts                 # Centralized route definitions
│   ├── utils.ts                  # cn() helper for Tailwind merging
│   └── (API utilities)           # TO CREATE
│
├── types/
│   ├── models.ts                 # Data model interfaces (TO CREATE)
│   └── api.ts                    # API request/response types (TO CREATE)
│
├── public/
│   └── assets/
│
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── package.json
├── netlify.toml
└── AI_CONTEXT.md                 # This file
```

---

## 4. Component Architecture & Patterns

### 4.1 Component Naming & Organization

- **Layout Components:** `Navbar.tsx`, `Footer.tsx`, `MainLayout.tsx`
- **Section Components:** `Hero.tsx`, `Stats.tsx`, `Programs.tsx` (reusable page blocks)
- **UI Components:** `Button.tsx`, `Card.tsx`, `Input.tsx` (atomic)
- **Feature Components:** `CourseCard.tsx`, `StatsCard.tsx` (domain-specific)
- **Admin Components:** Dashboard-specific functionality

### 4.2 Component Patterns

All components should follow these conventions:

```typescript
'use client'; // For interactive components

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { COLORS, SPACING } from '@/lib/design-tokens';

interface ComponentProps {
  children?: ReactNode;
  className?: string;
  // domain-specific props
}

export function Component({ children, className }: ComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  );
}
```

**Guidelines:**
- Use `'use client'` for interactivity
- Import `cn()` from `lib/utils` for class merging
- Use design tokens for colors/spacing (avoid hardcoding)
- Spread className for customization
- Document props with TypeScript interfaces
- Use Framer Motion for complex animations

### 4.3 Animation Patterns

**Scroll-Based Reveals:**
```typescript
import { useReveal } from '@/hooks/useReveal';

export function Section() {
  useReveal();
  
  return (
    <div className="rev rev-d1">
      Content fades in on scroll
    </div>
  );
}
```

**Available reveal classes:**
- `.rev` - Base reveal (fade-up 28px)
- `.rev-d1` through `.rev-d4` - Staggered delays (8ms increments)

**CSS Keyframe Animations:**
- `anim-fup` - Fade + translate up (0.75s)
- `anim-wrise` - Word rise (0.6s)
- `anim-accentin` - Accent line fade (0.7s)
- `anim-gradflow` - Gradient flow (5s, infinite)
- `anim-blink` - Pulsing dot (1.8s, infinite)
- `anim-sdown` - Scroll indicator (1.9s, infinite)

**Framer Motion:**
- Use for complex sequences, stagger effects, gesture-based interactions
- Keep animation durations 300-700ms for snappy feel

### 4.4 Styling Approach

**Use Tailwind CSS with design tokens:**

```typescript
// ❌ AVOID (hardcoded colors)
<div className="bg-[#7C3AED] text-[#f0f2f7]">

// ✅ GOOD (semantic tokens)
<div className="bg-primary-purple text-foreground">

// OR for custom values
<div style={{
  backgroundColor: COLORS.primary.purple,
  color: COLORS.foreground,
}}>
```

**Component responsiveness:**
- Mobile-first: base classes for mobile, `sm:`, `md:`, `lg:` for larger screens
- Utilities: `flex`, `grid`, `gap-*`, `rounded-*`, `shadow-*`, `transition-*`
- No inline styles unless absolutely necessary

---

## 5. Routing & Navigation

**Route Management:**

All routes are defined in `lib/routes.ts` for type safety and easy refactoring. Import and use these constants instead of hardcoding paths.

```typescript
import { ROUTES } from '@/lib/routes';

// ✅ GOOD
<Link href={ROUTES.STUDENT.DASHBOARD}>Dashboard</Link>
<Link href={ROUTES.COURSE_DETAIL('123')}>Course</Link>

// ❌ AVOID
<Link href="/student/dashboard">Dashboard</Link>
```

**Route Structure:**

| Path | Purpose | Layout | Status |
|------|---------|--------|--------|
| `/` | Homepage | Landing | ✅ |
| `/about` | About company | Landing | 🔲 |
| `/blog` | Blog listing | Landing | 🔲 |
| `/blog/[slug]` | Blog post detail | Landing | 🔲 |
| `/courses` | Course catalog | Landing | ✅ |
| `/auth` | Login/signup | - | 🔲 |
| `/student/*` | Student portal | Student | 🔲 |
| `/business/*` | B2B portal | Business | 🔲 |
| `/admin/*` | Admin dashboard | Admin | 🔲 |
| `/checkout` | Payment flow | - | 🔲 |

Legend: ✅ Implemented | 🔲 Planned/Stub

---

## 6. Data Models (Planned)

These TypeScript interfaces should be defined in `types/models.ts`:

```typescript
// Authentication
interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'corporate' | 'admin';
  profileImage?: string;
  createdAt: Date;
}

// Courses
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  duration: number; // minutes
  thumbnail?: string;
  createdAt: Date;
}

// Student Progress
interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completionPercent: number;
  status: 'active' | 'completed' | 'paused';
}

// Payments
interface Payment {
  id: string;
  userId: string;
  amount: number;
  courseId?: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  createdAt: Date;
}

// Certificates
interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  certificateUrl: string;
}

// Blog
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  publishedAt: Date;
}
```

---

## 7. API Structure (Planned)

API routes follow Next.js app router conventions in `/app/api/`:

**Authentication:**
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

**Courses:**
- `GET /api/courses` - List courses
- `GET /api/courses/[id]` - Get course details
- `POST /api/courses` - Create (admin)
- `PUT /api/courses/[id]` - Update (admin)

**Enrollments:**
- `GET /api/enrollments` - List user's enrollments
- `POST /api/enrollments` - Create enrollment
- `PUT /api/enrollments/[id]` - Update progress

**Payments:**
- `POST /api/payments/create-checkout-session` - Start Stripe checkout
- `GET /api/payments/[id]` - Get payment details
- `POST /api/webhooks/stripe` - Stripe webhook handler

**Users:**
- `GET /api/users/me` - Current user
- `GET /api/users/[id]` - User profile
- `PUT /api/users/[id]` - Update profile
- `GET /api/users` - List users (admin)

---

## 8. Development Guidelines

### 8.1 When Creating New Pages

1. **Respect existing patterns:**
   - Use layout components (Navbar, Footer, Sidebar)
   - Reuse section components from `components/sections/`
   - Apply design tokens (no hardcoded colors/spacing)

2. **Page template:**
```typescript
// app/new-page/page.tsx
import { Hero } from '@/components/sections/Hero';
import { CTA } from '@/components/sections/CTA';

export default function NewPage() {
  return (
    <main>
      <Hero title="Page Title" subtitle="Subtitle" />
      {/* Add sections */}
      <CTA />
    </main>
  );
}
```

3. **Ensure responsive design:**
   - Test on mobile (375px), tablet (768px), desktop (1280px)
   - Use mobile-first Tailwind classes

### 8.2 When Modifying Existing Components

1. **Never break consistency:**
   - Preserve design tokens, spacing, typography
   - Test across all pages using the component
   - Maintain all existing props

2. **Improve code quality:**
   - Add TypeScript types
   - Reduce unnecessary re-renders
   - Improve accessibility

### 8.3 When Adding New Colors/Spacing

1. **Add to `lib/design-tokens.ts` first**
2. **Update `tailwind.config.ts` theme**
3. **Reference in components using tokens**
4. **Never hardcode new values in components**

### 8.4 Performance Considerations

- **Images:** Use Next.js `Image` component (automatic optimization)
- **Animations:** Test on low-end devices, add `prefers-reduced-motion` wrapper
- **Code splitting:** Components auto-split at route level
- **Bundle size:** Avoid heavy dependencies without justification

### 8.5 Accessibility (a11y)

- **Semantic HTML:** Use `<button>`, `<nav>`, `<main>`, etc.
- **ARIA labels:** Add for interactive elements without text
- **Color contrast:** Verify readability (WCAG AA minimum)
- **Keyboard navigation:** All controls must be keyboard-accessible
- **Reduced motion:** Respect `prefers-reduced-motion` media query

---

## 9. Common Development Tasks

### 9.1 Add a New Route

1. Create folder in `app/` matching route path
2. Add `page.tsx` (or `layout.tsx` for layout routes)
3. Add route to `lib/routes.ts`
4. Import reusable components + design tokens

### 9.2 Add a New Section Component

1. Create `components/sections/NewSection.tsx`
2. Use `'use client'` if interactive
3. Use design tokens (COLORS, SPACING, TYPOGRAPHY)
4. Add `useReveal()` hook for scroll animations
5. Export and use across pages

### 9.3 Style a New Component

1. Use Tailwind utility classes (mobile-first)
2. Reference `lib/design-tokens.ts` for colors/spacing
3. Use `cn()` helper to merge dynamic classes:
```typescript
import { cn } from '@/lib/utils';

className={cn('base px-4 py-2', variant === 'large' && 'px-8 py-4')}
```

### 9.4 Fetch Data from API

1. Create hook in `hooks/useData.ts`:
```typescript
'use client';
import { useState, useEffect } from 'react';

export function useData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);
  
  return { data, loading };
}
```

2. Use in component:
```typescript
const { data, loading } = useData();
```

---

## 10. File Naming Conventions

- **Components:** PascalCase (`Hero.tsx`, `StatsCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useReveal.ts`, `useFetch.ts`)
- **Utilities:** camelCase (`utils.ts`, `validators.ts`)
- **Types:** PascalCase (`models.ts`, `api.ts`)
- **Constants:** UPPER_SNAKE_CASE in files (exported)
- **Folders:** kebab-case (`admin`, `student`, `web-services`)

---

## 11. Key Files & Imports

**Design System:**
```typescript
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, Z_INDEX, ANIMATIONS } from '@/lib/design-tokens';
```

**Routing:**
```typescript
import { ROUTES } from '@/lib/routes';
```

**Utilities:**
```typescript
import { cn } from '@/lib/utils';
```

**Hooks:**
```typescript
import { useReveal } from '@/hooks/useReveal';
```

---

## 12. Dependencies

- **Framework:** Next.js 16.1.6 | React 19.2.3 | TypeScript 5
- **Styling:** Tailwind CSS 4 | Tailwind Typography 0.5.19 | PostCSS 4
- **Animations:** Framer Motion 12.35.0
- **3D Graphics:** Three.js 0.183.2 | React Three Fiber 9.5.0 | Drei 10.7.7
- **Icons:** Lucide React 0.577.0
- **Utilities:** clsx 2.1.1 | tailwind-merge 3.5.0
- **Deployment:** Netlify (@netlify/plugin-nextjs 5.15.8)

---

## 13. Known Issues & Future Work

**Current Design Inconsistencies:**
- Landing page theme switches between light and dark (should be unified in Phase 2)
- Some hardcoded colors exist pending token migration (Phase 2)
- Admin dashboard uses separate theme (light + purple) - needs alignment (Phase 2)

**Future Phases:**
1. ✅ Phase 1: Design Tokens & Architecture
2. 🔲 Phase 2: Fix UI Inconsistencies
3. 🔲 Phase 3: Build Blog & About pages
4. 🔲 Phase 4: Navigation & routing fixes
5. 🔲 Phase 5: Database schema design
6. 🔲 Phase 6: Backend API integration
7. 🔲 Phase 7: Stripe payment integration
8. 🔲 Phase 8: LMS content delivery

---

Last updated: March 13, 2026
AI Context version: 1.0
