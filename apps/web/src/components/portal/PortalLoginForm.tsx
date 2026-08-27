import { useState, type FormEvent } from "react";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export function PortalLoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPending, setConfirmPending] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (authError) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    // Sesión creada: useSession() la detecta sola y el resto de la página reacciona.
  }

  async function handleSignup(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (authError) {
      if (authError.message.toLowerCase().includes("rate limit")) {
        setError("Se alcanzó el límite de correos por ahora. Probá de nuevo en unos minutos.");
      } else if (authError.message.toLowerCase().includes("already registered")) {
        setError("Ese correo ya tiene una cuenta. Iniciá sesión en vez de crear una nueva.");
      } else {
        setError(authError.message);
      }
      return;
    }
    if (!data.session) {
      // El proyecto tiene "Confirm email" activo — no hay forma de evitar el
      // correo de confirmación desde el código, es una config del dashboard
      // de Supabase (Authentication → Sign In / Providers → Email).
      setConfirmPending(true);
      return;
    }
    // Sesión creada: useSession() la detecta y el resto de la página reacciona
    // (te manda directo a completar el perfil).
  }

  if (confirmPending) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <Mail className="mx-auto mb-3 text-primary" size={40} />
        <h2 className="mb-2 font-heading text-xl font-bold text-neutral-800">Confirmá tu correo</h2>
        <p className="text-sm text-neutral-500">
          Te enviamos un correo a <strong>{email}</strong> para confirmar tu cuenta. Una vez confirmada, iniciá
          sesión con tu correo y contraseña.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={mode === "login" ? handleLogin : handleSignup}
      className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg"
    >
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        {mode === "login"
          ? "Entrá con tu correo y contraseña para ver a tus mascotas."
          : "Creá tu cuenta para registrar a tus mascotas y ver su historial."}
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mb-4">
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

      <div className={mode === "signup" ? "mb-4" : "mb-5"}>
        <Label htmlFor="password" className="mb-2 block">
          Contraseña
        </Label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            id="password"
            type="password"
            required
            minLength={mode === "signup" ? 6 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {mode === "signup" && (
        <div className="mb-5">
          <Label htmlFor="confirmPassword" className="mb-2 block">
            Confirmar contraseña
          </Label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <Input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Un momento…" : mode === "login" ? "Entrar" : "Crear cuenta"}
      </Button>

      <button
        type="button"
        onClick={() => {
          setMode((m) => (m === "login" ? "signup" : "login"));
          setError(null);
        }}
        className="mt-4 w-full text-center text-sm font-medium text-primary underline"
      >
        {mode === "login" ? "¿No tenés cuenta? Creála" : "¿Ya tenés cuenta? Iniciá sesión"}
      </button>
    </form>
  );
}
