// src/components/Assignments/TicketCard.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock,
  faLaptop, 
  faNetworkWired, 
  faServer,
  faBuilding,
  faGraduationCap,
  faUsers,
  faWrench
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next"; 

export function TicketCard({ ticket, onClick }) {
  
  const { t } = useTranslation();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 3: return 'border-red-500';
      case 2: return 'border-yellow-500';
      case 1: return 'border-green-500';
      default: return 'border-gray-400';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryLower = category?.toLowerCase() || '';
    if (categoryLower.includes('hardware') || categoryLower.includes('tecnolog')) 
      return faLaptop;
    if (categoryLower.includes('network') || categoryLower.includes('red')) 
      return faNetworkWired;
    if (categoryLower.includes('software') || categoryLower.includes('system')) 
      return faServer;
    if (categoryLower.includes('infraestructura') || categoryLower.includes('mantenimiento')) 
      return faBuilding;
    if (categoryLower.includes('academic') || categoryLower.includes('académic')) 
      return faGraduationCap;
    if (categoryLower.includes('student') || categoryLower.includes('administrative')) 
      return faUsers;
    return faWrench;
  };

  const getProgressByState = (state) => {
    const stateMap = {
      'Pendiente': { key: 'pending', percent: 0, color: 'bg-red-400' },
      'Pending': { key: 'pending', percent: 0, color: 'bg-red-400' },
      'Asignado': { key: 'assigned', percent: 25, color: 'bg-orange-400' },
      'Assigned': { key: 'assigned', percent: 25, color: 'bg-orange-400' },
      'En Proceso': { key: 'inProgress', percent: 50, color: 'bg-yellow-400' },
      'In Progress': { key: 'inProgress', percent: 50, color: 'bg-yellow-400' },
      'Resuelto': { key: 'resolved', percent: 75, color: 'bg-green-400' },
      'Resolved': { key: 'resolved', percent: 75, color: 'bg-green-400' },
      'Cerrado': { key: 'closed', percent: 100, color: 'bg-green-500' },
      'Closed': { key: 'closed', percent: 100, color: 'bg-green-500' }
    };
    
    return stateMap[state] || { key: 'pending', percent: 0, color: 'bg-gray-400' };
  };

   const isCompleted = (state) => {
    return state === 'Resuelto' || state === 'Resolved' || 
           state === 'Cerrado' || state === 'Closed';
  };

const priorityColor = getPriorityColor(Number(ticket.Priority));


  const progress = getProgressByState(ticket.State);
  const categoryIcon = getCategoryIcon(ticket.Category);

  return (
    <div
      onClick={onClick}
      className={`bg-white ${priorityColor} border-l-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all duration-200 hover:-translate-y-1 p-4`}
    >
      <div className="mb-2">
        <span className="text-sm font-bold text-gray-700">
          {t("ticketCard.id")} {ticket.TicketId}
        </span>
      </div>

      <div className="mb-2">
        <p className="text-xs text-gray-600 font-semibold mb-1"> {t("ticketCard.category")} </p>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={categoryIcon} className="text-blue-600 text-sm" />
          <span className="text-sm text-gray-800 font-medium">
            {ticket.Category}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-600 font-semibold mb-1">
           {t("ticketCard.slaTimeRemaining")}
        </p>
        {ticket.State === 'Resuelto' || ticket.State === 'Cerrado' ? (
          <span className="text-sm text-green-600 font-semibold">
             {t("ticketCard.completed")} 
          </span>
        ) : (
          <span className="text-sm text-gray-800 font-medium">
            {ticket.TimeRemaining > 0 
              ?  `${ticket.TimeRemaining} ${t("ticketCard.hours")}` 
              : t("ticketCard.overdue") }
          </span>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`${progress.color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${progress.percent}%` }}
        ></div>
      </div>
    </div>
  );
}