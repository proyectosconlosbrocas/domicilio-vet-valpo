// Crea (o reutiliza si ya existe) la cuenta REAL de staff de la Dra. Claudia.
// Sin password: el login de la app mobile es solo por email + código OTP
// (signInWithOtp / verifyOtp), no hay contraseña que gestionar.
//
// Usa fetch directo a la Admin API (no @supabase/supabase-js) para evitar
// inicializar el cliente Realtime (necesita WebSocket nativo).
import "dotenv/config";

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
const STAFF_EMAIL = "mauro.carcamo89@gmail.com";
const OLD_STAFF_EMAILS = ["domiciliovetvalpo@gmail.com"]; // correos dados de baja
const STAFF_NOMBRE = "Dra. Claudia Cárcamo";

const headers = {
  apikey: SUPABASE_SECRET_KEY,
  Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
  "Content-Type": "application/json",
};

// 0. Dar de baja cuentas viejas/incorrectas (auth user + fila en staff).
for (const oldEmail of OLD_STAFF_EMAILS) {
  const oldListRes = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(oldEmail)}`,
    { headers }
  );
  const oldListBody = await oldListRes.json();
  const oldUserId = oldListBody.users?.[0]?.id;
  if (oldUserId) {
    await fetch(`${SUPABASE_URL}/rest/v1/staff?id=eq.${oldUserId}`, {
      method: "DELETE",
      headers,
    });
    const delRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${oldUserId}`, {
      method: "DELETE",
      headers,
    });
    console.log(`Cuenta vieja ${oldEmail} (${oldUserId}) eliminada:`, delRes.ok);
  } else {
    console.log(`Cuenta vieja ${oldEmail} no existía, nada que borrar.`);
  }
}

// 1. ¿Ya existe el usuario de auth con el email correcto?
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
