import { PasswordHasher } from '@/application/ports/PasswordHasher';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Adaptador de infraestructura: NodeCryptoPasswordHasher
 *
 * Implementa el puerto `PasswordHasher` usando la librería estándar de Node.js (`crypto`).
 * 
 * Algoritmo:
 * - PBKDF2-HMAC-SHA256
 * - Iteraciones: 100,000
 * - Longitud de clave: 32 bytes
 * - Salt: 16 bytes aleatorios
 *
 * Formato de almacenamiento:
 * ```
 * iterations:digest:saltHex:keyHex
 * ```
 *
 * Notas de seguridad:
 * - Usa `randomBytes` para generar salt único por contraseña.
 * - Usa `timingSafeEqual` para comparar hashes de forma segura contra ataques de tiempo.
 * - Los parámetros (iteraciones, digest, longitud) quedan embebidos en el string → permite migraciones futuras.
 */
export class NodeCryptoPasswordHasher implements PasswordHasher {
  /**
   * Genera un hash seguro para una contraseña en texto plano.
   * @param plain Contraseña en texto plano.
   * @returns Promise<string> Hash en formato `iteraciones:digest:saltHex:keyHex`.
   *
   * Ejemplo:
   * ```ts
   * const hasher = new NodeCryptoPasswordHasher();
   * const hash = await hasher.hash("Secreta123");
   * console.log(hash); // "100000:sha256:abcd1234...:efgh5678..."
   * ```
   */
  async hash(plain: string): Promise<string> {
    const iterations = 100_000;
    const digest = 'sha256';
    const salt = randomBytes(16);
    const key = pbkdf2Sync(plain, salt, iterations, 32, digest);
    return `${iterations}:${digest}:${salt.toString('hex')}:${key.toString('hex')}`;
  }

  /**
   * Verifica si una contraseña en texto plano coincide con el hash almacenado.
   * @param plain Contraseña en texto plano (ingresada por el usuario).
   * @param stored Hash almacenado previamente en DB (formato estándar).
   * @returns Promise<boolean> True si coincide, false en caso contrario o formato inválido.
   *
   * Ejemplo:
   * ```ts
   * const ok = await hasher.verify("Secreta123", storedHash);
   * if (ok) console.log("Contraseña válida");
   * ```
   */
  async verify(plain: string, stored: string): Promise<boolean> {
    const [iterStr, digest, saltHex, keyHex] = stored.split(':');
    if (!iterStr || !digest || !saltHex || !keyHex) return false;

    const iterations = parseInt(iterStr, 10);
    const salt = Buffer.from(saltHex, 'hex');
    const key = Buffer.from(keyHex, 'hex');

    // Deriva una clave con los mismos parámetros
    const derived = pbkdf2Sync(plain, salt, iterations, key.length, digest);

    // Comparación segura
    return timingSafeEqual(derived, key);
  }
}
