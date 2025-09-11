import { PasswordHasher } from '@/application/ports/PasswordHasher';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

export class NodeCryptoPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    const iterations = 100_000;
    const digest = 'sha256';
    const salt = randomBytes(16);
    const key = pbkdf2Sync(plain, salt, iterations, 32, digest);
    return `${iterations}:${digest}:${salt.toString('hex')}:${key.toString('hex')}`;
  }

  async verify(plain: string, stored: string): Promise<boolean> {
    const [iterStr, digest, saltHex, keyHex] = stored.split(':');
    if (!iterStr || !digest || !saltHex || !keyHex) return false;
    const iterations = parseInt(iterStr, 10);
    const salt = Buffer.from(saltHex, 'hex');
    const key = Buffer.from(keyHex, 'hex');
    const derived = pbkdf2Sync(plain, salt, iterations, key.length, digest);
    return timingSafeEqual(derived, key);
  }
}
