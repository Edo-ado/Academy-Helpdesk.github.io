import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TechniciansLists from "../../Services/TechniciansLists";
import TicketLists from "../../Services/TicketsLists";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faEnvelope, 
  faUser, 
  faBriefcase, 
  faShieldAlt, 
  faCalendar, 
  faStar,
  faChartBar
} from "@fortawesome/free-solid-svg-icons";

export function DetailTechnician() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState(null);
  const [specialities, setSpecialities] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchTechnicianDetail = async () => {
     try {

         const response = await TechniciansLists.GetDetailByIdAll(id);
        console.log("Detalle del técnico:", response.data);
        
        const techData = response.data.data[0];
        setTechnician(techData);

        try {
          const specResponse = await TechniciansLists.GetSpecialitiesInformationByUserID(id);
  
          setSpecialities(specResponse.data.data || []);

        } catch (specError) {
   
          if (specError.response && specError.response.status === 404) {
          
            setSpecialities([]);
       } else {
        
            throw specError;
          }
        }

    
        try {
          const ticketsResponse = await TicketLists.getTicketsAssignedToTechnician(id);
       
          setTickets(ticketsResponse.data.data || []);
        } catch (ticketError) {
         
          if (ticketError.response && ticketError.response.status === 404) {
     
            setTickets([]);
          } else {
         
            throw ticketError;
          }
        }

      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error al cargar el detalle");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicianDetail();
  }, [id]);
  
  const workloadStats = useMemo(() => {
    if (!tickets || tickets.length === 0) {
      return { total: 0, low: 0, medium: 0, high: 0 };
    }

    return tickets.reduce((stats, ticket) => {
      stats.total++;
      // Convertir a número para comparar correctamente
      const priority = parseInt(ticket.Priority, 10);
      
      // 1 = Baja, 2 = Media, 3 = Alta
      if (priority === 1) stats.low++;
      else if (priority === 2) stats.medium++;
      else if (priority === 3) stats.high++;
      
      return stats;
    }, { total: 0, low: 0, medium: 0, high: 0 });
  }, [tickets]);

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
  onClick={() => navigate(-1)}
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
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
       onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver a la lista</span>
        </button>

        {/* Tarjeta de Perfil */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-600 mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
                <p className="font-semibold text-gray-700">Email</p>
              </div>
              <p className="text-gray-900 break-words">{technician.Email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faBriefcase} className="text-blue-600" />
                <p className="font-semibold text-gray-700">Cargo</p>
              </div>
              <p className="text-gray-900">{technician.Work_Charge || "No especificado"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600" />
                <p className="font-semibold text-gray-700">Aseguradora</p>
              </div>
              <p className="text-gray-900">{technician.InsuranceId || "No asignada"}</p>
            </div>

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

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700 mb-2">ID de Usuario</p>
              <p className="text-gray-900 font-mono text-lg">{technician.Usercode}</p>
            </div>
          </div>

          {technician.Rol_Descripcion && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700 mb-2">Descripción del Rol</p>
              <p className="text-gray-900">{technician.Rol_Descripcion}</p>
            </div>
          )}
        </div>

        {/* Tarjeta de Carga de Trabajo */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-600 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <FontAwesomeIcon icon={faChartBar} className="text-orange-500 text-xl" />
            <h2 className="text-2xl font-bold text-gray-900">Carga de Trabajo</h2>
          </div>
          
          {tickets.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{workloadStats.total}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Prioridad Baja</p>
                <p className="text-3xl font-bold text-green-600">{workloadStats.low}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Prioridad Media</p>
                <p className="text-3xl font-bold text-yellow-600">{workloadStats.medium}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Prioridad Alta</p>
                <p className="text-3xl font-bold text-red-600">{workloadStats.high}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                Este técnico no tiene tickets asignados actualmente
              </p>
              <p className="text-gray-400 text-sm mt-2">
                La carga de trabajo está en 0
              </p>
            </div>
          )}
        </div>

        {/* Tarjeta de Especialidades */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-600">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xl" />
            <h2 className="text-2xl font-bold text-gray-900">Especialidades</h2>
          </div>
          
          {specialities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialities.map((spec) => (
                <div 
                  key={spec.Id} 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-600 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {spec.Name}
                  </h3>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    📂 {spec.CategoryName}
                  </span>
                  {spec.Active === 1 && (
                    <span className="ml-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Activo
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Este técnico no tiene especialidades asignadas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
