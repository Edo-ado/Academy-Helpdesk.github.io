import { useEffect, useState } from "react";
import RentalService from "../../services/RentalService";
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
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

export function GraphRental() {
  const [dataReport1, setDataReport1] = useState([]);
  const [dataReport2, setDataReport2] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener alquileres por película
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RentalService.rentalbyMovie();
        if (response?.data) {
          setDataReport1(response.data.data);
        } else {
          throw new Error("Respuesta vacía del servidor");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Error al cargar datos de alquileres por película");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Obtener alquileres mensuales por tienda
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RentalService.rentalMonthbyShop();
        if (response?.data) {
          const transformed = transformData(response.data.data);
          setDataReport2(transformed);
        } else {
          throw new Error("Respuesta vacía del servidor");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Error al cargar datos de alquileres por tienda");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // = Transformar datos =
  const transformData = (rawData) => {
    const groupedData = {};
    rawData.forEach(({ shop_name, month, monthly_total }) => {
      if (!groupedData[month]) groupedData[month] = { month };
      groupedData[month][shop_name] = monthly_total;
    });
    return Object.values(groupedData);
  };

  // Generar colores con contraste 
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 80;
    const lightness = 55;
    const hslToRgb = (h, s, l) => {
      s /= 100;
      l /= 100;
      const k = (n) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
      return [
        Math.round(f(0) * 255),
        Math.round(f(8) * 255),
        Math.round(f(4) * 255),
      ];
    };
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    return `rgb(${r},${g},${b})`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Cargando reportes...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-400 font-medium mt-10">
        Ocurrió un error: {error}
      </div>
    );

  const chartData = dataReport1.map((item) => ({
    name: item.pelicula,
    alquileres: item.cantidad_alquileres,
  }));

  return (
    <div className="min-h-screen p-6 space-y-10 bg-black text-gray-100">
      {/*  Alquileres por Película  */}
      <Card className="bg-neutral-900 border border-gray-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-100">
            Alquileres por Película
          </CardTitle>
        </CardHeader>
        <CardContent>
  <div className="w-full h-[400px]">
    <ResponsiveContainer>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="name" stroke="#ccc" tick={{ fill: "#ccc" }} />
        <YAxis stroke="#ccc" tick={{ fill: "#ccc" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f1f1f",
            border: "1px solid #555",
            color: "#fff",
          }}
          labelStyle={{ color: "#aaa" }}
        />

        <Legend
          wrapperStyle={{ color: "#fff", marginTop: "20px" }}
          iconType="line"
          align="center"
          verticalAlign="bottom"
          payload={[
            {
              value: "Alquileres",
              type: "line",
              color: "#00bcd4",
            },
          ]}
        />

        <Line
          type="monotone"
          dataKey="alquileres"
          stroke="#00bcd4"
          strokeWidth={3}
          activeDot={{ r: 7, fill: "#fff" }}
          legendType="none"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</CardContent>

      </Card>

      {/*  Total de Alquileres por Mes y Tienda  */}
      <Card className="bg-neutral-900 border border-gray-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-100">
            Total de Alquileres por Mes y por Tienda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <ResponsiveContainer>
              <BarChart
                data={dataReport2}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#ccc" tick={{ fill: "#ccc" }} />
                <YAxis stroke="#ccc" tick={{ fill: "#ccc" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1f1f",
                    border: "1px solid #555",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
                {dataReport2.length > 0 &&
                  Object.keys(dataReport2[0])
                    .filter((key) => key !== "month")
                    .map((shop) => (
                      <Bar
                        key={shop}
                        dataKey={shop}
                        fill={getRandomColor()}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
