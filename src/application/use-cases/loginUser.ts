import { UserRepository } from '../ports/UserRepository';
import { PasswordHasher } from '../ports/PasswordHasher';
import { TokenService } from '../ports/TokenService';
import { Result, ok, err } from '../../shared/Result';

export interface LoginInput { email: string; password: string }
export interface LoginOutput { userId: string; token: string }

export class LoginUser {
  constructor(
    private repo: UserRepository,
    private hasher: PasswordHasher,
    private tokens: TokenService
  ) {}

  async exec(input: LoginInput): Promise<Result<LoginOutput>> {
    const user = await this.repo.findByEmail(input.email);
    if (!user) return err('INVALID_CREDENTIALS');

    const valid = await this.hasher.verify(input.password, user.passwordHash);
    if (!valid) return err('INVALID_CREDENTIALS');

    const token = await this.tokens.issue(user.id);
    return ok({ userId: user.id, token });
  }
}
