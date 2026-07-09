
CREATE POLICY "Anyone can upload homenagens photos"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'homenagens-fotos');

CREATE POLICY "Anyone can view homenagens photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'homenagens-fotos');
