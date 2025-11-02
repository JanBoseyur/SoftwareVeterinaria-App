export interface TokenService {
  issue(userId: string): Promise<string>;
  verify(token: string): Promise<{ valid: boolean; userId?: string }>;
}
