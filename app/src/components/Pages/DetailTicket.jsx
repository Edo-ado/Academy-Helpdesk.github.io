import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketLists from "../../Services/TicketsList";

export function DetailTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        const response = await TicketLists.GetTicketById(id);
        console.log("Detalle del ticket:", response.data);
        
        const t = response.data.data[0];
        
        const mappedTicket = {
          ticketId: t.TicketId,
          title: t.Title,
          description: t.Description,
          priority: t.Priority,
          state: t.State,
          startDate: t.Ticket_Start_Date,
          endDate: t.Ticket_End_Date,
          category: t.Category,
          technician: t.Tecnico,
          client: t.Cliente
        };
        
        console.log("Mapped ticket:", mappedTicket);
        setTicket(mappedTicket);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error al cargar el detalle del ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetail();
  }, [id]);

  const getPriorityConfig = (priority) => {
    const priorityNum = parseInt(priority, 10);
    switch (priorityNum) {
      case 3:
        return { 
          label: "Alta", 
          color: "bg-red-600", 
          bgLight: "bg-red-50",
          textColor: "text-red-600",
          borderColor: "border-red-600"
        };
      case 2:
        return { 
          label: "Media", 
          color: "bg-yellow-500", 
          bgLight: "bg-yellow-50",
          textColor: "text-yellow-600",
          borderColor: "border-yellow-500"
        };
      case 1:
        return { 
          label: "Baja", 
          color: "bg-green-600", 
          bgLight: "bg-green-50",
          textColor: "text-green-600",
          borderColor: "border-green-600"
        };
      default:
        return { 
          label: "Desconocida", 
          color: "bg-gray-600", 
          bgLight: "bg-gray-50",
          textColor: "text-gray-600",
          borderColor: "border-gray-600"
        };
    }
  };

  const getStateConfig = (state) => {
    const stateNum = parseInt(state, 10);
    switch (stateNum) {
      case 1:
        return { 
          label: "Abierto", 
          color: "bg-blue-100 text-blue-800",
          icon: "⏳"
        };
      case 2:
        return { 
          label: "En Proceso", 
          color: "bg-yellow-100 text-yellow-800",
          icon: "🔄"
        };
      case 3:
        return { 
          label: "Resuelto", 
          color: "bg-green-100 text-green-800",
          icon: "✓"
        };
      case 4:
        return { 
          label: "Cerrado", 
          color: "bg-gray-100 text-gray-800",
          icon: "✕"
        };
      default:
        return { 
          label: "Desconocido", 
          color: "bg-gray-100 text-gray-800",
          icon: "?"
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">Cargando detalles del ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/tickets")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">No se encontró el ticket</p>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(ticket.priority);
  const stateConfig = getStateConfig(ticket.state);

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/tickets")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition"
        >
          <span>←</span>
          <span>Volver a la lista</span>
        </button>

        {/* Tarjeta Principal del Ticket */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 border-2 ${priorityConfig.borderColor} mb-6`}>
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-4xl">🎫</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {ticket.title}
            </h1>
            <p className="text-gray-600 text-sm mb-3">Ticket #{ticket.ticketId}</p>
            <div className="flex justify-center gap-3">
              <span className={`inline-block ${priorityConfig.color} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                🔥 Prioridad: {priorityConfig.label}
              </span>
              <span className={`inline-block ${stateConfig.color} px-4 py-1 rounded-full text-sm font-semibold`}>
                {stateConfig.icon} {stateConfig.label}
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-6 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3 text-lg">📋 Descripción</h3>
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
              {ticket.description || "Sin descripción"}
            </p>
          </div>

          {/* Información del Ticket */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 text-xl">📂</span>
                <p className="font-semibold text-gray-700">Categoría</p>
              </div>
              <p className="text-gray-900 font-medium">{ticket.category}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 text-xl">👤</span>
                <p className="font-semibold text-gray-700">Cliente</p>
              </div>
              <p className="text-gray-900 font-medium">{ticket.client}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 text-xl">👨‍💼</span>
                <p className="font-semibold text-gray-700">Técnico Asignado</p>
              </div>
              <p className="text-gray-900 font-medium">{ticket.technician}</p>
            </div>

            <div className={`${priorityConfig.bgLight} p-4 rounded-lg border-l-4 ${priorityConfig.borderColor}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`${priorityConfig.textColor} text-xl`}>⚠️</span>
                <p className="font-semibold text-gray-700">Nivel de Prioridad</p>
              </div>
              <p className={`${priorityConfig.textColor} font-bold text-lg`}>
                {priorityConfig.label}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Fechas */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-600">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-green-500 text-2xl">📅</span>
            <h2 className="text-2xl font-bold text-gray-900">Fechas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <p className="font-semibold text-gray-700 mb-2">🕐 Fecha de Inicio</p>
              <p className="text-gray-900 font-medium">
                {formatDate(ticket.startDate)}
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
              <p className="font-semibold text-gray-700 mb-2">🏁 Fecha de Finalización</p>
              <p className="text-gray-900 font-medium">
                {formatDate(ticket.endDate)}
              </p>
            </div>
          </div>

          {ticket.startDate && ticket.endDate && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm mb-1">Duración estimada</p>
              <p className="text-gray-900 font-bold text-lg">
                {Math.ceil((new Date(ticket.endDate) - new Date(ticket.startDate)) / (1000 * 60 * 60 * 24))} días
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}