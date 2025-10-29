import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TechniciansLists from "../../Services/TechniciansLists";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faUser, faBriefcase, faShieldAlt, faCalendar } from "@fortawesome/free-solid-svg-icons";

export function DetailTechnician() {
  const { id } = useParams(); //obtiene el ID de la URL
  const navigate = useNavigate();
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnicianDetail = async () => {
      try {
        const response = await TechniciansLists.getTechnicianById(id);
        console.log("Detalle del técnico:", response.data);
      
        const techData = response.data.data[0];
        setTechnician(techData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error al cargar el detalle");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicianDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">Cargando detalles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/technicians")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">No se encontró el técnico</p>
      </div>
    );
  }

  return (
    <div className="bg-[#dff1ff] min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/technicians")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver a la lista</span>
        </button>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-600">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {technician.UserName}
            </h1>
            <span className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold">
              {technician.Rol}
            </span>
          </div>

          {/* Información en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
                <p className="font-semibold text-gray-700">Email</p>
              </div>
              <p className="text-gray-900 break-words">{technician.Email}</p>
            </div>

            {/* Cargo */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faBriefcase} className="text-blue-600" />
                <p className="font-semibold text-gray-700">Cargo</p>
              </div>
              <p className="text-gray-900">{technician.Work_Charge || "No especificado"}</p>
            </div>

            {/* Aseguradora */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600" />
                <p className="font-semibold text-gray-700">Aseguradora</p>
              </div>
              <p className="text-gray-900">{technician.InsuranceId || "No asignada"}</p>
            </div>

            {/* Último Login */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCalendar} className="text-blue-600" />
                <p className="font-semibold text-gray-700">Último Login</p>
              </div>
              <p className="text-gray-900">
                {technician.Last_Login 
                  ? new Date(technician.Last_Login).toLocaleString('es-ES')
                  : "Nunca"}
              </p>
            </div>

            {/* Especialidades */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700 mb-2">Especialidades</p>
            
            </div>

            {/* ID */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700 mb-2">ID de Usuario</p>
              <p className="text-gray-900 font-mono text-lg">{technician.Id}</p>
            </div>
          </div>

          {/* Descripción del rol */}
          {technician.Rol_Descripcion && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700 mb-2">Descripción del Rol</p>
              <p className="text-gray-900">{technician.Rol_Descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}