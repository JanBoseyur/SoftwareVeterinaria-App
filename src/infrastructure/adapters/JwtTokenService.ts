// src/infrastructure/adapters/JwtTokenService.ts
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { TokenService } from '../../application/ports/TokenService';

export class JwtTokenService implements TokenService {
  constructor(
    private accessSecret: Secret,
    private expiresIn: number | `${number}${'s'|'m'|'h'|'d'}` = '15m' // restringe al tipo correcto
  ) {}

  async issue(userId: string): Promise<string> {
    const payload: JwtPayload = { sub: userId };
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.accessSecret, options);
  }

  async verify(token: string) {
    try {
      const decoded = jwt.verify(token, this.accessSecret) as JwtPayload | string;
      const userId =
        typeof decoded === 'string' ? decoded : (decoded.sub as string | undefined);
      return userId ? { valid: true, userId } : { valid: false };
    } catch {
      return { valid: false };
    }
  }
}
