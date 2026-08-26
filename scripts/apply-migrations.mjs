// Aplica supabase/migrations/*.sql en orden contra la base de datos real,
// leyendo la conexión desde .env (nunca hardcodeado, nunca commiteado).
// Uso: npm run db:migrate
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "..", "supabase", "migrations");

const required = [
  "SUPABASE_DB_HOST",
  "SUPABASE_DB_PORT",
  "SUPABASE_DB_USER",
  "SUPABASE_DB_NAME",
  "SUPABASE_DB_PASSWORD",
];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Falta ${key} en .env`);
    process.exit(1);
  }
}

const client = new Client({
  host: process.env.SUPABASE_DB_HOST,
  port: Number(process.env.SUPABASE_DB_PORT),
  user: process.env.SUPABASE_DB_USER,
  password: process.env.SUPABASE_DB_PASSWORD,
  database: process.env.SUPABASE_DB_NAME,
  ssl: { rejectUnauthorized: false },
});

const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

await client.connect();
console.log(`Conectado a ${process.env.SUPABASE_DB_HOST}. Migraciones a aplicar: ${files.join(", ")}`);

try {
  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    console.log(`\n→ Aplicando ${file}...`);
    await client.query(sql);
    console.log(`  OK`);
  }
  console.log("\nTodas las migraciones se aplicaron correctamente.");
} catch (err) {
  console.error("\nError aplicando migraciones:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
