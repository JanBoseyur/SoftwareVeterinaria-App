import { PrismaClient } from '@prisma/client';
import { UserRepository, PublicUserDTO } from '@/application/ports/UserRepository';
import { User } from '@/domain/entities/User';

// Evita múltiples instancias de PrismaClient en desarrollo (hot-reload de Next.js)
const prisma: PrismaClient =
  (global as any).prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma;

/**
 * Adaptador de infraestructura: PrismaUserRepository
 *
 * Implementa el puerto `UserRepository` usando Prisma ORM.
 *
 * Responsabilidad:
 * - Encapsular las operaciones de persistencia relacionadas con la entidad `User`.
 * - Convertir datos crudos de la base de datos en entidades de dominio (`User`).
 * - Asegurar que la API solo devuelva información pública cuando corresponde.
 *
 * Notas:
 * - Cumple el principio DIP (Dependency Inversion): la capa de aplicación
 *   depende de la abstracción `UserRepository`, no de Prisma directamente.
 * - La validación de email/password se hace en la capa de aplicación,
 *   aquí solo se maneja persistencia.
 */
export class PrismaUserRepository implements UserRepository {
  /**
   * Busca un usuario por su email.
   * @param email Email único del usuario.
   * @returns Entidad `User` si existe, o `null` si no se encuentra.
   */
  async findByEmail(email: string): Promise<User | null> {
    const r = await prisma.user.findUnique({ where: { email } });
    return r
      ? new User({
          id: r.id,
          email: r.email,
          passwordHash: r.passwordHash,
          role: r.role as any,
          createdAt: r.createdAt,
        })
      : null;
  }

  async findById(id: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { id } });
    if (!u) return null;

    return new User({
      id: u.id,
      email: u.email,
      passwordHash: u.passwordHash,
      role: u.role as any,
      createdAt: u.createdAt,
    });
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param data Objeto con id, email, passwordHash, rol (opcional) y fecha de creación.
   * @returns Entidad `User` creada.
   *
   * Notas:
   * - Siempre se almacena la contraseña hasheada.
   * - El rol por defecto es `RECEPTION` si no se especifica.
   */
  async create(data: {
    id: string;
    email: string;
    passwordHash: string;
    role?: string;
    createdAt: Date;
  }): Promise<User> {
    const r = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? 'RECEPTION',
        createdAt: data.createdAt,
      },
    });
    return new User({
      id: r.id,
      email: r.email,
      passwordHash: r.passwordHash,
      role: r.role as any,
      createdAt: r.createdAt,
    });
  }

  /**
   * Lista todos los usuarios en formato público (DTO),
   * excluyendo `passwordHash`.
   * @returns Arreglo de `PublicUserDTO` ordenados por fecha de creación descendente.
   *
   * Ejemplo:
   * ```json
   * [
   *   { "id": "uuid-1", "email": "admin@x.com", "role": "ADMIN", "createdAt": "..." },
   *   { "id": "uuid-2", "email": "vet@y.com", "role": "VET", "createdAt": "..." }
   * ]
   * ```
   */
  async listPublic(): Promise<PublicUserDTO[]> {
    const rows = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true }, // excluye passwordHash
      orderBy: { createdAt: 'desc' },
    });
    return rows as PublicUserDTO[];
  }
}
