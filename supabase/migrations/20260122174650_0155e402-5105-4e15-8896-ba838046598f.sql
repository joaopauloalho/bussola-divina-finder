-- Add new columns to parishes table
ALTER TABLE public.parishes
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS instagram_username TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Create pastorals table
CREATE TABLE public.pastorals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  leader_name TEXT,
  whatsapp TEXT,
  email TEXT,
  icon TEXT DEFAULT 'users',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pastoral_schedules table
CREATE TABLE public.pastoral_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pastoral_id UUID NOT NULL REFERENCES public.pastorals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME WITHOUT TIME ZONE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parish_images table for photo gallery
CREATE TABLE public.parish_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.pastorals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastoral_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for pastorals (public read)
CREATE POLICY "Pastorals are viewable by everyone"
ON public.pastorals
FOR SELECT
USING (true);

-- RLS policies for pastoral_schedules (public read)
CREATE POLICY "Pastoral schedules are viewable by everyone"
ON public.pastoral_schedules
FOR SELECT
USING (true);

-- RLS policies for parish_images (public read)
CREATE POLICY "Parish images are viewable by everyone"
ON public.parish_images
FOR SELECT
USING (true);

-- Create trigger for updated_at on pastorals
CREATE TRIGGER update_pastorals_updated_at
BEFORE UPDATE ON public.pastorals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();