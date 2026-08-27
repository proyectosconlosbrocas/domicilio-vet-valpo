// Crea (o reutiliza si ya existe) la cuenta REAL de staff de la Dra. Claudia.
// Sin password: el login de la app mobile es solo por email + código OTP
// (signInWithOtp / verifyOtp), no hay contraseña que gestionar.
//
// Usa fetch directo a la Admin API (no @supabase/supabase-js) para evitar
// inicializar el cliente Realtime (necesita WebSocket nativo).
import "dotenv/config";

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
const STAFF_EMAIL = "domiciliovetvalpo@gmail.com";
const STAFF_NOMBRE = "Dra. Claudia Cárcamo";

const headers = {
  apikey: SUPABASE_SECRET_KEY,
  Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
  "Content-Type": "application/json",
};

// 1. ¿Ya existe el usuario de auth con ese email?
const listRes = await fetch(
  `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(STAFF_EMAIL)}`,
  { headers }
);
const listBody = await listRes.json();
if (!listRes.ok) {
  console.error("Error listando usuarios:", JSON.stringify(listBody));
  process.exit(1);
}

let userId = listBody.users?.[0]?.id;

if (!userId) {
  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: STAFF_EMAIL, email_confirm: true }),
  });
  const created = await createRes.json();
  if (!createRes.ok) {
    console.error("Error creando usuario:", JSON.stringify(created));
    process.exit(1);
  }
  userId = created.id;
  console.log("Usuario auth creado:", userId);
} else {
  console.log("Usuario auth ya existía:", userId);
}

// 2. ¿Ya tiene fila en staff?
const staffCheckRes = await fetch(
  `${SUPABASE_URL}/rest/v1/staff?id=eq.${userId}&select=id`,
  { headers }
);
const staffCheck = await staffCheckRes.json();

if (Array.isArray(staffCheck) && staffCheck.length > 0) {
  console.log("Ya tiene fila en staff, no se crea de nuevo.");
} else {
  const staffRes = await fetch(`${SUPABASE_URL}/rest/v1/staff`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({ id: userId, nombre: STAFF_NOMBRE, rol: "admin", activo: true }),
  });
  if (!staffRes.ok) {
    console.error("Error insertando en staff:", await staffRes.text());
    process.exit(1);
  }
  console.log("Fila en staff creada.");
}

console.log(JSON.stringify({ userId, email: STAFF_EMAIL }));
