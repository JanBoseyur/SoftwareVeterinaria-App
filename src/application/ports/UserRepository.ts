import { User } from '@/domain/entities/User';

/**
 * DTO público de usuario (sin exponer información sensible).
 * Este tipo se devuelve hacia la UI o la API.
 */
export interface PublicUserDTO {
  id: string;
  email: string;
  role?: string;
  createdAt: Date;
}

/**
 * Puerto de la capa de aplicación: UserRepository
 *
 * Responsabilidad:
 * - Definir las operaciones de persistencia necesarias para
 *   trabajar con la entidad `User` desde los casos de uso.
 * - Ocultar detalles de infraestructura (Prisma, SQL, Mongo, etc.).
 *
 * Notas:
 * - El caso de uso solo conoce esta interfaz; no sabe ni importa
 *   cómo se implementa (DIP de SOLID).
 * - Adaptadores concretos viven en `src/infrastructure/adapters/PrismaUserRepository.ts`
 *   u otros repositorios que cumplan con este contrato.
 */
export interface UserRepository {
  /**
   * Busca un usuario por su email.
   * @param email Email único del usuario.
   * @returns Promesa con la entidad `User` encontrada, o null si no existe.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Crea un nuevo usuario en la persistencia.
   * @param data Objeto con id, email, hash de la contraseña, rol y fecha de creación.
   * @returns Promesa con la entidad `User` creada.
   */
  create(data: {
    id: string;
    email: string;
    passwordHash: string;
    role?: string;
    createdAt: Date;
  }): Promise<User>;

  /**
   * Lista todos los usuarios en formato DTO público.
   * Regla: nunca se expone `passwordHash`.
   * @returns Promesa con un arreglo de usuarios seguros para enviar a la UI.
   */
  listPublic(): Promise<PublicUserDTO[]>;
}
