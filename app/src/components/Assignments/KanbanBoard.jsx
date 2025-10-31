// src/components/Assignments/KanbanBoard.jsx
import React from 'react';
import { KanbanColumn } from './KanbanColumn';

export function KanbanBoard({ tickets, onTicketClick }) {
  
  // Agrupar tickets por estado
  const groupedTickets = {
    'Pendiente': tickets.filter(t => t.State === 'Pendiente'),
    'Asignado': tickets.filter(t => t.State === 'Asignado'),
    'En Progreso': tickets.filter(t => t.State === 'En Proceso'),
    'Resuelto': tickets.filter(t => t.State === 'Resuelto'),
    'Cerrado': tickets.filter(t => t.State === 'Cerrado')
  };

  const columns = [
    { key: 'Pendiente', label: 'Pendiente' },
    { key: 'Asignado', label: 'Asignado' },
    { key: 'En Progreso', label: 'En Proceso' },
    { key: 'Resuelto', label: 'Resuelto' },
    { key: 'Cerrado', label: 'Cerrado' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.key}
          title={column.label}
          tickets={groupedTickets[column.key]}
          onTicketClick={onTicketClick}
        />
      ))}
    </div>
  );
}