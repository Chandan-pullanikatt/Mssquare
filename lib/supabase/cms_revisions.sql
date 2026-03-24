-- CMS Revision Tracking

CREATE TABLE IF NOT EXISTS public.revision_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_content JSONB,
    new_content JSONB,
    changed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_revision_history_record ON public.revision_history(table_name, record_id);

-- Optional: Add revision_history field to courses for quick in-record history
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS revision_history JSONB DEFAULT '[]'::jsonb;
