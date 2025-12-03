// src/pages/NotificationsPage.jsx
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import NotificationService from "../../Services/NotificationServices";
import { useUser } from "../../context/UserContext";

export function Notifications() {
  const { selectedUser } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedUser?.Id) return;

    const fetchData = async () => {
      try {
        const res = await NotificationService.GetNotificationsByIDUser(selectedUser.Id);
    
        const data = res.data.data;
  
        setNotifications(data);
        console.log(data);


      } catch (error) {
        console.error("Error:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUser.Id]);

async function marcarTodas() {
  try {
    await NotificationService.UpdateNotificacionAllIsRead(selectedUser.Id);
    const res = await NotificationService.GetNotificationsByIDUser(selectedUser.Id);
    setNotifications(res.data.data);
  } catch (err) {
    console.error(err);
  }
}

async function marcarComoLeida(id) {
  try {
    await NotificationService.UpdateNotificacionIsRead(id);
    const res = await NotificationService.GetNotificationsByIDUser(selectedUser.Id);
    setNotifications(res.data.data);
  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className="min-h-screen w-full bg-[#dff1ff] flex justify-center">
      <div className="w-full bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-lg font-bold text-[#0a1e4a]">Notificaciones</h1>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-7 w-7 border-2 border-[#0a1e4a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 font-sans text-sm mb-1">
              No tienes notificaciones
            </p>
            <p className="text-gray-300 text-xs">Pronto llegarán :3</p>
          </div>
        ) : (
          <ul className="w-full">
            {notifications.map((n) => (
              <li
                key={n.Id}
             className={`w-full flex items-center gap-4 px-6 py-4 border-b border-gray-100 ${
                n.Is_Read == 0 ? "bg-gray-50" : "bg-white"
              }`}

              >
                {/* Icono */}
                <div className="w-8 h-8 rounded-full bg-[#0a1e4a] text-white font-sans flex items-center justify-center">
                  {n.EventType === "CAMBIO_ESTADO_TICKET" ? "TK" : "OK"}
                </div>

                <div className="flex-1">
                  <p className="font-sans text-gray-800">{n.Message}</p>

             {n.TicketId && (
                <div className="mt-1">
                  <p className="font-sans text-[#c2983d]">
                    Ticket #{n.TicketId}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Estado Anterior: {n.LastStateTicket} • Estado Actual: {n.ActualStateTicket}</span> 
                    
                 
                  </p>
                </div>
              )}

                  <p className="font-sans text-gray-400 mt-1">
                    {n.Created_At} 
                  </p>
                  {n.Is_Read == 0 && (
                    <button
                      className="mt-2 px-3 py-1 rounded-full text-xs border border-[#DFA200] text-[#DFA200]
                                hover:bg-[#0a1e4a] hover:text-white transition"
                      onClick={() => marcarComoLeida(n.Id)}
                    >
                      Marcar como leído
                    </button>
                  )}


                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}