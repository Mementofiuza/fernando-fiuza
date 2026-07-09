
DROP POLICY IF EXISTS "Anyone can view homenagens photos" ON storage.objects;

CREATE POLICY "Anyone can view approved homenagens photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'homenagens-fotos'
    AND EXISTS (
      SELECT 1 FROM public.homenagens h
      WHERE h.foto_url = storage.objects.name
        AND h.aprovado = true
    )
  );
