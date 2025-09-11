import { UserRepository, PublicUserDTO } from '@/application/ports/UserRepository';
export class ListUsers {
  constructor(private repo: UserRepository) {}
  async exec(): Promise<PublicUserDTO[]> {
    return this.repo.listPublic();
  }
}
