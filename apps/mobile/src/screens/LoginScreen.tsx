import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

const STAFF_EMAIL = "domiciliovetvalpo@gmail.com";

export function LoginScreen() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(STAFF_EMAIL);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // shouldCreateUser: false — solo cuentas de staff ya dadas de alta
    // pueden pedir un código. Un email cualquiera no crea cuenta nueva.
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (otpError) {
      setError("No se pudo enviar el código. Verificá el correo e intentá de nuevo.");
      setLoading(false);
      return;
    }
    setLoading(false);
    setStep("code");
  }

  async function handleVerifyCode(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (verifyError) {
      setError("Código incorrecto o vencido. Pedí uno nuevo.");
      setLoading(false);
      return;
    }
    // El chequeo de "¿es staff de verdad?" pasa por RLS en StaffGate — si
    // el login funciona pero la cuenta no tiene fila en staff, las queries
    // van a devolver vacío, no un error de auth.
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-1 font-heading text-xl font-bold text-primary">Domicilio Vet Valpo</h1>
        <p className="mb-6 text-sm text-neutral-500">Acceso solo para el equipo</p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendCode}>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-6 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? "Enviando…" : "Enviar código"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <p className="mb-4 text-sm text-neutral-600">
              Te enviamos un código a <strong>{email}</strong>. Revisá el correo y escribilo acá.
            </p>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="code">
              Código
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mb-4 w-full rounded-lg border border-neutral-300 px-3 py-2 text-center text-lg tracking-widest focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="mb-3 w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? "Verificando…" : "Entrar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setError(null);
              }}
              className="w-full text-sm font-medium text-neutral-500 underline"
            >
              Usar otro correo / pedir otro código
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
