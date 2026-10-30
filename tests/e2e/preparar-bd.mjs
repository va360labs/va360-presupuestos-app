// Crea una base SQLite vacía con todas las migraciones para las pruebas e2e.
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const url = process.env.DATABASE_URL;
if (!url?.startsWith("file:")) throw new Error("DATABASE_URL de e2e no definida");
const archivo = url.slice("file:".length);

fs.mkdirSync(path.dirname(archivo), { recursive: true });
for (const sufijo of ["", "-journal", "-wal", "-shm"]) fs.rmSync(archivo + sufijo, { force: true });

const db = new Database(archivo);
const migraciones = path.resolve("prisma/migrations");
for (const carpeta of fs.readdirSync(migraciones).sort()) {
  const sql = path.join(migraciones, carpeta, "migration.sql");
  if (fs.existsSync(sql)) db.exec(fs.readFileSync(sql, "utf8"));
}
db.close();
console.log("Base e2e lista:", archivo);
