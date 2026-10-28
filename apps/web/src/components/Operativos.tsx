import { operativos } from "@/data/operativos";
import { OperativoCard } from "./OperativoCard";
import { useInView } from "@/hooks/use-in-view";

export function Operativos() {
  const head = useInView<HTMLDivElement>();

  return (
    <section id="operativos" className="section operativos">
      <div className="wrap">
        <div ref={head.ref} className={`section-head reveal ${head.isVisible ? "is-visible" : ""}`}>
          <h2 className="section-title">Operativos en tu barrio</h2>
          <p className="section-lead">
            Jornadas de atención masiva en barrios de Valparaíso y Viña del Mar, a precios comunitarios. Llevamos el
            equipamiento completo para atender con seguridad, sin que tengas que viajar lejos.
          </p>
        </div>

        <div className="operativos-grid">
          {operativos.map((operativo, index) => (
            <OperativoCard key={operativo.id} operativo={operativo} delay={index * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}
