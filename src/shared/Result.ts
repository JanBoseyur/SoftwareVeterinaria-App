/**
 * Módulo compartido: Result
 * 
 * Patrón Result Type (inspirado en lenguajes como Rust).
 * 
 * Responsabilidad:
 * - Representar el resultado de una operación que puede
 *   devolver un valor válido (ok) o un error controlado (err).
 * - Evitar el uso excesivo de `throw`/`catch` en la aplicación,
 *   permitiendo a los casos de uso devolver errores de forma explícita.
 *
 * Notas:
 * - Muy usado en los casos de uso (`LoginUser`, `RegisterUser`) para
 *   devolver errores como `EMAIL_IN_USE`, `INVALID_CREDENTIALS`, etc.
 * - Se puede combinar con `switch` o `if` para manejar resultados
 *   de forma clara y tipada.
 */

/** Resultado exitoso con valor de tipo `T`. */
export type Ok<T> = { ok: true; value: T };

/** Resultado con error de tipo `E` (por defecto `string`). */
export type Err<E = string> = { ok: false; error: E };

/** Union type: un resultado puede ser éxito (Ok) o fallo (Err). */
export type Result<T, E = string> = Ok<T> | Err<E>;

/**
 * Crea un resultado exitoso.
 * @param v Valor de tipo `T`.
 * @returns Objeto `{ ok: true, value: v }`.
 *
 * Ejemplo:
 * ```ts
 * return ok({ userId: "123" });
 * ```
 */
export const ok = <T>(v: T): Ok<T> => ({ ok: true, value: v });

/**
 * Crea un resultado de error.
 * @param e Error de tipo `E` (string por defecto).
 * @returns Objeto `{ ok: false, error: e }`.
 *
 * Ejemplo:
 * ```ts
 * return err("EMAIL_IN_USE");
 * ```
 */
export const err = <E>(e: E): Err<E> => ({ ok: false, error: e });
