'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'RECEPTION'|'VET'|'ADMIN'>('RECEPTION');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setOk(false); setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    setLoading(false);

    const j = await res.json().catch(()=> ({}));
    if (!res.ok) {
      setError(j.error ?? 'No se pudo registrar');
      return;
    }

    setOk(true);
    // si quieres redirigir de inmediato al login:
    setTimeout(()=> r.replace('/(auth)/login'), 900);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-24 w-full max-w-sm space-y-4 rounded-2xl border p-6 shadow-sm">
      <h1 className="text-center text-2xl font-semibold">Crear cuenta</h1>

      <label className="block text-sm">
        Email
        <input
          className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring"
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
      </label>

      <label className="block text-sm">
        Contraseña
        <input
          className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring"
          type="password"
          minLength={8}
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
        <span className="text-xs text-gray-500">Mínimo 8 caracteres.</span>
      </label>

      <label className="block text-sm">
        Rol
        <select
          className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring"
          value={role}
          onChange={(e)=>setRole(e.target.value as any)}
        >
          <option value="RECEPTION">Recepción</option>
          <option value="VET">Veterinario/a</option>
          <option value="ADMIN">Administrador/a</option>
        </select>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {ok && <p className="text-sm text-green-600">Usuario creado. Redirigiendo…</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Creando…' : 'Crear cuenta'}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="font-medium underline">Inicia sesión</a>
      </p>
    </form>
  );
}
