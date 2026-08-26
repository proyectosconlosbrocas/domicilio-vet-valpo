import { useState, type FormEvent } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export function PortalLoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/completar-perfil`,
      },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <CheckCircle2 className="mx-auto mb-3 text-primary" size={40} />
        <h2 className="mb-2 font-heading text-xl font-bold text-neutral-800">Revisá tu correo</h2>
        <p className="text-sm text-neutral-500">
          Te enviamos un link a <strong>{email}</strong>. Abrilo desde este mismo dispositivo para entrar a tu
          portal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Portal de Clientes</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Ingresá tu email y te mandamos un link para entrar — sin contraseña.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mb-5">
        <Label htmlFor="email" className="mb-2 block">
          Email
        </Label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Enviando…" : "Enviarme el link"}
      </Button>
    </form>
  );
}
