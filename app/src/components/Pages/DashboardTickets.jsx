import { useEffect, useState } from "react";
import Dashboard from "../../Services/Dashboard";
import {
  LineChart,
  Line,
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { toast } from "react-hot-toast";

export function Dashboards() {
  const [ticketsMonth, setTicketsMonth] = useState([]);
  const [ticketsState, setTicketsState] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [categoriasIncum, setCategoriasIncum] = useState([]);
  const [rankingTech, setRankingTech] = useState([]);

  const [loading, setLoading] = useState(true);

  const getColor = () =>
    `hsl(${Math.random() * 360}, 70%, 55%)`;

  useEffect(() => {
    const loadData = async () => {
      try {
        const r1 = await Dashboard.TicketsPerMonth();
        const r2 = await Dashboard.CantTicketsPerState();
        const r3 = await Dashboard.PromedioValoraciones();
        const r4 = await Dashboard.CategoriasConInco();
        const r5 = await Dashboard.RankingTechByCump();

        setTicketsMonth(r1?.data?.data || []);
        setTicketsState(r2?.data?.data || []);
        setValoraciones(r3?.data?.data || []);
        setCategoriasIncum(r4?.data?.data || []);
        setRankingTech(r5?.data?.data || []);
      } catch (err) {
        toast.error("Error cargando datos del Dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Cargando reportes...
      </div>
    );

  return (
    <div className="min-h-screen p-6 space-y-10 bg-black text-gray-100">

      {/* ---------------------------------------------------------------- */}
      {/* 1. TICKETS POR MES */}
      {/* ---------------------------------------------------------------- */}
      <Card className="bg-neutral-900 border border-gray-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Tickets por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <LineChart data={ticketsMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="mes" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#00bcd4"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>


      {/* ---------------------------------------------------------------- */}
      {/* 2. TICKETS POR ESTADO */}
      {/* ---------------------------------------------------------------- */}
      <Card className="bg-neutral-900 border border-gray-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Tickets por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer>
              <BarChart data={ticketsState}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="estado" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="cantidad"
                  fill="#8884d8"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* 3. PROMEDIO DE VALORACIONES */}
      {/* ---------------------------------------------------------------- */}
      <Card className="bg-neutral-900 border border-gray-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Promedio de Valoraciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={valoraciones}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="categoria" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="promedio"
                  fill="#00c49f"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* 4. CATEGORÍAS CON MAYOR INCUMPLIMIENTO */}
      {/* ---------------------------------------------------------------- */}
      <Card className="bg-neutral-900 border border-gray-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Categorías con Incumplimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoriasIncum}
                  dataKey="incumplimientos"
                  nameKey="categoria"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {categoriasIncum.map((_, i) => (
                    <Cell key={i} fill={getColor()} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* 5. RANKING TÉCNICOS POR CUMPLIMIENTO */}
      {/* ---------------------------------------------------------------- */}
      <Card className="bg-neutral-900 border border-gray-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Ranking Técnicos por Cumplimiento SLA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer>
              <BarChart data={rankingTech}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="tecnico" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="cumplimiento"
                  fill="#ff7300"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
