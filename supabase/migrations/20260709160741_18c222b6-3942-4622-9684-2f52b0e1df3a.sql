
CREATE TABLE public.homenagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT,
  mensagem TEXT NOT NULL,
  foto_url TEXT,
  aprovado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT mensagem_length CHECK (char_length(mensagem) > 0 AND char_length(mensagem) <= 500),
  CONSTRAINT nome_length CHECK (nome IS NULL OR char_length(nome) <= 100)
);

GRANT SELECT, INSERT ON public.homenagens TO anon;
GRANT SELECT, INSERT ON public.homenagens TO authenticated;
GRANT ALL ON public.homenagens TO service_role;

ALTER TABLE public.homenagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved homenagens"
  ON public.homenagens FOR SELECT
  USING (aprovado = true);

CREATE POLICY "Anyone can submit a homenagem"
  ON public.homenagens FOR INSERT
  WITH CHECK (aprovado = false);

CREATE INDEX idx_homenagens_aprovado_created ON public.homenagens (aprovado, created_at DESC);
