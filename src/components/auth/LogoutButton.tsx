'use client';
export default function LogoutButton(){
  async function handle() {
    await fetch('/api/auth/logout', { method:'POST' });
    location.href='/login';
  }
  return <button onClick={handle} className="px-3 py-2 rounded bg-gray-200">Cerrar sesión</button>;
}
