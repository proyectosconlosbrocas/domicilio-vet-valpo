// Borra el usuario/staff de prueba y cualquier cliente/mascota/visita que
// haya quedado del E2E manual (identificados por el sufijo "(E2E test)"/
// "(temporal)" que usan los scripts de prueba).
import "dotenv/config";

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
const TEST_EMAIL = "test-staff-verificacion@domiciliovetvalpo.test";

const headers = {
  apikey: SUPABASE_SECRET_KEY,
  Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
  "Content-Type": "application/json",
};

// 1. Borrar clientes de prueba (cascade se lleva mascotas/visitas)
const delClientes = await fetch(`${SUPABASE_URL}/rest/v1/clientes?nombre=ilike.*E2E test*`, {
  method: "DELETE",
  headers: { ...headers, Prefer: "return=representation" },
});
console.log("Clientes de prueba borrados:", await delClientes.text());

// 2. Encontrar y borrar el usuario de auth (staff se borra en cascada por FK)
const usersRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(TEST_EMAIL)}`, {
  headers,
});
const usersData = await usersRes.json();
const user = usersData.users?.[0];

if (user) {
  const delRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
    method: "DELETE",
    headers,
  });
  console.log("Usuario de prueba borrado:", delRes.ok);
} else {
  console.log("No se encontró el usuario de prueba (ya estaba borrado).");
}
