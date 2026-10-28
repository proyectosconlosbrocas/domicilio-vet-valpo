/**
 * Chequeo de salud del proyecto + keep-alive de Supabase.
 *
 * Supabase (plan Free) pausa el proyecto tras ~7 días sin actividad en la
 * base. Este script hace consultas reales a la base (no solo un ping HTTP),
 * así que cada ejecución cuenta como actividad. Lo corre el workflow
 * .github/workflows/health-check.yml; también se puede correr a mano:
 *
 *   SUPABASE_URL=... SUPABASE_ANON_KEY=... STAFF_EMAIL=... STAFF_PASSWORD=... \
 *     node scripts/health-check.mjs
 *
 * Escribe el informe en Markdown en `health-report.md` (y en el resumen del
 * job si existe GITHUB_STEP_SUMMARY). Sale con código 1 si falla algo crítico.
 * Sin dependencias: usa el fetch nativo de Node 20.
 */
import { appendFileSync, writeFileSync } from "node:fs";

const { SUPABASE_URL, SUPABASE_ANON_KEY, STAFF_EMAIL, STAFF_PASSWORD, GITHUB_STEP_SUMMARY } = process.env;
const WEB_URL = process.env.WEB_URL ?? "https://domicilio-vet-valpo.vercel.app/";

const checks = [];

async function timed(fn) {
  const start = performance.now();
  try {
    const detail = await fn();
    return { ok: true, ms: Math.round(performance.now() - start), detail };
  } catch (error) {
    return { ok: false, ms: Math.round(performance.now() - start), detail: error.message };
  }
}

async function check(name, critical, fn) {
  const result = await timed(fn);
  checks.push({ name, critical, ...result });
  return result;
}

async function expectOk(response, label) {
  if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
  return response;
}

function todayChile(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(date);
}

/** Cuenta filas vía PostgREST sin traerlas (Prefer: count=exact). */
async function countRows(token, table, filter = "") {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id${filter}`, {
    method: "HEAD",
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}`, Prefer: "count=exact" },
  });
  await expectOk(response, table);
  return Number(response.headers.get("content-range")?.split("/")[1] ?? NaN);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Faltan SUPABASE_URL / SUPABASE_ANON_KEY.");
  process.exit(1);
}

await check("Sitio web (Vercel)", true, async () => {
  const response = await expectOk(await fetch(WEB_URL), "web");
  const html = await response.text();
  if (!html.includes('id="root"')) throw new Error("respondió, pero no parece la app");
  return "online";
});

await check("Supabase Auth", true, async () => {
  await expectOk(await fetch(`${SUPABASE_URL}/auth/v1/health`, { headers: { apikey: SUPABASE_ANON_KEY } }), "auth");
  return "online";
});

let token = null;
if (STAFF_EMAIL && STAFF_PASSWORD) {
  await check("Login de staff", true, async () => {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: STAFF_EMAIL, password: STAFF_PASSWORD }),
    });
    await expectOk(response, "login");
    token = (await response.json()).access_token;
    return "ok";
  });
}

// Consultas reales a la base: esto es lo que mantiene el proyecto activo.
const stats = {};
if (token) {
  await check("Base de datos (consultas con RLS)", true, async () => {
    stats.clientes = await countRows(token, "clientes", "&activo=eq.true");
    stats.mascotas = await countRows(token, "mascotas", "&estado=eq.activo");
    stats.visitas30 = await countRows(token, "visitas", `&fecha=gte.${todayChile(-30)}`);
    stats.agenda7 = await countRows(token, "agenda_visitas", `&fecha=gte.${todayChile()}&fecha=lte.${todayChile(7)}`);
    return "ok";
  });
} else {
  await check("Base de datos (consulta anónima)", true, async () => {
    await expectOk(
      await fetch(`${SUPABASE_URL}/rest/v1/clientes?select=id&limit=1`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      }),
      "rest"
    );
    return "ok (sin credenciales de staff, no hay conteos)";
  });
}

const failedCritical = checks.filter((c) => !c.ok && c.critical);
const fecha = new Intl.DateTimeFormat("es-CL", {
  timeZone: "America/Santiago",
  dateStyle: "full",
  timeStyle: "short",
}).format(new Date());

const lines = [
  `## ${failedCritical.length ? "❌ Hay problemas" : "✅ Todo en orden"} — ${fecha}`,
  "",
  "| Chequeo | Estado | Tiempo | Detalle |",
  "| --- | --- | --- | --- |",
  ...checks.map((c) => `| ${c.name} | ${c.ok ? "✅" : "❌"} | ${c.ms} ms | ${c.detail} |`),
];

if (Object.keys(stats).length) {
  lines.push(
    "",
    "**Datos**",
    "",
    `- Clientes activos: ${stats.clientes}`,
    `- Mascotas activas: ${stats.mascotas}`,
    `- Visitas registradas (últimos 30 días): ${stats.visitas30}`,
    `- Visitas agendadas (próximos 7 días): ${stats.agenda7}`
  );
}

lines.push(
  "",
  "_Esta consulta también mantiene activo el proyecto de Supabase (plan Free se pausa tras 7 días sin uso)._"
);

const report = lines.join("\n");
writeFileSync("health-report.md", report);
if (GITHUB_STEP_SUMMARY) appendFileSync(GITHUB_STEP_SUMMARY, report + "\n");
console.log(report);

process.exit(failedCritical.length ? 1 : 0);
