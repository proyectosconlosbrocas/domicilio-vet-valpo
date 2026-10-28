import { motion } from "motion/react";
import { Check } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { BrandMark } from "./motion/Backdrops";

const EXPERTISE = [
  "Homeopatía veterinaria",
  "Atención integral a domicilio",
  "Cirugías menores y esterilizaciones",
  "Medicina preventiva y vacunación",
];

export function About() {
  return (
    <section id="sobre-mi" className="section section-alt section-about">
      <BrandMark tone="red" opacity={0.08} size="38rem" position={{ left: "-12rem", top: "10%" }} rotate={40} />

      <div className="wrap about-grid">
        <figure className="about-figure">
          {/* Barrido de abajo hacia arriba al entrar en pantalla. El disparador
              va en el contenedor: si estuviera en la imagen recortada, su área
              visible sería 0 y nunca contaría como "en pantalla". */}
          <motion.div
            className="about-photo"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="about-photo-block" aria-hidden="true" />
            <motion.img
              src="/assets/doctora-claudia-carcamo.jpg"
              alt="Retrato de la Dra. Claudia Cárcamo"
              variants={{
                hidden: { clipPath: "inset(100% 0% 0% 0%)" },
                visible: { clipPath: "inset(0% 0% 0% 0%)" },
              }}
              transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.div>
          <figcaption>Dra. Claudia Cárcamo, médico veterinario titulada.</figcaption>
        </figure>

        <div className="about-body">
          <Reveal>
            <h2 className="section-title">Dra. Claudia Cárcamo</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="section-lead">
              Médico veterinario titulada, con especialización en medicina homeopática y atención a domicilio. Mi
              pasión es brindar cuidados personalizados que respeten la naturaleza de cada animal.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p>
              Atender en casa permite ver a cada mascota en su ambiente, tranquila y sin el estrés del traslado. Creo
              en una medicina que fortalece la salud de manera integral, respetando el equilibrio y las necesidades
              individuales de cada animal.
            </p>
          </Reveal>
          <RevealGroup as="ul" className="check-list two-col">
            {EXPERTISE.map((item) => (
              <RevealItem as="li" key={item}>
                <Check size={20} aria-hidden="true" /> {item}
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.1}>
            <a
              href={buildWhatsappLink("Hola Dra. Claudia, quisiera agendar una consulta para mi mascota")}
              className="btn btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden="true" /> Agendar con la doctora
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
