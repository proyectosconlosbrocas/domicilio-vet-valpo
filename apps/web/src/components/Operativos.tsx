import { operativos } from "@/data/operativos";
import { OperativoCard } from "./OperativoCard";
import { Reveal, RevealGroup } from "./motion/Reveal";
import { BrandPattern } from "./motion/Backdrops";

/** Sección en rojo de marca: el momento fuerte de color de la página. */
export function Operativos() {
  return (
    <section id="operativos" className="section operativos">
      <BrandPattern tone="white" opacity={0.09} drift={80} fade="radial" />

      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="section-title">Operativos en tu barrio</h2>
          <p className="section-lead">
            Jornadas de atención masiva en barrios de Valparaíso y Viña del Mar, a precios comunitarios. Llevamos el
            equipamiento completo para atender con seguridad, sin que tengas que viajar lejos.
          </p>
        </Reveal>

        <RevealGroup className="operativos-grid">
          {operativos.map((operativo) => (
            <OperativoCard key={operativo.id} operativo={operativo} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
