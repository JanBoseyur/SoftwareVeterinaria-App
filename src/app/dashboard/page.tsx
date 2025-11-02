
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";

import HomeVet from "@/components/vet/home";
import HomeAdmin from "@/components/admin/home";
import HomeReception from "@/components/reception/home";

import LogoutButton from '@/components/auth/LogoutButton';

import { GetCurrentUserUseCase } from "@/application/use-cases/GetCurrentUserUseCase.ts";
import { PrismaUserRepository } from "@/infrastructure/adapters/PrismaUserRepository";

export const runtime = "nodejs";

// Datos mock en el server (luego los cambias por fetch a DB/API)
const kpis = [
{ label: "Pacientes activos", value: 342, delta: "+12 vs. mes pasado", icon: "PawPrint" as const },
{ label: "Citas hoy", value: 19, delta: "5 pendientes", icon: "CalendarClock" as const },
{ label: "Vacunas próximas (7d)", value: 27, delta: "3 atrasadas", icon: "Syringe" as const },
];

const citasHoy = [
{ id: "CITA-001", hora: "09:00", paciente: "Luna", especie: "Canino", tutor: "María P.", vet: "Dra. Silva", estado: "En espera" },
{ id: "CITA-002", hora: "09:30", paciente: "Milo", especie: "Felino", tutor: "Rodrigo L.", vet: "Dr. Torres", estado: "Atendiendo" },
{ id: "CITA-003", hora: "10:15", paciente: "Rocky", especie: "Canino", tutor: "Ana C.", vet: "Dra. Silva", estado: "Confirmada" },
];

const proximasVacunas = [
{ paciente: "Bambi", especie: "Canino", vacuna: "Antirrábica", fecha: "2025-09-23", riesgo: "media" },
{ paciente: "Nina", especie: "Felino", vacuna: "Triple Felina", fecha: "2025-09-23", riesgo: "alta" },
{ paciente: "Tom", especie: "Felino", vacuna: "Antirrábica", fecha: "2025-09-25", riesgo: "baja" },
{ paciente: "Kira", especie: "Canino", vacuna: "Octuple", fecha: "2025-09-26", riesgo: "media" },
];

const productividadVets = [
{ name: "Lun", atenciones: 22 },
{ name: "Mar", atenciones: 28 },
{ name: "Mié", atenciones: 24 },
{ name: "Jue", atenciones: 31 },
{ name: "Vie", atenciones: 17 },
{ name: "Sáb", atenciones: 9 },
];

const ingresosMensuales = [
{ mes: "May", ingresos: 2.8 },
{ mes: "Jun", ingresos: 3.2 },
{ mes: "Jul", ingresos: 3.0 },
{ mes: "Ago", ingresos: 3.7 },
{ mes: "Sep", ingresos: 4.1 },
];

export default async function DashboardPage() {
  const userId = await getCurrentUserId();

    if (!userId) redirect("/(auth)/login");

    const userRepo = new PrismaUserRepository();
    const getCurrentUser = new GetCurrentUserUseCase(userRepo);

    const user = await getCurrentUser.execute(userId);
    if (!user) redirect("/(auth)/login");

        if (user.role === "VET") {
        return (
            <HomeVet 
                user = {{id: user.id,name: user.name,email: user.email, role: user.role}}
                kpis = {kpis}
                citasHoy = {citasHoy}
                proximasVacunas = {proximasVacunas}
                productividadVets = {productividadVets}
                ingresosMensuales = {ingresosMensuales}
            />
            );
        }

        if (user.role === "ADMIN") {
            return <HomeAdmin/>;
        }

        if (user.role === "RECEPTION") {
            return <HomeReception/>;
        }

    redirect("/not-authorized");
}