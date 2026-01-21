-- Create enum for event types
CREATE TYPE public.event_type AS ENUM ('Missa', 'Confissão', 'Adoração', 'Terço');

-- Create parishes table
CREATE TABLE public.parishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  phone TEXT,
  instagram_url TEXT,
  pix_key TEXT,
  is_official BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  type public.event_type NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time TIME NOT NULL,
  verification_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create validations table (for thumbs up/down votes)
CREATE TABLE public.validations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_identifier)
);

-- Create suggestions table (for time corrections and parish corrections)
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  parish_id UUID REFERENCES public.parishes(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('time_correction', 'address_correction', 'phone_correction', 'other')),
  suggested_value TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.parishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Public read access for parishes and events (public data)
CREATE POLICY "Parishes are viewable by everyone" 
ON public.parishes 
FOR SELECT 
USING (true);

CREATE POLICY "Events are viewable by everyone" 
ON public.events 
FOR SELECT 
USING (true);

-- Anyone can vote (insert validation)
CREATE POLICY "Anyone can vote on events" 
ON public.validations 
FOR INSERT 
WITH CHECK (true);

-- Validations are viewable by everyone
CREATE POLICY "Validations are viewable by everyone" 
ON public.validations 
FOR SELECT 
USING (true);

-- Anyone can submit suggestions
CREATE POLICY "Anyone can submit suggestions" 
ON public.suggestions 
FOR INSERT 
WITH CHECK (true);

-- Suggestions are viewable by everyone
CREATE POLICY "Suggestions are viewable by everyone" 
ON public.suggestions 
FOR SELECT 
USING (true);

-- Create function to update verification_score
CREATE OR REPLACE FUNCTION public.update_verification_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vote_type = 'up' THEN
    UPDATE public.events SET verification_score = verification_score + 1 WHERE id = NEW.event_id;
  ELSIF NEW.vote_type = 'down' THEN
    UPDATE public.events SET verification_score = verification_score - 1 WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for vote updates
CREATE TRIGGER on_validation_insert
AFTER INSERT ON public.validations
FOR EACH ROW
EXECUTE FUNCTION public.update_verification_score();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_parishes_updated_at
BEFORE UPDATE ON public.parishes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for parishes
INSERT INTO public.parishes (name, address, lat, lng, phone, pix_key, is_official, image_url) VALUES
('Paróquia Sagrados Corações', 'Av. Higienópolis, 1234', -23.3045, -51.1696, '(43) 3323-1234', '00.000.000/0001-01', true, NULL),
('Igreja São José Operário', 'Rua Pará, 567', -23.3101, -51.1650, '(43) 3322-5678', '00.000.000/0001-02', false, NULL),
('Catedral Metropolitana', 'Praça Rocha Pombo, 10', -23.3100, -51.1628, '(43) 3321-0010', '00.000.000/0001-03', true, NULL),
('Paróquia Nossa Senhora Aparecida', 'Rua Santos Dumont, 890', -23.3200, -51.1700, '(43) 3324-8900', '00.000.000/0001-04', true, NULL),
('Capela São Francisco', 'Av. JK, 456', -23.2950, -51.1550, NULL, NULL, false, NULL),
('Paróquia Sagrado Coração de Jesus', 'Rua Sergipe, 234', -23.3150, -51.1680, '(43) 3325-2340', '00.000.000/0001-06', false, NULL),
('Igreja Santa Terezinha', 'Av. Madre Leônia, 789', -23.3080, -51.1720, '(43) 3326-7890', '00.000.000/0001-07', true, NULL),
('Santuário do Pequeno Cotolengo', 'Estrada do Limoeiro, km 3', -23.2800, -51.1400, '(43) 3327-0003', '00.000.000/0001-08', true, NULL);

-- Insert sample events
INSERT INTO public.events (parish_id, type, day_of_week, time, verification_score) VALUES
((SELECT id FROM public.parishes WHERE name = 'Paróquia Sagrados Corações'), 'Missa', 0, '07:00', 15),
((SELECT id FROM public.parishes WHERE name = 'Igreja São José Operário'), 'Confissão', 0, '08:30', 8),
((SELECT id FROM public.parishes WHERE name = 'Catedral Metropolitana'), 'Missa', 0, '10:00', 42),
((SELECT id FROM public.parishes WHERE name = 'Paróquia Nossa Senhora Aparecida'), 'Adoração', 0, '15:00', 12),
((SELECT id FROM public.parishes WHERE name = 'Capela São Francisco'), 'Terço', 0, '17:30', 3),
((SELECT id FROM public.parishes WHERE name = 'Paróquia Sagrado Coração de Jesus'), 'Missa', 0, '19:00', 20),
((SELECT id FROM public.parishes WHERE name = 'Igreja Santa Terezinha'), 'Confissão', 0, '20:00', 18),
((SELECT id FROM public.parishes WHERE name = 'Santuário do Pequeno Cotolengo'), 'Adoração', 0, '21:00', 25);