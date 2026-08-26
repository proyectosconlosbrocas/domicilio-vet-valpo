// Usa fetch directo a la Admin API en vez de @supabase/supabase-js para
// evitar que se inicialice el cliente Realtime (necesita WebSocket nativo,
// no disponible en Node 20 sin el paquete "ws").
import "dotenv/config";

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
const TEST_EMAIL = "test-staff-verificacion@domiciliovetvalpo.test";
const TEST_PASSWORD = "TestStaff!2026Verify";

const headers = {
  apikey: SUPABASE_SECRET_KEY,
  Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const userRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
  method: "POST",
  headers,
  body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, email_confirm: true }),
});
const user = await userRes.json();
if (!userRes.ok) {
  console.error("Error creando usuario:", JSON.stringify(user));
  process.exit(1);
}

const staffRes = await fetch(`${SUPABASE_URL}/rest/v1/staff`, {
  method: "POST",
  headers: { ...headers, Prefer: "return=representation" },
  body: JSON.stringify({ id: user.id, nombre: "Staff de Prueba (temporal)", rol: "vet" }),
});
if (!staffRes.ok) {
  console.error("Error insertando en staff:", await staffRes.text());
  process.exit(1);
}

console.log(JSON.stringify({ userId: user.id, email: TEST_EMAIL, password: TEST_PASSWORD }));
