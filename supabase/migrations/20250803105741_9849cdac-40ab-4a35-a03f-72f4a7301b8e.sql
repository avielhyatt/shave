-- Update existing listings to be featured and add view_count column for tracking
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Make some existing listings featured
UPDATE public.listings 
SET is_featured = true 
WHERE id IN (
  SELECT id FROM public.listings 
  ORDER BY created_at DESC 
  LIMIT 3
);