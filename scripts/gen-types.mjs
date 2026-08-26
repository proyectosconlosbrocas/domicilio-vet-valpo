// Genera packages/supabase/src/database.types.ts desde el esquema real,
// vía `supabase gen types typescript --db-url`. Arma la connection string
// (URL-encodeando la password) a partir de .env sin imprimirla nunca.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = join(__dirname, "..", "packages", "supabase", "src", "database.types.ts");

const { SUPABASE_DB_HOST, SUPABASE_DB_PORT, SUPABASE_DB_USER, SUPABASE_DB_NAME, SUPABASE_DB_PASSWORD } = process.env;

const dbUrl =
  `postgresql://${encodeURIComponent(SUPABASE_DB_USER)}:${encodeURIComponent(SUPABASE_DB_PASSWORD)}` +
  `@${SUPABASE_DB_HOST}:${SUPABASE_DB_PORT}/${SUPABASE_DB_NAME}`;

const result = execFileSync("npx", ["supabase", "gen", "types", "typescript", "--db-url", dbUrl], {
  encoding: "utf8",
  shell: true,
});

writeFileSync(outFile, result);
console.log(`Tipos generados en ${outFile} (${result.split("\n").length} líneas).`);
