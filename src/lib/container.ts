import { PrismaUserRepository } from '@/infrastructure/adapters/PrismaUserRepository';
import { NodeCryptoPasswordHasher } from '@/infrastructure/adapters/NodeCryptoPasswordHasher';
import { JwtTokenService } from '@/infrastructure/adapters/JwtTokenService';
import { LoginUser } from '../application/use-cases/loginUser';
import { RegisterUser } from '../application/use-cases/registerUser';
import { ListUsers } from '../application/use-cases/listUsers';

export function makeListUsers() {
  const repo = new PrismaUserRepository();
  return new ListUsers(repo);
}


export function makeLoginUser() {
  const repo = new PrismaUserRepository();
  const hasher = new NodeCryptoPasswordHasher();
  const tokens = new JwtTokenService(process.env.ACCESS_SECRET!);
  return new LoginUser(repo, hasher, tokens);
}

export function makeRegisterUser() {
  const repo = new PrismaUserRepository();
  const hasher = new NodeCryptoPasswordHasher();
  return new RegisterUser(repo, hasher);
}
