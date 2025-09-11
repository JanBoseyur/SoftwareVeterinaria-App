import { UserRepository } from '../ports/UserRepository';
import { PasswordHasher } from '../ports/PasswordHasher';
import { Result, ok, err } from '../../shared/Result';
import { randomUUID } from 'crypto';

export interface RegisterInput { email: string; password: string; role?: string }
export interface RegisterOutput { id: string; email: string; role?: string; createdAt: Date }

export class RegisterUser {
  constructor(private repo: UserRepository, private hasher: PasswordHasher) {}

  async exec(input: RegisterInput): Promise<Result<RegisterOutput>> {
    const exists = await this.repo.findByEmail(input.email);
    if (exists) return err('EMAIL_IN_USE');

    if (!/^\S+@\S+\.\S+$/.test(input.email)) return err('EMAIL_INVALID');
    if ((input.password ?? '').length < 8) return err('WEAK_PASSWORD');

    const passwordHash = await this.hasher.hash(input.password);
    const now = new Date();

    const user = await this.repo.create({
      id: randomUUID(),
      email: input.email,
      passwordHash,
      role: input.role ?? 'RECEPTION',
      createdAt: now,
    });

    return ok(user.toPublicDTO());
  }
}
