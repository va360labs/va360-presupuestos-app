import { defineConfig, devices } from "@playwright/test";
import os from "node:os";
import path from "node:path";

const PUERTO = Number(process.env.E2E_PORT ?? 3100);
// Base propia de las pruebas: nunca se toca dev.db.
const BD_E2E = path.join(os.tmpdir(), "presupuestos-e2e", "e2e.db");

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  outputDir: "./test-results",
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    actionTimeout: 5_000,
  },
  expect: { timeout: 5_000 },
  projects: [
    {
      name: "escritorio",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "movil-iphone",
      use: { ...devices["iPhone 15"] },
    },
  ],
  webServer: {
    command: `node tests/e2e/preparar-bd.mjs && npx next dev -p ${PUERTO}`,
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: { DATABASE_URL: `file:${BD_E2E}` },
  },
});
