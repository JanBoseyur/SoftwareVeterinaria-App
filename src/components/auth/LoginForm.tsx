'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const r = useRouter();
  const [email, setEmail] = useState('demo@clinic.cl');
  const [password, setPassword] = useState('Secreta123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? 'No se pudo iniciar sesión');
      return;
    }

    // Cookie HttpOnly ya quedó puesta por el endpoint
    r.replace('/dashboard');
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-24 w-full max-w-sm space-y-4 rounded-2xl border p-6 shadow-sm">
      <h1 className="text-center text-2xl font-semibold">Ingresar a la Clínica</h1>

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
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Ingresando…' : 'Ingresar'}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <a href="/register" className="font-medium underline">Regístrate</a>
      </p>
    </form>
  );
}
