-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "nif" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" INTEGER NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "clienteNif" TEXT,
    "clienteDireccion" TEXT,
    "clienteTelefono" TEXT,
    "clienteCorreo" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "condiciones" TEXT,
    "observaciones" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clienteId" TEXT,
    CONSTRAINT "Presupuesto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Presupuesto" ("clienteCorreo", "clienteDireccion", "clienteNif", "clienteNombre", "clienteTelefono", "condiciones", "createdAt", "estado", "id", "numero", "observaciones", "updatedAt") SELECT "clienteCorreo", "clienteDireccion", "clienteNif", "clienteNombre", "clienteTelefono", "condiciones", "createdAt", "estado", "id", "numero", "observaciones", "updatedAt" FROM "Presupuesto";
DROP TABLE "Presupuesto";
ALTER TABLE "new_Presupuesto" RENAME TO "Presupuesto";
CREATE UNIQUE INDEX "Presupuesto_numero_key" ON "Presupuesto"("numero");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
