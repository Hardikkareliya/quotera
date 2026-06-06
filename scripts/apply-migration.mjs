/**
 * Applies the initial schema migration using DATABASE_URL from .env.local
 *
 * Get URI from: Supabase Dashboard → Project Settings → Database → Connection string (URI)
 * Add to .env.local: DATABASE_URL=postgresql://postgres.[ref]:[PASSWORD]@...
 *
 * Run: npm run db:migrate
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL in .env.local\n\n" +
      "1. Open Supabase → Project Settings → Database\n" +
      "2. Copy Connection string (URI mode)\n" +
      "3. Add: DATABASE_URL=postgresql://...\n" +
      "4. Run: npm run db:migrate\n\n" +
      "Or paste supabase/migrations/20250604000001_initial_schema.sql into the SQL Editor.",
  );
  process.exit(1);
}

const sqlPath = resolve(
  __dirname,
  "../supabase/migrations/20250604000001_initial_schema.sql",
);
const sql = readFileSync(sqlPath, "utf8");

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Applying migration…");
  await client.query(sql);
  console.log("Done. Tables and RLS are ready. Try registering again.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
