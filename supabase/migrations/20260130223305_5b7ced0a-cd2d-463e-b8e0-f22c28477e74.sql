-- Add missing fields to parishes table
ALTER TABLE public.parishes
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS popular_name text,
ADD COLUMN IF NOT EXISTS diocese text,
ADD COLUMN IF NOT EXISTS decanato text,
ADD COLUMN IF NOT EXISTS pastor_name text,
ADD COLUMN IF NOT EXISTS vicar_name text,
ADD COLUMN IF NOT EXISTS facebook_url text,
ADD COLUMN IF NOT EXISTS youtube_url text,
ADD COLUMN IF NOT EXISTS secretary_hours text,
ADD COLUMN IF NOT EXISTS patron_saint text;

-- Add notes/observations field to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS notes text;

-- Add comments for documentation
COMMENT ON COLUMN public.parishes.email IS 'Email de contato da paróquia';
COMMENT ON COLUMN public.parishes.popular_name IS 'Nome popular da paróquia (se diferente do oficial)';
COMMENT ON COLUMN public.parishes.diocese IS 'Diocese ou Arquidiocese';
COMMENT ON COLUMN public.parishes.decanato IS 'Decanato (se houver)';
COMMENT ON COLUMN public.parishes.pastor_name IS 'Nome do pároco';
COMMENT ON COLUMN public.parishes.vicar_name IS 'Nome do vigário (se houver)';
COMMENT ON COLUMN public.parishes.facebook_url IS 'Link do Facebook';
COMMENT ON COLUMN public.parishes.youtube_url IS 'Link do YouTube';
COMMENT ON COLUMN public.parishes.secretary_hours IS 'Horário de funcionamento da secretaria';
COMMENT ON COLUMN public.parishes.patron_saint IS 'Santo padroeiro da paróquia';
COMMENT ON COLUMN public.events.notes IS 'Observações do evento (ex: Missa com crianças, Em Latim)';