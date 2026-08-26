import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { buildWhatsappLink, buildWhatsappMessage, type ContactFormValues } from "@/lib/whatsapp";

const EMPTY_FORM: ContactFormValues = { name: "", phone: "", pet: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleChange(field: keyof ContactFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("idle");

    // Pequeño delay para mejor UX antes de abrir WhatsApp (igual que el sitio original)
    window.setTimeout(() => {
      window.open(buildWhatsappLink(buildWhatsappMessage(values)), "_blank");
      setStatus("success");
      setValues(EMPTY_FORM);
      setSubmitting(false);
      window.setTimeout(() => setStatus("idle"), 5000);
    }, 800);
  }

  return (
    <div className="contact-form-wrapper">
      <form onSubmit={handleSubmit}>
        {status === "success" && (
          <div className="form-message success show" role="alert" aria-live="polite">
            ¡Listo! Te estamos redirigiendo a WhatsApp para continuar la conversación.
          </div>
        )}

        <div className="mb-3">
          <Label htmlFor="name" className="mb-2 block">
            Nombre
          </Label>
          <Input id="name" required value={values.name} onChange={handleChange("name")} aria-label="Nombre completo" />
        </div>

        <div className="mb-3">
          <Label htmlFor="phone" className="mb-2 block">
            Teléfono
          </Label>
          <Input
            id="phone"
            type="tel"
            required
            value={values.phone}
            onChange={handleChange("phone")}
            aria-label="Número de teléfono"
          />
        </div>

        <div className="mb-3">
          <Label htmlFor="pet" className="mb-2 block">
            Nombre de tu mascota
          </Label>
          <Input id="pet" required value={values.pet} onChange={handleChange("pet")} aria-label="Nombre de tu mascota" />
        </div>

        <div className="mb-3">
          <Label htmlFor="message" className="mb-2 block">
            Mensaje
          </Label>
          <Textarea id="message" rows={4} required value={values.message} onChange={handleChange("message")} />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? (
            <svg className="spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
            </svg>
          ) : (
            <span>Enviar por WhatsApp</span>
          )}
        </button>
      </form>
    </div>
  );
}
