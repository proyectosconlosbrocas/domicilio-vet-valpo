// Tipos escritos a mano a partir de supabase/migrations/000{1,2,3}_*.sql
// (no se pudo usar `supabase gen types` porque ese comando necesita Docker
// local, no disponible en este entorno). Regenerar con el comando oficial
// en cuanto haya Docker/`supabase login` a mano:
//   npx supabase gen types typescript --project-id lbzeqxcezvjoyjjxajak > packages/supabase/src/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      staff: {
        Row: {
          id: string;
          nombre: string;
          rol: string;
          activo: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          nombre: string;
          rol?: string;
          activo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          rol?: string;
          activo?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      clientes: {
        Row: {
          id: string;
          auth_user_id: string | null;
          nombre: string;
          rut: string | null;
          telefono: string | null;
          telefono_alternativo: string | null;
          email: string | null;
          direccion: string | null;
          contacto_emergencia_nombre: string | null;
          contacto_emergencia_telefono: string | null;
          consentimiento_datos_aceptado: boolean;
          consentimiento_fecha: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          nombre: string;
          rut?: string | null;
          telefono?: string | null;
          telefono_alternativo?: string | null;
          email?: string | null;
          direccion?: string | null;
          contacto_emergencia_nombre?: string | null;
          contacto_emergencia_telefono?: string | null;
          consentimiento_datos_aceptado?: boolean;
          consentimiento_fecha?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clientes"]["Insert"]>;
        Relationships: [];
      };
      mascotas: {
        Row: {
          id: string;
          cliente_id: string;
          nombre: string;
          especie: string;
          raza: string | null;
          sexo: "macho" | "hembra" | "desconocido" | null;
          esterilizado: boolean | null;
          fecha_esterilizacion: string | null;
          fecha_nacimiento: string | null;
          color: string | null;
          peso_actual: number | null;
          microchip: string | null;
          foto_url: string | null;
          alergias: string | null;
          condiciones_cronicas: string | null;
          temperamento: string | null;
          estado: "activo" | "fallecido" | "adoptado";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          nombre: string;
          especie: string;
          raza?: string | null;
          sexo?: "macho" | "hembra" | "desconocido" | null;
          esterilizado?: boolean | null;
          fecha_esterilizacion?: string | null;
          fecha_nacimiento?: string | null;
          color?: string | null;
          peso_actual?: number | null;
          microchip?: string | null;
          foto_url?: string | null;
          alergias?: string | null;
          condiciones_cronicas?: string | null;
          temperamento?: string | null;
          estado?: "activo" | "fallecido" | "adoptado";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["mascotas"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "mascotas_cliente_id_fkey";
            columns: ["cliente_id"];
            isOneToOne: false;
            referencedRelation: "clientes";
            referencedColumns: ["id"];
          },
        ];
      };
      agenda_visitas: {
        Row: {
          id: string;
          cliente_id: string;
          fecha: string;
          hora: string | null;
          notas: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          fecha: string;
          hora?: string | null;
          notas?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["agenda_visitas"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "agenda_visitas_cliente_id_fkey";
            columns: ["cliente_id"];
            isOneToOne: false;
            referencedRelation: "clientes";
            referencedColumns: ["id"];
          },
        ];
      };
      visitas: {
        Row: {
          id: string;
          mascota_id: string;
          fecha: string;
          motivo: string;
          veterinario: string | null;
          diagnostico: string | null;
          tratamiento: string | null;
          peso_registrado: number | null;
          signos_vitales: Json | null;
          observaciones: string | null;
          proxima_cita: string | null;
          costo: number | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          mascota_id: string;
          fecha?: string;
          motivo: string;
          veterinario?: string | null;
          diagnostico?: string | null;
          tratamiento?: string | null;
          peso_registrado?: number | null;
          signos_vitales?: Json | null;
          observaciones?: string | null;
          proxima_cita?: string | null;
          costo?: number | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["visitas"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "visitas_mascota_id_fkey";
            columns: ["mascota_id"];
            isOneToOne: false;
            referencedRelation: "mascotas";
            referencedColumns: ["id"];
          },
        ];
      };
      vacunas: {
        Row: {
          id: string;
          mascota_id: string;
          tipo: string;
          fecha_aplicacion: string;
          proxima_dosis: string | null;
          lote: string | null;
          veterinario: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          mascota_id: string;
          tipo: string;
          fecha_aplicacion: string;
          proxima_dosis?: string | null;
          lote?: string | null;
          veterinario?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vacunas"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "vacunas_mascota_id_fkey";
            columns: ["mascota_id"];
            isOneToOne: false;
            referencedRelation: "mascotas";
            referencedColumns: ["id"];
          },
        ];
      };
      desparasitaciones: {
        Row: {
          id: string;
          mascota_id: string;
          tipo: "interna" | "externa" | "ambas";
          producto: string | null;
          fecha: string;
          proxima_dosis: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          mascota_id: string;
          tipo: "interna" | "externa" | "ambas";
          producto?: string | null;
          fecha: string;
          proxima_dosis?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["desparasitaciones"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "desparasitaciones_mascota_id_fkey";
            columns: ["mascota_id"];
            isOneToOne: false;
            referencedRelation: "mascotas";
            referencedColumns: ["id"];
          },
        ];
      };
      documentos: {
        Row: {
          id: string;
          mascota_id: string;
          visita_id: string | null;
          tipo: string;
          url: string;
          nombre_archivo: string | null;
          fecha_subida: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          mascota_id: string;
          visita_id?: string | null;
          tipo: string;
          url: string;
          nombre_archivo?: string | null;
          fecha_subida?: string;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["documentos"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "documentos_mascota_id_fkey";
            columns: ["mascota_id"];
            isOneToOne: false;
            referencedRelation: "mascotas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documentos_visita_id_fkey";
            columns: ["visita_id"];
            isOneToOne: false;
            referencedRelation: "visitas";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      owns_mascota: {
        Args: { p_mascota_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
