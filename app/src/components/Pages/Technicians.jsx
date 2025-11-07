import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechniciansLists from "../../Services/TechniciansLists";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

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
              id: t.Id,
              name: t.UserName,
              email: t.Email,
              UserCode: t.Usercode,
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
      <div className="flex justify-center items-center min-h-screen bg-[#ff6e6e]">
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
    <div className="bg-gradient-to-b from-blue-100 to-blue-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Título principal */}
        <h1 className="text-4xl font-extrabold text-center text-[#101dcf] tracking-wide drop-shadow-lg mt-6 mb-8 border-b-4 border-[#DFA200] pb-4">
          Lista de Técnicos
        </h1>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="bg-white border-2 border-blue-600 rounded-xl p-6 shadow-md relative
                         transition-transform duration-300 ease-out
                         hover:-translate-y-2 hover:rotate-1 hover:shadow-xl cursor-pointer"
              onClick={() => navigate(`/technician/${tech.id}`)}
            >
              {/* La vaina dorada de arriba */}
              <div className="absolute top-0 left-0 w-full h-2 bg-[#DFA200] rounded-t-2xl"></div>

            
              <div className="mt-3 space-y-4">
                {/* Nombre */}
                <div>  
                  <p className="text-sm text-gray-500">Nombre de Usuario:</p>
                  <h1 className="uppercase text-2xl font-semibold text-[#101dcf]">
                    {tech.name}
                  </h1>
                </div>

                {/* ID */}
                <div>
                  <p className="text-sm text-gray-500">
                    Número de Identificación:
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {tech.UserCode}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm text-gray-500">Email:</p>
                  <p className="text-gray-800 break-words flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-[#DFA200]"
                    />
                    {tech.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
