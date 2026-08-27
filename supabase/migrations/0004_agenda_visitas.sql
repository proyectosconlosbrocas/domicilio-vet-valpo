-- Domicilio Vet Valpo — agenda de visitas (citas futuras).
--
-- Distinta de `visitas`: `visitas` es el registro clínico de una visita ya
-- realizada, atado a una mascota puntual (mascota_id not null). Agendar una
-- visita es más simple — solo "qué cliente, qué día" — y no requiere elegir
-- mascota de antemano (puede ser para cualquiera de sus mascotas, o para
-- verlas todas). Uso interno de staff únicamente, no aparece en el portal
-- de clientes.

create table agenda_visitas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  fecha date not null,
  notas text,
  created_by uuid references staff(id),
  created_at timestamptz not null default now()
);
create index agenda_visitas_fecha_idx on agenda_visitas (fecha);
create index agenda_visitas_cliente_id_idx on agenda_visitas (cliente_id);

alter table agenda_visitas enable row level security;

create policy "staff acceso total agenda_visitas"
  on agenda_visitas for all
  using (is_staff())
  with check (is_staff());
