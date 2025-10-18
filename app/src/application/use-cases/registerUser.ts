import { UserRepository } from '../ports/UserRepository';
import { PasswordHasher } from '../ports/PasswordHasher';
import { Result, ok, err } from '../../shared/Result';
import { randomUUID } from 'crypto';

export interface RegisterInput {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterOutput {
  id: string;
  email: string;
  role?: string;
  createdAt: Date;
}

/**
 * Caso de uso: Registrar usuario.
 *
 * Responsabilidad:
 * - Validar datos de entrada (unicidad, formato de email, fuerza de contraseña).
 * - Generar un hash seguro de la contraseña antes de persistir.
 * - Crear y guardar la entidad `User` en el repositorio.
 * - Retornar solo datos públicos (sin exponer `passwordHash`).
 *
 * Reglas de negocio:
 * - Email debe ser único → si ya existe, error `EMAIL_IN_USE`.
 * - Email debe tener formato válido → error `EMAIL_INVALID`.
 * - Password debe tener mínimo 8 caracteres → error `WEAK_PASSWORD`.
 * - Rol por defecto = `RECEPTION` si no se especifica.
 *
 * Notas:
 * - El ID se genera con `randomUUID()` (independiente de la DB).
 * - El caso de uso no conoce Prisma ni hashing concreto,
 *   depende de `UserRepository` y `PasswordHasher`.
 */
export class RegisterUser {
  constructor(
    private repo: UserRepository,
    private hasher: PasswordHasher
  ) {}

  /**
   * Ejecuta el registro de un nuevo usuario.
   * @param input Datos de entrada (email, password, rol?).
   * @returns Result con:
   *  - `ok(RegisterOutput)` si el usuario fue creado correctamente.
   *  - `err('EMAIL_IN_USE' | 'EMAIL_INVALID' | 'WEAK_PASSWORD')` en caso de fallo.
   *
   * Ejemplo:
   * ```ts
   * const res = await registerUser.exec({
   *   email: "nuevo@ejemplo.com",
   *   password: "Secreta123",
   * });
   * if (res.ok) console.log("Usuario registrado:", res.value);
   * ```
   */
  async exec(input: RegisterInput): Promise<Result<RegisterOutput>> {
    // 1) Validar que el email no esté en uso
    const exists = await this.repo.findByEmail(input.email);
    if (exists) return err('EMAIL_IN_USE');

    // 2) Validaciones de formato de email y fuerza de contraseña
    if (!/^\S+@\S+\.\S+$/.test(input.email)) return err('EMAIL_INVALID');
    if ((input.password ?? '').length < 8) return err('WEAK_PASSWORD');

    // 3) Hashear contraseña
    const passwordHash = await this.hasher.hash(input.password);

    // 4) Construir y persistir usuario
    const now = new Date();
    const user = await this.repo.create({
      id: randomUUID(),
      email: input.email,
      passwordHash,
      role: input.role ?? 'RECEPTION',
      createdAt: now,
    });

    // 5) Retornar DTO público (sin passwordHash)
    return ok(user.toPublicDTO());
  }
}
