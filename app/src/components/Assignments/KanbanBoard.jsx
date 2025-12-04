// src/components/Assignments/KanbanBoard.jsx
import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { useTranslation } from "react-i18next";

export function KanbanBoard({ tickets, onTicketClick }) {
  const { t } = useTranslation();
  
  const normalizeState = (state) => {
    const stateMap = {
      'Pendiente': 'pending',
      'Pending': 'pending',
      'Asignado': 'assigned',
      'Assigned': 'assigned',
      'En Proceso': 'inProgress',
      'En Progreso': 'inProgress',
      'In Progress': 'inProgress',
      'Resuelto': 'resolved',
      'Resolved': 'resolved',
      'Cerrado': 'closed',
      'Closed': 'closed'
    };
    return stateMap[state] || 'pending';
  };

  const groupedTickets = {
    'pending': tickets.filter(t => normalizeState(t.State) === 'pending'),
    'assigned': tickets.filter(t => normalizeState(t.State) === 'assigned'),
    'inProgress': tickets.filter(t => normalizeState(t.State) === 'inProgress'),
    'resolved': tickets.filter(t => normalizeState(t.State) === 'resolved'),
    'closed': tickets.filter(t => normalizeState(t.State) === 'closed')
  };

  const columns = [
    { key: 'pending', label: t("kanban.columns.pending") },
    { key: 'assigned', label: t("kanban.columns.assigned") },
    { key: 'inProgress', label: t("kanban.columns.inProgress") },
    { key: 'resolved', label: t("kanban.columns.resolved") },
    { key: 'closed', label: t("kanban.columns.closed") }
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
