import type { Role } from '../types/Role';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  role?: Role;
  createdAt: Date;
}

export class User {
  constructor(private props: UserProps) {
    if (!/^\S+@\S+\.\S+$/.test(props.email)) throw new Error('EMAIL_INVALID');
  }
  get id(){ return this.props.id }
  get email(){ return this.props.email }
  get passwordHash(){ return this.props.passwordHash }
  get role(){ return this.props.role ?? 'RECEPTION' }
  get createdAt(){ return this.props.createdAt }

  toPublicDTO(){ const { id, email, role, createdAt } = this.props; return { id, email, role, createdAt }; }
}
