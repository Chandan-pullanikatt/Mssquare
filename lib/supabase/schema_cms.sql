-- CMS Database Schema

-- 1. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    category TEXT,
    author TEXT,
    date DATE DEFAULT CURRENT_DATE,
    read_time INTEGER,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Website Sections Table (Generic for landing page content)
CREATE TABLE IF NOT EXISTS public.website_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name TEXT UNIQUE NOT NULL,
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS Policies

-- Blogs RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published blogs" 
ON public.blogs FOR SELECT 
USING (published = true);

CREATE POLICY "Allow authenticated full access to blogs" 
ON public.blogs FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('lms_admin', 'cms_admin')
    )
);

-- Website Sections RLS
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to website sections" 
ON public.website_sections FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated full access to website sections" 
ON public.website_sections FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('lms_admin', 'cms_admin')
    )
);

-- 4. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at 
BEFORE UPDATE ON public.blogs 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_website_sections_updated_at 
BEFORE UPDATE ON public.website_sections 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
