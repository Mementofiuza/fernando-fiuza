CREATE TABLE public.galeria_albuns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.galeria_albuns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_albuns TO authenticated;
GRANT ALL ON public.galeria_albuns TO service_role;

ALTER TABLE public.galeria_albuns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view albuns" ON public.galeria_albuns FOR SELECT USING (true);
CREATE POLICY "Admins can insert albuns" ON public.galeria_albuns FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update albuns" ON public.galeria_albuns FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete albuns" ON public.galeria_albuns FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_galeria_albuns_updated_at BEFORE UPDATE ON public.galeria_albuns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.galeria_imagens ADD COLUMN album_id uuid REFERENCES public.galeria_albuns(id) ON DELETE SET NULL;
CREATE INDEX idx_galeria_imagens_album ON public.galeria_imagens(album_id, ordem);