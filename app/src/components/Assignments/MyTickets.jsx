// src/components/Pages/MyTickets.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import TicketsLists from '../../Services/TicketsLists';
import { useNavigate } from "react-router-dom";
import { KanbanBoard } from '../Assignments/KanbanBoard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCalendarXmark, faTicket } from '@fortawesome/free-solid-svg-icons';

export function MyTickets() {
  const { selectedUser } = useUser();
   const navigate = useNavigate(); 
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false); 
  const [filterType, setFilterType] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!selectedUser.Id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setIsEmpty(false);
        
        console.log('Cargando tickets...');
        console.log('Técnico ID:', selectedUser.Id);
        console.log('Filtro:', filterType);
        console.log('Fecha:', selectedDate);

        let response;
        
        if (filterType === 'week') {
          response = await TicketsLists.GetWeeklyAssignments(selectedUser.Id, selectedDate);
        } else {
          response = await TicketsLists.GetDailyAssignments(selectedUser.Id, selectedDate);
        }

        console.log('Respuesta completa:', response.data);
        
        const ticketsData = response.data.data || [];
        setTickets(ticketsData);
        
        // Verificar si está vacío
        if (ticketsData.length === 0) {
          setIsEmpty(true);
        }
        
      } catch (err) {
        console.error('Error completo:', err);
        

        if (err.response && err.response.status === 404) {
          setTickets([]);
          setIsEmpty(true);
          setError(null); 
        } else {

          setError(err.message || 'Error al cargar los tickets');
          setIsEmpty(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [selectedUser.Id, filterType, selectedDate]);


const handleTicketClick = (ticket) => {
  console.log('Navegando al detalle del ticket:', ticket);
  navigate(`/ticket/${ticket.TicketId}`); 
};

  if (!selectedUser.Id) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#e8f0f8]">
        <p className="text-gray-700">Por favor, selecciona un usuario en el header</p>
      </div>
    );
  }

  return (
    <div className="bg-[#e8f0f8] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Vista de Asignaciones
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {selectedUser.UserName} - {selectedUser.Rol}
            </p>
          </div>

          {/* Botones de filtro */}
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setFilterType('week')}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                filterType === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600'
              }`}
            >
              View Week
            </button>
            <button
              onClick={() => setFilterType('day')}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                filterType === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600'
              }`}
            >
              View Day
            </button>

            {/* Selector de fecha */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-2 border-blue-600 rounded-lg px-4 py-2 font-semibold"
            />
          </div>
        </div>

        {/* Información del filtro */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow">
          <p className="text-sm text-gray-600">
            {filterType === 'week' 
              ? `Mostrando tickets de la semana de ${new Date(selectedDate).toLocaleDateString('es-ES')} (${tickets.length} tickets)`
              : `Mostrando tickets del ${new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} (${tickets.length} tickets)`
            }
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-600" />
            <p className="ml-4 text-gray-700">Cargando asignaciones...</p>
          </div>
        )}

    
        {error && !isEmpty && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <span className="text-5xl block mb-3">⚠️</span>
            <p className="text-red-600 font-semibold text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Reintentar
            </button>
          </div>
        )}

      
{!loading && isEmpty && (
  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
    <div className="text-6xl mb-4">📭</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">
      Sin tickets asignados
    </h3>
    <p className="text-gray-600">
      {filterType === 'week' 
        ? `No hay tickets para esta semana`
        : `No hay tickets para este día`
      }
    </p>
  </div>
)}


        {/* Tablero Kanban - Solo mostrar si hay tickets */}
        {!loading && !error && !isEmpty && tickets.length > 0 && (
          <KanbanBoard 
            tickets={tickets} 
            onTicketClick={handleTicketClick} 
          />
        )}
      </div>
    </div>
  );
}
