// src/infrastructure/adapters/JwtTokenService.ts
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { TokenService } from '../../application/ports/TokenService';

/**
 * Adaptador de infraestructura: JwtTokenService
 *
 * Implementa el puerto `TokenService` usando la librería `jsonwebtoken`.
 *
 * Responsabilidad:
 * - Emitir tokens de acceso firmados (JWT) con un tiempo de expiración definido.
 * - Verificar la validez de un token y extraer el `userId` (campo `sub`).
 *
 * Notas:
 * - La clave secreta (`accessSecret`) se inyecta desde configuración/entorno.
 * - El campo `sub` en el payload se usa para guardar el `userId` del usuario autenticado.
 * - Maneja errores de verificación devolviendo `{ valid: false }`.
 */
export class JwtTokenService implements TokenService {
  constructor(
    private accessSecret: Secret,
    private expiresIn: number | `${number}${'s'|'m'|'h'|'d'}` = '15m' // Ej: '15m', '1h', '7d'
  ) {}

  /**
   * Emite un nuevo token de sesión para el usuario indicado.
   * @param userId Identificador único del usuario (UUID).
   * @returns Token JWT firmado con `sub = userId`.
   *
   * Ejemplo de uso:
   * ```ts
   * const token = await tokens.issue("uuid-123");
   * ```
   */
  async issue(userId: string): Promise<string> {
    const payload: JwtPayload = { sub: userId };
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.accessSecret, options);
  }

  /**
   * Verifica la validez de un token JWT.
   * @param token Token JWT recibido (ej. desde cookie o header).
   * @returns Objeto `{ valid: true, userId }` si el token es válido,
   *          o `{ valid: false }` si es inválido o expirado.
   */
  async verify(token: string) {
    try {
      const decoded = jwt.verify(token, this.accessSecret) as JwtPayload | string;

      const userId =
        typeof decoded === 'string'
          ? decoded
          : (decoded.sub as string | undefined);

      return userId ? { valid: true, userId } : { valid: false };
    } catch {
      // Captura errores de expiración o firma incorrecta
      return { valid: false };
    }
  }
  
}
