// src/components/Assignments/KanbanColumn.jsx
import React from 'react';
import { TicketCard } from './TicketCard';

export function KanbanColumn({ title, tickets, onTicketClick }) {
  return (
    <div className="flex flex-col">
      {/* Header de columna */}
      <div className="bg-blue-600 text-white rounded-t-lg p-4 text-center">
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

      {/* Contenedor de tarjetas */}
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
            Sin tickets
          </div>
        )}
      </div>
    </div>
  );
}