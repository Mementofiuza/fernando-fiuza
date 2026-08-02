CREATE TABLE public.documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  secao text NOT NULL CHECK (secao IN ('artigos','aulas','cronicas')),
  titulo text NOT NULL,
  url text NOT NULL,
  categoria text,
  ano text,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.documentos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documentos TO authenticated;
GRANT ALL ON public.documentos TO service_role;

ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view documentos" ON public.documentos FOR SELECT USING (true);
CREATE POLICY "Admins can insert documentos" ON public.documentos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update documentos" ON public.documentos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete documentos" ON public.documentos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.galeria_imagens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  url text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.galeria_imagens TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_imagens TO authenticated;
GRANT ALL ON public.galeria_imagens TO service_role;

ALTER TABLE public.galeria_imagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view galeria" ON public.galeria_imagens FOR SELECT USING (true);
CREATE POLICY "Admins can insert galeria" ON public.galeria_imagens FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update galeria" ON public.galeria_imagens FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete galeria" ON public.galeria_imagens FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON public.documentos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_galeria_updated_at BEFORE UPDATE ON public.galeria_imagens
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();