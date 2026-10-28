import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

/** Clases de botón compartidas. Mínimo 48px de alto: se usa con una mano y en movimiento. */
export const buttonClass = {
  primary:
    "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-ink px-4 font-heading text-base font-bold text-white transition active:scale-[0.98] disabled:opacity-60",
  secondary:
    "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 font-heading text-base font-semibold text-ink transition active:bg-neutral-100 disabled:opacity-60",
  whatsapp:
    "flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 font-heading text-base font-semibold text-white transition active:scale-[0.98]",
};

/** Bloque blanco con título chico: agrupa campos o datos relacionados. */
export function Section({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-4">
      {(title || action) && (
        <div className="mb-3 flex min-h-6 items-center justify-between gap-2">
          {title && <h2 className="text-sm font-semibold text-neutral-500">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Barra fija inferior con la acción principal de un formulario, respetando el gesto de inicio de Android/iOS. */
export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-200 bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
      {children}
    </div>
  );
}

export function Loading({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-neutral-500" role="status">
      <Loader2 size={18} className="animate-spin" aria-hidden="true" /> {label}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-neutral-500">{children}</p>;
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
      {message}
    </p>
  );
}

/**
 * Traduce errores de Supabase a algo accionable. El mensaje técnico original
 * no le sirve a quien usa la app en terreno; se conserva solo en consola.
 */
export function friendlyError(raw: string): string {
  console.error(raw);
  const msg = raw.toLowerCase();
  if (msg.includes("failed to fetch") || msg.includes("network")) {
    return "Sin conexión. Revisa tu internet e intenta de nuevo.";
  }
  if (msg.includes("duplicate") || msg.includes("unique")) {
    return "Ya existe un registro con esos datos (por ejemplo, el mismo RUT).";
  }
  return "No se pudo guardar. Intenta de nuevo en unos segundos.";
}
