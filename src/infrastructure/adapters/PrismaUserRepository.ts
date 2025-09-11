import { PrismaClient } from '@prisma/client';
import { UserRepository, PublicUserDTO } from '@/application/ports/UserRepository';
import { User } from '@/domain/entities/User';

// Evita múltiples instancias en dev con hot-reload
const prisma: PrismaClient =
  (global as any).prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma;

export class PrismaUserRepository implements UserRepository {
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

  // 👇 NUEVO: lista usuarios sin el hash (para demo/pruebas)
  async listPublic(): Promise<PublicUserDTO[]> {
    const rows = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true }, // sin passwordHash
      orderBy: { createdAt: 'desc' },
    });
    return rows as PublicUserDTO[];
  }
}
