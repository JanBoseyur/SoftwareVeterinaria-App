
'use client'
import LogoutButton from '@/components/auth/LogoutButton';
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart as RLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Dog,
  Cat,
  CalendarClock,
  Syringe,
  Search,
  Stethoscope,
  ChevronRight,
  PawPrint,
  AlertTriangle,
  Clock,
} from "lucide-react";

// Tipos de props
export type KPIIcon = "PawPrint" | "CalendarClock" | "Syringe";
export interface KPI {
  label: string;
  value: number;
  delta: string;
  icon: KPIIcon;
}

export default function DashboardClient({
  kpis,
  citasHoy,
  proximasVacunas,
  productividadVets,
  ingresosMensuales,
}: {
  kpis: KPI[];
  citasHoy: { id: string; hora: string; paciente: string; especie: "Canino" | "Felino"; tutor: string; vet: string; estado: string; }[];
  proximasVacunas: { paciente: string; especie: "Canino" | "Felino"; vacuna: string; fecha: string; riesgo: "alta" | "media" | "baja"; }[];
  productividadVets: { name: string; atenciones: number }[];
  ingresosMensuales: { mes: string; ingresos: number }[];
}) {
  const IconMap = {
    PawPrint: PawPrint,
    CalendarClock: CalendarClock,
    Syringe: Syringe,
  } as const;

  return (
    <main className="px-4 py-6 md:px-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Stethoscope className="h-6 w-6" /> Panel de la Clínica
          </h1>
          <p className="text-sm text-muted-foreground">
            Vista general del día. Gestiona pacientes, citas y recordatorios.
          </p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Buscar paciente, tutor, cita…" className="w-64" />
          <Button variant="default" className="gap-2">
            <Search className="h-4 w-4" /> Buscar
          </Button>
          <LogoutButton />
        </div>
      </header>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi, idx) => {
          const KIcon = IconMap[kpi.icon] ?? PawPrint;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx, type: "spring", stiffness: 120 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                  </CardTitle>
                  <KIcon className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.delta}</p>
                  <Progress value={Math.min(100, Math.max(10, (kpi.value as number) % 100))} className="mt-4" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </section>

      {/* Tabs principales */}
      <Tabs defaultValue="hoy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hoy">Hoy</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="analitica">Analítica</TabsTrigger>
        </TabsList>

        {/* HOY */}
        <TabsContent value="hoy" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Citas de hoy */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5" /> Citas de hoy
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  Ver agenda completa <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Especie</TableHead>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Veterinario</TableHead>
                      <TableHead className="text-right">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {citasHoy.map((cita) => (
                      <TableRow key={cita.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{cita.hora}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${cita.paciente}`} />
                            <AvatarFallback>
                              {cita.paciente.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {cita.paciente}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            {cita.especie === "Canino" ? (
                              <Dog className="h-4 w-4" />
                            ) : (
                              <Cat className="h-4 w-4" />
                            )}
                            {cita.especie}
                          </div>
                        </TableCell>
                        <TableCell>{cita.tutor}</TableCell>
                        <TableCell>{cita.vet}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              cita.estado === "Atendiendo"
                                ? "default"
                                : cita.estado === "En espera"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {cita.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Vacunas próximas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="h-5 w-5" /> Vacunas próximas (7 días)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {proximasVacunas.map((v, i) => (
                  <div key={v.paciente + i} className="flex items-center justify-between rounded-xl border p-3">
                    <div className="space-y-1">
                      <p className="font-medium flex items-center gap-2">
                        {v.especie === "Canino" ? <Dog className="h-4 w-4" /> : <Cat className="h-4 w-4" />} {v.paciente}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {v.vacuna} — {new Date(v.fecha).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {v.riesgo === "alta" && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" /> Alto
                        </Badge>
                      )}
                      {v.riesgo === "media" && <Badge>Medio</Badge>}
                      {v.riesgo === "baja" && <Badge variant="outline">Bajo</Badge>}
                      <Button size="sm" variant="outline" className="gap-1">
                        Agendar <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AGENDA */}
        <TabsContent value="agenda" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between sm:flex-row sm:items-center">
              <CardTitle>Agenda semanal por veterinario</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Exportar</Button>
                <Button size="sm">Nueva cita</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Dra. Silva", "Dr. Torres", "Dra. Molina"].map((vet) => (
                  <Card key={vet} className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-base">{vet}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Lun</span>
                        <Badge variant="outline">4 citas</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Mar</span>
                        <Badge variant="outline">5 citas</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Mié</span>
                        <Badge variant="outline">3 citas</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALÍTICA */}
        <TabsContent value="analitica" className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ingresos mensuales (MM$)</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={ingresosMensuales} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ingresos" strokeWidth={2} dot={false} />
                </RLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atenciones por día</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productividadVets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="atenciones" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer sutil */}
      <div className="text-xs text-muted-foreground text-center pt-2">
        © {new Date().getFullYear()} Clínica Veterinaria — Dashboard
      </div>
    </main>
  );
}