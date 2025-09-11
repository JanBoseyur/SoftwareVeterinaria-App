import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib/auth';
import LogoutButton from '@/components/auth/LogoutButton';

export const runtime = 'nodejs'; // usamos crypto/jwt en server

export default async function Dashboard() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/(auth)/login');

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Panel de la Clínica</h1>
        <LogoutButton />
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4">
          <h2 className="font-medium">Pacientes</h2>
          <p className="text-sm text-gray-600">Caninos, felinos y más</p>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-medium">Citas de hoy</h2>
          <p className="text-sm text-gray-600">Agenda por veterinario</p>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-medium">Vacunas próximas</h2>
          <p className="text-sm text-gray-600">Recordatorios</p>
        </div>
      </section>
    </main>
  );
}
