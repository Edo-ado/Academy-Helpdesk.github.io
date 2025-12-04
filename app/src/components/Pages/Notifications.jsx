// src/pages/NotificationsPage.jsx
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import NotificationService from "../../Services/NotificationServices";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next"; 

export function Notifications() {
  const { selectedUser } = useUser();
  const { t } = useTranslation();
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

     const not = await NotificationService.GetCountNotificationsByIDUser(selectedUser.Id);
        if (not.data.data[0].Total == 0) {
         toast.success(t("notifications.allRead")); 
        }
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

const getTipoEvento = (eventType) => {
  switch (eventType) {
    case "CAMBIO_ESTADO_TICKET":
      return "TK";
    case "ASIGNACION_TICKET":
      return "ASG";
    case "LOGIN_USER":
      return "LG";
    default:
      return "OK";
  }
};

  return (
    <div className="min-h-screen w-full bg-[#dff1ff] flex justify-center">
      <div className="w-full bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-lg font-bold text-[#0a1e4a]">{t("notifications.title")}</h1>
           <button
                      className="mt-2 px-3 py-1 rounded-full text-slate-900 border border-[#DFA200] text-[#DFA200]  font-semibold
                                hover:bg-[#0a1e4a] hover:text-white transition"
                      onClick={() => marcarTodas()}
                    >
                      {t("notifications.markAllRead")}
                    </button>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-7 w-7 border-2 border-[#0a1e4a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 font-sans text-sm mb-1">
                {t("notifications.noNotifications")}
            </p>
            <p className="text-gray-300 text-xs"> {t("notifications.comingSoon")}</p>
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
                  {getTipoEvento(n.EventType)}
                </div>

                <div className="flex-1">
                  <p className="font-sans text-gray-800">{n.Message}</p>

             {n.TicketId &&  n.EventType == "CAMBIO_ESTADO_TICKET" &&  (
                <div className="mt-1">
                  <p className="font-sans text-[#c2983d]">
                    {t("notifications.ticket")} #{n.TicketId}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">  {t("notifications.previousState")}: {n.LastStateTicket} • {t("notifications.currentState")}: {n.ActualStateTicket}</span> 
                    
                 
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
                     {t("notifications.markAsRead")}
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