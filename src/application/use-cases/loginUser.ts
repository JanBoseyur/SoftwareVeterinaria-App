import { UserRepository } from '../ports/UserRepository';
import { PasswordHasher } from '../ports/PasswordHasher';
import { TokenService } from '../ports/TokenService';
import { Result, ok, err } from '../../shared/Result';

export interface LoginInput { email: string; password: string }
export interface LoginOutput { userId: string; token: string }

/**
 * Caso de uso: Autenticar usuario (Login).
 *
 * Responsabilidad:
 * - Verificar que el usuario exista en el repositorio.
 * - Validar que la contraseña ingresada coincida con el hash almacenado.
 * - Emitir un token de sesión (ej. JWT) al autenticarse correctamente.
 *
 * Reglas:
 * - Si el email no existe o la contraseña no es válida → `INVALID_CREDENTIALS`.
 * - Si las credenciales son correctas → se retorna un token y el `userId`.
 *
 * Notas:
 * - El caso de uso no sabe nada de Prisma ni de cómo se generan los tokens.
 *   Depende solo de las abstracciones: `UserRepository`, `PasswordHasher`,
 *   `TokenService`.
 * - Aplica DIP (Dependency Inversion Principle).
 */
export class LoginUser {
  constructor(
    private repo: UserRepository,
    private hasher: PasswordHasher,
    private tokens: TokenService
  ) {}

  /**
   * Ejecuta el proceso de login.
   * @param input Email y contraseña en texto plano.
   * @returns Result<LoginOutput> con:
   *  - `ok({ userId, token })` si la autenticación fue exitosa.
   *  - `err('INVALID_CREDENTIALS')` en caso de error controlado.
   *
   * Ejemplo de uso:
   * ```ts
   * const result = await loginUser.exec({ email: "a@b.com", password: "Secret123" });
   * if (result.ok) console.log(result.value.token);
   * ```
   */
  async exec(input: LoginInput): Promise<Result<LoginOutput>> {
    // 1) Buscar usuario por email
    const user = await this.repo.findByEmail(input.email);
    if (!user) return err('INVALID_CREDENTIALS');

    // 2) Verificar contraseña con el hasher
    const valid = await this.hasher.verify(input.password, user.passwordHash);
    if (!valid) return err('INVALID_CREDENTIALS');

    // 3) Emitir token de sesión (ej. JWT) usando el servicio de tokens
    const token = await this.tokens.issue(user.id);

    // 4) Respuesta exitosa con userId y token
    return ok({ userId: user.id, token });
  }
}
