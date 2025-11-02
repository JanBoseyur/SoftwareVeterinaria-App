'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, UserPlus, Loader2 } from 'lucide-react';

type Role = 'RECEPTION' | 'VET' | 'ADMIN';

export default function RegisterForm() {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('RECEPTION');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    setLoading(true);

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
    setTimeout(()=> r.replace('/login'), 900);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
          <CardDescription>Registra un usuario para acceder al panel.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="ejemplo@clinic.cl"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={role} onValueChange={(v)=>setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECEPTION">Recepción</SelectItem>
                  <SelectItem value="VET">Veterinario/a</SelectItem>
                  <SelectItem value="ADMIN">Administrador/a</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {ok && (
              <Alert className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>Usuario creado. Redirigiendo…</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creando…' : 'Crear cuenta'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="font-medium text-primary underline">
                Inicia sesión
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
