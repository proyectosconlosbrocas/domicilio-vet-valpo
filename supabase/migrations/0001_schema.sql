-- Domicilio Vet Valpo — esquema base (clientes, mascotas, historial clínico)
-- Ver specs/ y el plan de migración para el razonamiento completo detrás de
-- cada decisión (por qué activo en vez de DELETE, por qué documentos.mascota_id
-- es obligatorio, etc.)

create extension if not exists "pgcrypto";

-- STAFF: quién puede loguearse a la app interna. Hoy solo la Dra. Claudia;
-- el alta de nuevo staff se hace por SQL editor (service_role), no desde la app.
create table staff (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null default 'vet' check (rol in ('admin','vet')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- CLIENTES
create table clientes (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  nombre text not null,
  rut text,
  telefono text,
  telefono_alternativo text,
  email text,
  direccion text,
  contacto_emergencia_nombre text,
  contacto_emergencia_telefono text,
  consentimiento_datos_aceptado boolean not null default false,
  consentimiento_fecha timestamptz,
  activo boolean not null default true, -- "eliminar" = activo:false, nunca DELETE real (preserva historial clínico)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index clientes_rut_uidx on clientes (rut) where rut is not null;

-- MASCOTAS
create table mascotas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  nombre text not null,
  especie text not null,
  raza text,
  sexo text check (sexo in ('macho','hembra','desconocido')),
  esterilizado boolean default false,
  fecha_esterilizacion date,
  fecha_nacimiento date,
  color text,
  peso_actual numeric(5,2),
  microchip text,
  foto_url text,
  alergias text,
  condiciones_cronicas text,
  temperamento text,
  estado text not null default 'activo' check (estado in ('activo','fallecido','adoptado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index mascotas_cliente_id_idx on mascotas (cliente_id);
create unique index mascotas_microchip_uidx on mascotas (microchip) where microchip is not null;

-- VISITAS
create table visitas (
  id uuid primary key default gen_random_uuid(),
  mascota_id uuid not null references mascotas(id) on delete cascade,
  fecha timestamptz not null default now(),
  motivo text not null,
  -- veterinario: texto libre además de created_by. Permite registrar quién
  -- ATENDIÓ si en el futuro difiere de quién REGISTRÓ la visita en el sistema
  -- (hoy siempre va a ser la Dra. Claudia en ambos casos).
  veterinario text,
  diagnostico text,
  tratamiento text,
  peso_registrado numeric(5,2),
  signos_vitales jsonb,
  observaciones text,
  proxima_cita date,
  costo numeric(10,0),
  created_by uuid references staff(id),
  created_at timestamptz not null default now()
);
create index visitas_mascota_id_fecha_idx on visitas (mascota_id, fecha desc);

-- VACUNAS
create table vacunas (
  id uuid primary key default gen_random_uuid(),
  mascota_id uuid not null references mascotas(id) on delete cascade,
  tipo text not null,
  fecha_aplicacion date not null,
  proxima_dosis date,
  lote text,
  veterinario text,
  created_by uuid references staff(id),
  created_at timestamptz not null default now()
);
create index vacunas_mascota_id_idx on vacunas (mascota_id);
create index vacunas_proxima_dosis_idx on vacunas (proxima_dosis) where proxima_dosis is not null;

-- DESPARASITACIONES
create table desparasitaciones (
  id uuid primary key default gen_random_uuid(),
  mascota_id uuid not null references mascotas(id) on delete cascade,
  tipo text not null check (tipo in ('interna','externa','ambas')),
  producto text,
  fecha date not null,
  proxima_dosis date,
  created_by uuid references staff(id),
  created_at timestamptz not null default now()
);
create index desparasitaciones_mascota_id_idx on desparasitaciones (mascota_id);
create index desparasitaciones_proxima_dosis_idx on desparasitaciones (proxima_dosis) where proxima_dosis is not null;

-- DOCUMENTOS (fotos, exámenes, radiografías). mascota_id siempre obligatorio
-- (visita_id es opcional) para que el ownership de RLS tenga una sola
-- dimensión — ver owns_mascota() en 0002_rls_policies.sql.
create table documentos (
  id uuid primary key default gen_random_uuid(),
  mascota_id uuid not null references mascotas(id) on delete cascade,
  visita_id uuid references visitas(id) on delete set null,
  tipo text not null, -- 'foto' | 'examen' | 'radiografia' | 'otro'
  url text not null,
  nombre_archivo text,
  fecha_subida timestamptz not null default now(),
  created_by uuid references staff(id)
);
create index documentos_mascota_id_idx on documentos (mascota_id);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_clientes_updated_at
  before update on clientes
  for each row execute function set_updated_at();

create trigger trg_mascotas_updated_at
  before update on mascotas
  for each row execute function set_updated_at();
