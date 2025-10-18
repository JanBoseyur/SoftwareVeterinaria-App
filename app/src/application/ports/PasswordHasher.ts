/**
 * Puerto de la capa de aplicación: PasswordHasher
 *
 * Responsabilidad:
 * - Definir la abstracción para el servicio de hashing de contraseñas.
 * - Separa la lógica de aplicación de los detalles de infraestructura
 *   (PBKDF2, bcrypt, Argon2, etc.).
 *
 * Notas:
 * - El caso de uso depende de esta interfaz, no de una implementación concreta.
 * - Implementaciones concretas (adaptadores) pueden vivir en
 *   `src/infrastructure/adapters/NodeCryptoPasswordHasher.ts` u otras.
 */
export interface PasswordHasher {
  /**
   * Genera un hash seguro a partir de la contraseña en texto plano.
   * @param plain Contraseña en texto plano (no validada aún).
   * @returns Promise<string> Representación encriptada y versionable del password.
   */
  hash(plain: string): Promise<string>;

  /**
   * Verifica una contraseña en texto plano contra su hash almacenado.
   * @param plain Contraseña ingresada por el usuario.
   * @param hash Hash previamente generado y guardado en DB.
   * @returns Promise<boolean> True si coinciden; false en cualquier otro caso.
   */
  verify(plain: string, hash: string): Promise<boolean>;
}
