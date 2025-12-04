import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketLists from "../../Services/TicketsLists";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import {
  faArrowLeft, faTicket, faClipboardList, faFolder, faUser,
  faTriangleExclamation, faUserTie, faComments, faStar,
  faCalendarDays, faCamera, faFire, faX, faCheck,
  faQuestion, faMagnifyingGlass, faClock, faAlarmClock, faStopwatch
} from "@fortawesome/free-solid-svg-icons";

export function DetailTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); 
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        const response = await TicketLists.GetTicketById(id);
        console.log("Detalle del ticket:", response.data);

        if (!response.data || !response.data.data || response.data.data.length === 0) {
          throw new Error(t("ticketDetail.ticketNotFound")); 
        }

        const rows = response.data.data;
        const t_data = rows[0];

        const comments = rows
          .filter(r => r.CommentId && r.CommentText)
          .map(r => ({
            id: r.CommentId,
            user: r.CommentUser ,
            text: r.CommentText,
            date: r.CommentDate
          }));

        const ratings = rows
          .filter(r => r.RatingId && r.Rating)
          .map(r => ({
            id: r.RatingId,
            user: r.RatingUser ,
            rating: r.Rating,
            comment: r.RatingComment,
            date: r.Rating_Date
          }));

        const evidences = rows
          .filter(r => r.EvidencePath)
          .map(r => ({
            id: r.EvidenceId || Math.random(),
            path: r.EvidencePath
          }));

        const mappedTicket = {
          ticketId: t_data.TicketId || "N/A",
          title: t_data.Title || t("ticketDetail.noTitle"),
          description: t_data.Description || t("ticketDetail.noDescription"),
          priority: t_data.Priority || 1,
          state: t_data.State || "Pendiente",
          startDate: t_data.Ticket_Start_Date || null,
          endDate: t_data.Ticket_End_Date || null,
          Category: t_data.Category || t("ticketDetail.noCategory"),
          technician: t_data.Tecnico || t("ticketDetail.unassigned"),
          client: t_data.Cliente || t("ticketDetail.unknown"),
          Ticket_Response_SLA: t_data.Ticket_Response_SLA || null,
          Ticket_Resolution_SLA: t_data.Ticket_Resolution_SLA || null,
          comments,
          ratings,
          evidences
        };

        setTicket(mappedTicket);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || t("ticketDetail.error")); 
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicketDetail();
    } else {
      setError(t("ticketDetail.error"));
      setLoading(false);
    }
  }, [id, t]);


  const getPriorityConfig = (priority) => {
    const priorityNum = parseInt(priority, 10);
    switch (priorityNum) {
      case 3:
        return { 
          label: t("ticketDetail.priorities.high"),
          color: "bg-red-600", 
          bgLight: "bg-red-50",
          textColor: "text-red-600",
          borderColor: "border-red-600"
        };
      case 2:
        return { 
          label: t("ticketDetail.priorities.medium"),
          color: "bg-yellow-500", 
          bgLight: "bg-yellow-50",
          textColor: "text-yellow-600",
          borderColor: "border-yellow-500"
        };
      case 1:
        return { 
          label: t("ticketDetail.priorities.low"),
          color: "bg-green-600", 
          bgLight: "bg-green-50",
          textColor: "text-green-600",
          borderColor: "border-green-600"
        };
      default:
        return { 
          label: t("ticketDetail.priorities.unknown"),
          color: "bg-gray-600", 
          bgLight: "bg-gray-50",
          textColor: "text-gray-600",
          borderColor: "border-gray-600"
        };
    }
  };

  
  const getStateConfig = (state) => {
    const stateStr = String(state).toLowerCase();
    
    if (stateStr === "pendiente" || stateStr === "pending" || stateStr === "1") {
      return { 
        label: t("ticketDetail.states.pending"),
        color: "bg-gray-100 text-gray-800",
        icon: <FontAwesomeIcon icon={faTriangleExclamation} />
      };
    }
    if (stateStr === "asignado" || stateStr === "assigned" || stateStr === "2") {
      return { 
        label: t("ticketDetail.states.assigned"),
        color: "bg-blue-100 text-blue-800",
        icon: <FontAwesomeIcon icon={faClipboardList} />
      };
    }
    if (stateStr === "en proceso" || stateStr === "in progress" || stateStr === "3") {
      return { 
        label: t("ticketDetail.states.inProgress"),
        color: "bg-yellow-100 text-yellow-800",
        icon: <FontAwesomeIcon icon={faFire} />
      };
    }
    if (stateStr === "resuelto" || stateStr === "resolved" || stateStr === "4") {
      return { 
        label: t("ticketDetail.states.resolved"),
        color: "bg-green-100 text-green-800",
        icon: <FontAwesomeIcon icon={faCheck} />
      };
    }
    if (stateStr === "cerrado" || stateStr === "closed" || stateStr === "5") {
      return { 
        label: t("ticketDetail.states.closed"),
        color: "bg-purple-100 text-purple-800",
        icon: <FontAwesomeIcon icon={faX} />
      };
    }
    
    return { 
      label: state || t("ticketDetail.states.unknown"),
      color: "bg-gray-100 text-gray-800",
      icon: <FontAwesomeIcon icon={faQuestion} />
    };
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error("Error calculando duración:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">{t("ticketDetail.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <span className="text-6xl mb-4 block">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </span>
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}  
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t("ticketDetail.back")}
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-gray-700 text-lg mb-4">{t("ticketDetail.ticketNotFound")}</p>
          <button
            onClick={() => navigate("/tickets")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t("ticketDetail.backToList")}
          </button>
        </div>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(ticket.priority);
  const stateConfig = getStateConfig(ticket.state);
  const duration = calculateDuration(ticket.startDate, ticket.endDate);

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition font-semibold"
        >
          <span className="text-xl">←</span>
          <span>{t("ticketDetail.backToList")}</span>
        </button>

        {/* Tarjeta Principal del Ticket */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 border-2 ${priorityConfig.borderColor} mb-6`}>
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-4xl">
                <FontAwesomeIcon icon={faTicket} />
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {ticket.title}
            </h1>
            <p className="text-gray-600 text-sm mb-3">
              {t("ticketDetail.ticket")} #{ticket.ticketId}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <span className={`inline-block ${priorityConfig.color} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                <FontAwesomeIcon icon={faFire} /> {t("ticketDetail.priority")}: {priorityConfig.label}
              </span>
              <span className={`inline-block ${stateConfig.color} px-4 py-1 rounded-full text-sm font-semibold`}>
                {stateConfig.icon} {stateConfig.label}
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-6 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3 text-lg">
              <FontAwesomeIcon icon={faClipboardList} className="text-gray-700 mr-3" />
              {t("ticketDetail.description")}
            </h3>
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Información del Ticket */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 text-xl">
                  <FontAwesomeIcon icon={faFolder} />
                </span>
                <p className="font-semibold text-gray-700">{t("ticketDetail.category")}</p>
              </div>
              <p className="text-gray-900 font-medium">{ticket.Category}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 text-xl">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <p className="font-semibold text-gray-700">{t("ticketDetail.client")}</p>
              </div>
              <p className="text-gray-900 font-medium">{ticket.client}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 text-xl">
                  <FontAwesomeIcon icon={faUserTie} />
                </span>
                <p className="font-semibold text-gray-700">{t("ticketDetail.assignedTechnician")}</p>
              </div>
              <p className="text-gray-900 font-medium">
                {ticket.technician === t("ticketDetail.unassigned") ? (
                  <span className="text-gray-500 italic">{ticket.technician}</span>
                ) : (
                  ticket.technician
                )}
              </p>
            </div>

            <div className={`${priorityConfig.bgLight} p-4 rounded-lg border-l-4 ${priorityConfig.borderColor}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`${priorityConfig.textColor} text-xl`}>
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                </span>
                <p className="font-semibold text-gray-700">{t("ticketDetail.priorityLevel")}</p>
              </div>
              <p className={`${priorityConfig.textColor} font-bold text-lg`}>
                {priorityConfig.label}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Fechas */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-600 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-green-500 text-2xl">
              <FontAwesomeIcon icon={faCalendarDays} />
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{t("ticketDetail.timeline")}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <p className="font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faClock} /> {t("ticketDetail.startDate")}
              </p>
              <p className="text-gray-900 font-medium">
                {ticket.startDate}
              </p>
            </div>

            <div className={`${ticket.endDate ? 'bg-purple-50 border-purple-600' : 'bg-gray-50 border-gray-300'} p-6 rounded-lg border-l-4`}>
              <p className="font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faAlarmClock} /> {t("ticketDetail.endDate")}
              </p>
              <p className={`font-medium ${ticket.endDate ? 'text-gray-900' : 'text-gray-500 italic'}`}>
                {ticket.endDate}
              </p>
            </div>
          </div>

          {duration !== null && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg text-center border-2 border-blue-200">
              <p className="text-gray-600 text-sm mb-1">
                <FontAwesomeIcon icon={faStopwatch} /> {t("ticketDetail.totalDuration")}
              </p>
              <p className="text-gray-900 font-bold text-lg">
                {duration} {duration === 1 ? t("ticketDetail.day") : t("ticketDetail.days")}
              </p>
            </div>
          )}
        </div>

        {/* SLA RESPUESTA Y SLA RESOLUCIÓN */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-600 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-purple-500 text-2xl">
              <FontAwesomeIcon icon={faCalendarDays} />
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{t("ticketDetail.slaTitle")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faClock} /> {t("ticketDetail.responseSLA")}
              </p>
              <p className="text-gray-900 font-medium">
                {ticket.Ticket_Response_SLA}
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faClock} /> {t("ticketDetail.resolutionSLA")}
              </p>
              <p className="text-gray-900 font-medium">
                {ticket.Ticket_Resolution_SLA}
              </p>
            </div>
          </div>
        </div>

        {/* COMENTARIOS */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-600 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <FontAwesomeIcon icon={faComments} className="text-blue-500 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">{t("ticketDetail.comments")}</h2>
          </div>

          {ticket.comments?.length > 0 ? (
            <div className="space-y-4">
              {ticket.comments.map((c) => (
                <div key={c.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-gray-900 font-medium">{c.text}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t("ticketDetail.by")} {c.user} — {c.date}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">{t("ticketDetail.noComments")}</p>
          )}
        </div>

        {/* VALORACIONES */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-500 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">{t("ticketDetail.ratings")}</h2>
          </div>

          {ticket.ratings?.length > 0 ? (
            <div className="space-y-4">
              {ticket.ratings.map((r) => (
                <div key={r.id} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-lg font-semibold text-yellow-700">
                    <FontAwesomeIcon icon={faStar} /> {r.rating}/5
                  </p>
                  <p className="text-gray-900">
                    {r.comment || t("ticketDetail.noAdditionalComment")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t("ticketDetail.by")} {r.user} — {r.date}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">{t("ticketDetail.noRatings")}</p>
          )}
        </div>

        {/* EVIDENCIAS */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-500 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <FontAwesomeIcon icon={faCamera} className="text-green-500 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">{t("ticketDetail.evidences")}</h2>
          </div>

          {ticket.evidences?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ticket.evidences.map((e) => (
                <div key={e.id} className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={e.path} 
                    alt={t("ticketDetail.evidence")}
                    className="object-cover w-full h-48"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">{t("ticketDetail.noEvidences")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
