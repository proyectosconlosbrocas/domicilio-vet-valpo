import { Info } from "lucide-react";
import { operativos } from "@/data/operativos";
import { OperativoCard } from "./OperativoCard";
import { useInView } from "@/hooks/use-in-view";

export function Operativos() {
  const intro = useInView<HTMLDivElement>({ delay: 100 });

  return (
    <section id="operativos" className="operativos-section">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="section-title">Operativos Veterinarios</h2>
          <p className="section-subtitle">Atención comunitaria de calidad para tu mascota</p>
        </div>

        <div ref={intro.ref} className={`operativos-intro reveal ${intro.isVisible ? "is-visible" : ""}`}>
          <h3>
            <Info /> ¿Qué es un Operativo Veterinario?
          </h3>
          <p>
            Los <strong>operativos veterinarios</strong> son jornadas de atención masiva donde llevamos servicios de
            salud animal directamente a tu comunidad. Estas actividades se realizan en diferentes barrios y
            localidades de Valparaíso y Viña del Mar, facilitando el acceso a atención veterinaria profesional a
            precios accesibles.
          </p>
          <p>
            Durante estos eventos, ofrecemos servicios preventivos y quirúrgicos en un ambiente organizado, con todo
            el equipamiento necesario para garantizar la seguridad y bienestar de tu mascota. Es una excelente
            oportunidad para cuidar la salud de tus compañeros sin necesidad de desplazarte largas distancias.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {operativos.map((operativo, index) => (
            <OperativoCard key={operativo.id} operativo={operativo} delay={200 + index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
