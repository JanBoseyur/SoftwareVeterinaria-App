'use client';

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  async function handle() {
    await fetch('/api/auth/logout', { method: 'POST' });
    location.href = '/login';
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handle}
    >
      <LogOut className="h-4 w-4" />
      Cerrar sesión
    </Button>
  );
}
    