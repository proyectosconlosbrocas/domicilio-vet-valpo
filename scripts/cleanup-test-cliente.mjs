// Borra el cliente/mascota de prueba del E2E del portal web y el usuario
// de auth asociado (test-cliente-verificacion@domiciliovetvalpo.test).
import "dotenv/config";

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
const TEST_EMAIL = "test-cliente-verificacion@domiciliovetvalpo.test";

const headers = {
  apikey: SUPABASE_SECRET_KEY,
  Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const delClientes = await fetch(`${SUPABASE_URL}/rest/v1/clientes?nombre=ilike.*E2E*`, {
  method: "DELETE",
  headers: { ...headers, Prefer: "return=representation" },
});
console.log("Clientes de prueba borrados:", await delClientes.text());

const usersRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(TEST_EMAIL)}`, {
  headers,
});
const usersData = await usersRes.json();
const user = usersData.users?.[0];

if (user) {
  const delRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, { method: "DELETE", headers });
  console.log("Usuario de prueba borrado:", delRes.ok);
} else {
  console.log("No se encontró el usuario de prueba.");
}
