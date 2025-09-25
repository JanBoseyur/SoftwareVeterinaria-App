import type { Role } from '../types/Role';

/**
 * Props que definen un Usuario en el dominio.
 * 
 * Notas:
 * - `passwordHash` siempre se guarda en formato encriptado (nunca texto plano).
 * - `role` es opcional; si no se indica, se asigna `RECEPTION` por defecto.
 */
export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  role?: Role;
  createdAt: Date;
}

/**
 * Entidad de dominio: Usuario.
 *
 * Responsabilidad:
 * - Representar un usuario en el sistema con sus atributos principales.
 * - Garantizar invariantes de dominio (ej: email válido).
 * - Exponer métodos seguros como `toPublicDTO()` que ocultan datos sensibles.
 *
 * Invariantes:
 * - `email` debe cumplir formato válido (regex básica).
 * - `passwordHash` nunca se expone fuera de la entidad.
 */
export class User {
  constructor(private props: UserProps) {
    // Validación de invariante: email con formato válido
    if (!/^\S+@\S+\.\S+$/.test(props.email)) {
      throw new Error('EMAIL_INVALID');
    }
  }

  /** Identificador único del usuario (UUID). */
  get id() { return this.props.id }

  /** Email del usuario (garantizado válido). */
  get email() { return this.props.email }

  /** Hash seguro de la contraseña (no se expone fuera del dominio). */
  get passwordHash() { return this.props.passwordHash }

  /** Rol del usuario (por defecto 'RECEPTION' si no se especifica). */
  get role() { return this.props.role ?? 'RECEPTION' }

  /** Fecha de creación del usuario. */
  get createdAt() { return this.props.createdAt }

  /**
   * Devuelve un DTO público seguro (sin exponer `passwordHash`).
   * Útil para respuestas de API o vistas.
   * @returns Objeto con { id, email, role, createdAt }
   */
  toPublicDTO() {
    const { id, email, role, createdAt } = this.props;
    return { id, email, role, createdAt };
  }
}
