/**
 * Composition Root (Contenedor de dependencias)
 * Capa: Infra/UI (ensamblado)
 *
 * Responsabilidad:
 * - Construir casos de uso (Application) inyectando implementaciones concretas
 *   de los puertos (Infrastructure Adapters).
 * - Mantener a la UI (API routes / server actions) libre de detalles de
 *   infraestructura: la UI “pide” casos de uso ya configurados aquí.
 *
 * Notas:
 * - Aplica DIP (Dependency Inversion Principle): los casos de uso dependen
 *   de puertos; este archivo decide qué adaptadores concretos usar (Prisma,
 *   PBKDF2, JWT, etc.).
 * - `ACCESS_SECRET` debe estar definido en el entorno para JwtTokenService.
 */

import { PrismaUserRepository } from '@/infrastructure/adapters/PrismaUserRepository';
import { NodeCryptoPasswordHasher } from '@/infrastructure/adapters/NodeCryptoPasswordHasher';
import { JwtTokenService } from '@/infrastructure/adapters/JwtTokenService';

import { LoginUser } from '../application/use-cases/loginUser';
import { RegisterUser } from '../application/use-cases/registerUser';
import { ListUsers } from '../application/use-cases/listUsers';

/**
 * Factory: ListUsers
 * @returns instancia de `ListUsers` con `PrismaUserRepository`.
 */
export function makeListUsers() {
  const repo = new PrismaUserRepository();
  return new ListUsers(repo);
}

/**
 * Factory: LoginUser
 * Inyecta: UserRepository, PasswordHasher, TokenService.
 * @returns instancia de `LoginUser` lista para usar.
 */
export function makeLoginUser() {
  const repo = new PrismaUserRepository();
  const hasher = new NodeCryptoPasswordHasher();
  const secret = process.env.ACCESS_SECRET!;
  const tokens = new JwtTokenService(secret);
  return new LoginUser(repo, hasher, tokens);
}

/**
 * Factory: RegisterUser
 * Inyecta: UserRepository, PasswordHasher.
 * @returns instancia de `RegisterUser` lista para usar.
 */
export function makeRegisterUser() {
  const repo = new PrismaUserRepository();
  const hasher = new NodeCryptoPasswordHasher();
  return new RegisterUser(repo, hasher);
}
