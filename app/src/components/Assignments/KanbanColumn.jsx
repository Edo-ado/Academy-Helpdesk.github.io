// src/components/Assignments/KanbanColumn.jsx
import React from 'react';
import { TicketCard } from './TicketCard';
import { useTranslation } from "react-i18next"; 

export function KanbanColumn({ title, tickets, onTicketClick }) {
  const { t } = useTranslation(); 

  return (
    <div className="flex flex-col">

      <div className="bg-blue-600 text-white rounded-t-lg p-4 text-center">
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

  
      <div className="bg-blue-600 rounded-b-lg p-4 flex-1 space-y-4 min-h-[400px]">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.TicketId}
              ticket={ticket}
              onClick={() => onTicketClick(ticket)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-white text-sm opacity-70">
            {t("kanban.noTickets")} 
          </div>
        )}
      </div>
    </div>
  );
}
