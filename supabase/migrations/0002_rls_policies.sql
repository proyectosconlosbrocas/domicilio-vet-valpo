-- Domicilio Vet Valpo — RLS: staff (acceso total) vs. cliente (dueño de sus
-- propios datos, solo lectura del historial clínico de sus mascotas).

-- ── Funciones helper ─────────────────────────────────────────────────────
-- SECURITY DEFINER + search_path fijo explícitamente: sin esto, un rol con
-- CREATE en algún schema que aparezca antes en el search_path del llamador
-- podría "sombrear" la tabla staff/mascotas y hacer que la función devuelva
-- lo que quiera (patrón que el Supabase Advisor marca como
-- function_search_path_mutable).

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.staff where id = auth.uid() and activo = true
  );
$$;
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

create or replace function public.owns_mascota(p_mascota_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.mascotas m
    join public.clientes c on c.id = m.cliente_id
    where m.id = p_mascota_id and c.auth_user_id = auth.uid()
  );
$$;
revoke all on function public.owns_mascota(uuid) from public;
grant execute on function public.owns_mascota(uuid) to authenticated;

-- ── STAFF ────────────────────────────────────────────────────────────────
alter table staff enable row level security;

create policy "staff lee su propia fila"
  on staff for select
  using (id = auth.uid());
-- sin insert/update/delete para authenticated: el alta de staff se hace por
-- SQL editor con service_role (bypassa RLS), consistente con "una sola
-- profesional, sin más staff por ahora".

-- ── CLIENTES ─────────────────────────────────────────────────────────────
alter table clientes enable row level security;

create policy "staff acceso total clientes"
  on clientes for all
  using (is_staff())
  with check (is_staff());

create policy "cliente lee su propia fila"
  on clientes for select
  using (auth_user_id = auth.uid());

create policy "cliente actualiza su propia fila"
  on clientes for update
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

create policy "cliente crea su propia fila"
  on clientes for insert
  with check (auth_user_id = auth.uid());

-- Defensa en profundidad: aunque el USING/WITH CHECK de arriba ya impide
-- que un cliente cambie su propio auth_user_id (la fila post-update dejaría
-- de cumplir la condición), se restringe también a nivel de columna para
-- que ni un bug de UI pueda tocar id/auth_user_id/activo/created_at.
revoke update on clientes from authenticated;
grant update (
  nombre, rut, telefono, telefono_alternativo, email, direccion,
  contacto_emergencia_nombre, contacto_emergencia_telefono,
  consentimiento_datos_aceptado, consentimiento_fecha
) on clientes to authenticated;

-- ── MASCOTAS ─────────────────────────────────────────────────────────────
alter table mascotas enable row level security;

create policy "staff acceso total mascotas"
  on mascotas for all
  using (is_staff())
  with check (is_staff());

create policy "cliente lee mascotas propias"
  on mascotas for select
  using (
    exists (
      select 1 from clientes c
      where c.id = mascotas.cliente_id and c.auth_user_id = auth.uid()
    )
  );

create policy "cliente crea mascotas propias"
  on mascotas for insert
  with check (
    exists (
      select 1 from clientes c
      where c.id = mascotas.cliente_id and c.auth_user_id = auth.uid()
    )
  );
-- Deliberadamente SIN policy de UPDATE/DELETE para el cliente: la ficha de
-- mascota es solo lectura para el cliente. Si sube una foto, entra como fila
-- en documentos (tipo 'foto') — nunca escribe mascotas.foto_url directamente,
-- eso lo decide la Dra. Claudia desde la app de staff.

-- ── VISITAS / VACUNAS / DESPARASITACIONES / DOCUMENTOS ──────────────────
-- Mismo patrón en las 4: staff acceso total, cliente solo lectura vía
-- owns_mascota(). Sin policies de insert/update/delete para el cliente =
-- denegado por defecto (RLS es deny-by-default por comando).

alter table visitas enable row level security;
create policy "staff acceso total visitas" on visitas
  for all using (is_staff()) with check (is_staff());
create policy "cliente lee visitas de su mascota" on visitas
  for select using (owns_mascota(mascota_id));

alter table vacunas enable row level security;
create policy "staff acceso total vacunas" on vacunas
  for all using (is_staff()) with check (is_staff());
create policy "cliente lee vacunas de su mascota" on vacunas
  for select using (owns_mascota(mascota_id));

alter table desparasitaciones enable row level security;
create policy "staff acceso total desparasitaciones" on desparasitaciones
  for all using (is_staff()) with check (is_staff());
create policy "cliente lee desparasitaciones de su mascota" on desparasitaciones
  for select using (owns_mascota(mascota_id));

alter table documentos enable row level security;
create policy "staff acceso total documentos" on documentos
  for all using (is_staff()) with check (is_staff());
create policy "cliente lee documentos de su mascota" on documentos
  for select using (owns_mascota(mascota_id));
