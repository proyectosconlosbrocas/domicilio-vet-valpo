import { useState, type ChangeEvent, type FormEvent } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { services } from "@/data/services";
import { buildWhatsappLink, buildWhatsappMessage, type ContactFormValues } from "@/lib/whatsapp";

const EMPTY_FORM: ContactFormValues = { name: "", phone: "", pet: "", service: "", message: "" };
const SERVICE_OPTIONS = services.map((service) => service.title);

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleChange(field: keyof ContactFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // window.open tiene que ir dentro del mismo gesto del usuario: si se
    // difiere con un setTimeout, Safari y varios navegadores móviles lo
    // bloquean como popup.
    window.open(buildWhatsappLink(buildWhatsappMessage(values)), "_blank", "noopener");
    setStatus("success");
    setValues(EMPTY_FORM);
    window.setTimeout(() => setStatus("idle"), 6000);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3 className="contact-form-title">Escríbenos tu caso</h3>
      <p className="contact-form-note">Armamos el mensaje y lo abrimos en WhatsApp para que solo tengas que enviarlo.</p>

      {status === "success" && (
        <div className="form-message success" role="status">
          Listo, abrimos WhatsApp con tu mensaje. Si no se abrió, escríbenos al +56 9 6522 2368.
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Tu nombre</label>
          <input id="name" required autoComplete="name" value={values.name} onChange={handleChange("name")} />
        </div>
        <div className="field">
          <label htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+56 9 1234 5678"
            value={values.phone}
            onChange={handleChange("phone")}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="pet">Nombre de tu mascota</label>
        <input id="pet" required value={values.pet} onChange={handleChange("pet")} />
      </div>

      <fieldset className="chips">
        <legend>
          ¿Qué necesitas? <span className="optional">(opcional)</span>
        </legend>
        {SERVICE_OPTIONS.map((option) => (
          <label className="chip" key={option}>
            <input
              type="radio"
              name="service"
              value={option}
              checked={values.service === option}
              onChange={handleChange("service")}
              onClick={() => values.service === option && setValues((prev) => ({ ...prev, service: "" }))}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>

      <div className="field">
        <label htmlFor="message">
          Cuéntanos qué le pasa <span className="optional">(opcional)</span>
        </label>
        <textarea id="message" rows={4} value={values.message} onChange={handleChange("message")} />
      </div>

      <button type="submit" className="btn btn-whatsapp w-full">
        <FaWhatsapp aria-hidden="true" /> Enviar por WhatsApp
      </button>
    </form>
  );
}
