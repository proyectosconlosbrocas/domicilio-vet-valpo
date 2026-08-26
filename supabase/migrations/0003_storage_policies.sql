-- Domicilio Vet Valpo — Storage: buckets mascota-fotos y documentos, con
-- convención de path "{mascota_id}/{archivo}" para poder reusar
-- owns_mascota() también acá.

insert into storage.buckets (id, name, public)
values
  ('mascota-fotos', 'mascota-fotos', false),
  ('documentos', 'documentos', false)
on conflict (id) do nothing;

-- ── mascota-fotos ────────────────────────────────────────────────────────
create policy "staff acceso total mascota-fotos"
  on storage.objects for all
  using (bucket_id = 'mascota-fotos' and is_staff())
  with check (bucket_id = 'mascota-fotos' and is_staff());

create policy "cliente lee fotos de su mascota"
  on storage.objects for select
  using (
    bucket_id = 'mascota-fotos'
    and owns_mascota((storage.foldername(name))[1]::uuid)
  );

create policy "cliente sube fotos de su mascota"
  on storage.objects for insert
  with check (
    bucket_id = 'mascota-fotos'
    and owns_mascota((storage.foldername(name))[1]::uuid)
  );

-- ── documentos ───────────────────────────────────────────────────────────
create policy "staff acceso total documentos-bucket"
  on storage.objects for all
  using (bucket_id = 'documentos' and is_staff())
  with check (bucket_id = 'documentos' and is_staff());

create policy "cliente lee documentos de su mascota"
  on storage.objects for select
  using (
    bucket_id = 'documentos'
    and owns_mascota((storage.foldername(name))[1]::uuid)
  );
-- El cliente NO sube a "documentos" (exámenes/radiografías los sube solo
-- staff) — a diferencia de "mascota-fotos", que sí acepta subida del cliente.
