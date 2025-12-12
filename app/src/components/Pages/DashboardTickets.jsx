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
 
  const [rankingTech, setRankingTech] = useState([]);

  const [loading, setLoading] = useState(true);

  const getColor = () => `hsl(${Math.random() * 360}, 70%, 55%)`;

  useEffect(() => {
    const loadData = async () => {
      try {
        const r1 = await Dashboard.TicketsPerMonth();
        const r2 = await Dashboard.CantTicketsPerState();
        const r3 = await Dashboard.PromedioValoraciones();
     
        const r5 = await Dashboard.RankingTechByCump();

        setTicketsMonth(r1?.data?.data || []);
        setTicketsState(r2?.data?.data || []);
        setValoraciones(r3?.data?.data || []);
      
        setRankingTech(r5?.data?.data || []);
      } catch (err) {
        console.error("Error:", err);
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
                <XAxis dataKey="Mes" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Total_Tickets"
                  stroke="#00bcd4"
                  strokeWidth={3}
                  name="Total Tickets"
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
                <XAxis dataKey="Estado" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Total_Tickets"
                  fill="#8884d8"
                  radius={[5, 5, 0, 0]}
                  name="Total Tickets"
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
                <YAxis stroke="#ccc" domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="PromedioValoracion"
                  fill="#00c49f"
                  radius={[5, 5, 0, 0]}
                  name="Promedio"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

     

           <Card className="bg-neutral-900 border border-gray-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">
            Ranking Técnicos por Cumplimiento SLA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer>
              <BarChart 
                data={[...rankingTech].sort((a, b) => 
                  b.PorcentajeCumplimientoResolucion - a.PorcentajeCumplimientoResolucion
                )}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  stroke="#ccc"
                />
                <YAxis 
                  type="category" 
                  dataKey="Tecnico" 
                  stroke="#ccc"
                  width={120}
                />
                <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #444' }} />
                <Legend />
                <Bar
                  dataKey="PorcentajeCumplimientoResolucion"
                  radius={[0, 5, 5, 0]}
                  name="% Cumplimiento Resolución"
                >
                  {rankingTech.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.PorcentajeCumplimientoResolucion >= 90 ? '#00c49f' :
                        entry.PorcentajeCumplimientoResolucion >= 80 ? '#ffbb28' :
                        '#ff7300'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}