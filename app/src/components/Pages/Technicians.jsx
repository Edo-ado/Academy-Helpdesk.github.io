import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechniciansLists from "../../Services/TechniciansLists"; // ajusta la ruta

export function TechnicianList() {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TechniciansLists.getAllTechnicians();
        console.log("Response from API:", response.data);

        // Mapear datos para unificar nombres y asegurar que sea array
        const mappedData = Array.isArray(response.data)
          ? response.data.map((t) => ({
              id: t.UserCode,
              name: t.Nombre,
              email: t.Email,
            }))
          : [];

        setTechnicians(mappedData);
      } catch (err) {
        setError(err.message || "Error al cargar los técnicos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">Cargando técnicos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#dff1ff] min-h-screen p-6 flex justify-center items-start">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className="w-full bg-[#e8f6ff] border-2 border-blue-600 rounded-xl p-4 shadow-md
                       transition-transform duration-300 ease-out
                       hover:-translate-y-2 hover:rotate-1 hover:shadow-xl cursor-pointer"
            onClick={() => navigate(`/technician/${tech.id}`)}
          >
            <p className="font-semibold text-gray-900 text-lg">{tech.name}</p>

            <p className="text-gray-600 text-sm mt-2">
              Número de Identificación:
            </p>
            <p className="text-black font-bold text-lg">{tech.id}</p>

            <p className="font-semibold text-gray-700 mt-4">Email:</p>
            <p className="text-gray-800">{tech.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
