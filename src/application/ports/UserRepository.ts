import { User } from '@/domain/entities/User';

export interface PublicUserDTO { id: string; email: string; role?: string; createdAt: Date }

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: { id: string; email: string; passwordHash: string; role?: string; createdAt: Date }): Promise<User>;
  listPublic(): Promise<PublicUserDTO[]>; // 👈 nuevo
}
