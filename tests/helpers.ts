import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";

// Crea una base SQLite temporal con todas las migraciones aplicadas.
export function crearBaseTemporal(nombre: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `presupuestos-${nombre}-`));
  const archivo = path.join(dir, "test.db");
  const db = new Database(archivo);
  const migraciones = path.resolve(__dirname, "../prisma/migrations");
  for (const carpeta of fs.readdirSync(migraciones).sort()) {
    const sql = path.join(migraciones, carpeta, "migration.sql");
    if (fs.existsSync(sql)) db.exec(fs.readFileSync(sql, "utf8"));
  }
  db.close();
  return { archivo, url: `file:${archivo}`, dir };
}
