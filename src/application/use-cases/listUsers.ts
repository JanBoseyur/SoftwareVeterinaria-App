import { UserRepository, PublicUserDTO } from '@/application/ports/UserRepository';

/**
 * Caso de uso: Listar usuarios.
 *
 * Responsabilidad:
 * - Recuperar la lista de usuarios desde el repositorio,
 *   devolviendo solo información pública (DTO) sin exponer
 *   el `passwordHash`.
 *
 * Notas:
 * - La lógica de filtrado de campos sensibles se garantiza en la
 *   implementación del repositorio (infraestructura).
 * - Aquí no hay reglas de negocio complejas; es un caso de uso
 *   simple de consulta.
 * - En un sistema más avanzado, podría validarse el rol del
 *   solicitante (ej: solo ADMIN puede listar usuarios).
 */
export class ListUsers {
  constructor(private repo: UserRepository) {}

  /**
   * Ejecuta la acción de listar usuarios.
   * @returns Promesa con un arreglo de `PublicUserDTO`.
   *
   * Ejemplo:
   * ```json
   * [
   *   { "id": "uuid-1", "email": "a@b.com", "role": "ADMIN", "createdAt": "..." },
   *   { "id": "uuid-2", "email": "b@c.com", "role": "VET", "createdAt": "..." }
   * ]
   * ```
   */
  async exec(): Promise<PublicUserDTO[]> {
    return this.repo.listPublic();
  }
}
