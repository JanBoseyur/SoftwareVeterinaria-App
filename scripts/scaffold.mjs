// scripts/scaffold.mjs
import { promises as fs } from "node:fs";
import path from "node:path";
const root = process.cwd();

const steps = {
  prisma: [ "prisma/schema.prisma" ],
  env:    [ ".env.example" ],

  domain: [
    "src/domain/entities/User.ts",
    "src/domain/value-objects/Credentials.ts",
    "src/domain/ports.ts",
  ],
  application: [
    "src/application/use-cases/registerUser.ts",
    "src/application/use-cases/loginUser.ts",
    "src/application/use-cases/logoutUser.ts",
    "src/application/use-cases/listUsers.ts",
  ],
  infrastructure: [
    "src/infrastructure/adapters/InMemoryUserRepository.ts",
    "src/infrastructure/adapters/SimplePasswordHasher.ts",
    "src/infrastructure/adapters/InMemoryTokenService.ts",
  ],
  lib: [
    "src/lib/container.ts",
    "src/lib/http.ts",
  ],
  api: [
    "src/app/api/auth/login/route.ts",
    "src/app/api/auth/register/route.ts",
    "src/app/api/auth/logout/route.ts",
    "src/app/api/users/route.ts",
  ],
  ui: [
    "src/app/(auth)/login/page.tsx",
    "src/app/(auth)/register/page.tsx",
    "src/app/dashboard/page.tsx",
    "src/app/page.tsx",
    "src/components/auth/LoginForm.tsx",
    "src/components/auth/RegisterForm.tsx",
  ],
  middleware: [
    "src/middleware.ts",
  ],
};

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }
async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }
async function touch(file) {
  if (await exists(file)) return;             // NO sobrescribe
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, "");               // archivo vacío
}

const arg = process.argv[2];
if (!arg || arg === "help") {
  console.log("Uso: node scripts/scaffold.mjs <domain|application|infrastructure|lib|api|ui|middleware|all>");
  process.exit(0);
}

async function run(kind) {
  const files = steps[kind] || [];
  for (const f of files) await touch(path.join(root, f));
  console.log(`✓ ${kind}: ${files.length} archivos creados (si no existían).`);
}

if (arg === "all") {
  for (const k of Object.keys(steps)) await run(k);
} else if (steps[arg]) {
  await run(arg);
} else {
  console.error("Paso desconocido:", arg);
  process.exit(1);
}
