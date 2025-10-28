import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechniciansLists from "../../Services/TechniciansLists";

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

 
        const mappedData = Array.isArray(response.data.data)
          ? response.data.data.map((t) => ({
              id: t.Id,   //id ;3
              name: t.Nombre,   
              email: t.Email,   
            }))
          : [];

        console.log("Mapped data:", mappedData);
        setTechnicians(mappedData);
      } catch (err) {
        console.error("Error:", err);
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

  if (technicians.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">No hay técnicos disponibles</p>
      </div>
    );
  }

return (
  <div className="bg-[#dff1ff] min-h-screen p-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className="bg-[#e8f6ff] border-2 border-blue-600 rounded-xl p-6 shadow-md
                       transition-transform duration-300 ease-out
                       hover:-translate-y-2 hover:rotate-1 hover:shadow-xl cursor-pointer"
            onClick={() => navigate(`/technician/${tech.id}`)}
          >
            <p className="font-semibold text-gray-900 text-xl mb-4">{tech.name}</p>

            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">
                  Número de Identificación:
                </p>
                <p className="text-black font-bold text-lg">{tech.id}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700 text-sm">Email:</p>
                <p className="text-gray-800 break-words">{tech.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}