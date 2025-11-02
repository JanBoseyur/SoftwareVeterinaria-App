
// src/application/usecases/GetCurrentUserUseCase.ts
import { UserRepository } from "@/application/ports/UserRepository";
import { User } from "@/domain/entities/User";

export class GetCurrentUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string): Promise<User | null> {
    if (!userId) return null;
    const user = await this.userRepo.findById(userId);
    return user;
  }
}