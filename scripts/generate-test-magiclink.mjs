// Genera un magic link real (sin enviar el email) para probar el flujo del
// portal de clientes de punta a punta con Playwright, sin depender de un
// buzón de correo real.
import "dotenv/config";

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
const email = process.argv[2] || "test-cliente-verificacion@domiciliovetvalpo.test";
const redirectTo = process.argv[3] || "http://localhost:5000/completar-perfil";

const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
  method: "POST",
  headers: {
    apikey: SUPABASE_SECRET_KEY,
    Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: "magiclink",
    email,
    options: { redirect_to: redirectTo },
  }),
});

const data = await res.json();
if (!res.ok) {
  console.error("Error generando el link:", JSON.stringify(data));
  process.exit(1);
}

console.log(data.action_link);
