CREATE POLICY "Admins can upload conteudo" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'conteudo' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update conteudo" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'conteudo' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'conteudo' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete conteudo" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'conteudo' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read conteudo" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'conteudo' AND public.has_role(auth.uid(), 'admin'));