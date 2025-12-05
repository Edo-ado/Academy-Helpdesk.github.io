import React, { useEffect, useState } from "react";
import AutoTriageList from "../../Services/Autotriage";
import NotificationService from "../../Services/NotificationServices";
import toast from "react-hot-toast";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
export default function AutotriagePage() {
  const [ticketsAuto, setTicketsAuto] = useState([]);
  const [ticketsManual, setTicketsManual] = useState([]);
  const [tecnicosDisponibles, setTecnicosDisponibles] = useState({});
  const [tab, setTab] = useState("auto");
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState({});
  
  const { t } = useTranslation();

  useEffect(() => {
    cargarTicketsAuto();
  }, []);




 const cargarTicketsAuto = async () => {
  setLoading(true);
  try {
    // 1. Obtener TODOS los tickets pendientes
    const res = await AutoTriageList.GetAllPendingTickets() ;
    

    // Extraer los tickets de la respuesta
    let todosPendientes = [];
    if (Array.isArray(res.data)) {
      todosPendientes = res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      todosPendientes = res.data.data;
    }
    

    // 2. Filtrar solo los que tienen regla de autotriage
    const ticketsAptos = [];

    for (const ticket of todosPendientes) {
      try {
        // Verificar si existe regla aplicable para este ticket
        const reglaRes = await AutoTriageList.GetApplicableRuleForTicket(
          ticket.CategoryId,
          ticket.PriorityId
        );

        let regla = null;
        if (Array.isArray(reglaRes.data)) {
          regla = reglaRes.data[0];
        } else if (reglaRes.data && Array.isArray(reglaRes.data.data)) {
          regla = reglaRes.data.data[0];
        } 


      

        // Si hay regla, el ticket es apto para autotriage
        if (regla) {
          // Calcular puntaje y horas restantes     

           const horasRestantes = calcularHorasRestantes(ticket.Ticket_Resolution_SLA);
          const puntaje = (ticket.Priority * 1000) - horasRestantes;

          // Agregar info de la regla y puntaje al ticket
          ticketsAptos.push({
            ...ticket,
            Regla: regla,
            HorasRestantes: horasRestantes,
            Puntaje: puntaje
          });

          console.log(` Ticket ${ticket.TicketId} SÍ tiene regla: R${regla.RuleOrder}`);
        } else {
          console.log(` Ticket ${ticket.TicketId} NO tiene regla (para manual)`);
        }
      } catch (error) {
        console.error(`Error verificando ticket ${ticket.TicketId}:`, error);
      }
    }

    // 3. Ordenar por puntaje descendente (mayor prioridad primero)
    ticketsAptos.sort((a, b) => b.Puntaje - a.Puntaje);

    console.log(" Tickets aptos para autotriage:", ticketsAptos);
    
    setTicketsAuto(ticketsAptos);






  } catch (error) {

 if (error.response && error.response.status === 404) {

     console.warn("No hay tickets pendientes.");
    setTicketsAuto([]);

 }
  } finally {
    setLoading(false);
  }
};


  //Incompleto

  const cargarTicketsManual = async () => {
    setLoading(true);
 
    try {
      // 1. Obtener TODOS los tickets pendientes
      const res = await AutoTriageList.GetAllPendingTickets();
      let todosPendientes = [];
      if (Array.isArray(res.data)) {
        todosPendientes = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        todosPendientes = res.data.data;
      }
      console.log(" Todos los tickets pendientes:", todosPendientes);
      // 2. Filtrar solo los que NO tienen regla de autotriage
      const ticketsManualTemp = [];
      const tecnicosTemp = {};
      for (const ticket of todosPendientes) {
        try {
          // Verificar si existe regla aplicable para este ticket
          const reglaRes = await AutoTriageList.GetApplicableRuleForTicket(
            ticket.CategoryId,
            ticket.PriorityId
          );
          let regla = null;
          if (Array.isArray(reglaRes.data)) {
            regla = reglaRes.data[0];
          } else if (reglaRes.data && Array.isArray(reglaRes.data.data)) {
            regla = reglaRes.data.data[0];
          }
          // Si NO hay regla, el ticket requiere asignación manual
          if (!regla) {
            ticketsManualTemp.push(ticket);
            // Obtener técnicos disponibles para este ticket
            const tecnicosRes = await AutoTriageList.GetTechniciansByCategory(ticket.CategoryId);
            let listaTecnicos = [];
            if (Array.isArray(tecnicosRes.data)) {
              listaTecnicos = tecnicosRes.data; 
            } else if (tecnicosRes.data && Array.isArray(tecnicosRes.data.data)) {
              listaTecnicos = tecnicosRes.data.data;
            }
            tecnicosTemp[ticket.TicketId] = listaTecnicos;
            console.log(` Ticket ${ticket.TicketId} requiere asignación manual. Técnicos disponibles:`, listaTecnicos);
          } else {
            console.log(` Ticket ${ticket.TicketId} tiene regla de autotriage (para automático)`);
          }
        } catch (error) {
          console.error(`Error verificando ticket ${ticket.TicketId}:`, error);
        }
      }
      console.log(" Tickets para asignación manual:", ticketsManualTemp);
      setTicketsManual(ticketsManualTemp);
      setTecnicosDisponibles(tecnicosTemp);
    } catch (error) {

 if (error.response && error.response.status === 404) {

     console.warn("No hay tickets pendientes.");
      setTicketsManual([]);

       }
    } finally {
      setLoading(false);
    }
    
    
     
    
  };

 
  const calcularHorasRestantes = (slaDate) => {
    if (!slaDate) return 0;
    
    const ahora = new Date();
    const fechaSLA = new Date(slaDate);
    const diffMs = fechaSLA - ahora;
    const diffHoras = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHoras);
  };


  const asignarAutoIndividual = async (ticket) => {
    try {
      setLoading(true);
      
     
      
      // Obtener regla aplicable
      const reglaRes = await AutoTriageList.GetApplicableRuleForTicket(
        ticket.CategoryId,
        ticket.Priority
      );

      let regla = null;
      if (Array.isArray(reglaRes.data)) {
        regla = reglaRes.data[0];
      } else if (reglaRes.data && Array.isArray(reglaRes.data.data)) {
        regla = reglaRes.data.data[0];
      } 
      if (!regla) {
      toast.error(t("autotriage.noRuleAlert"));
        setLoading(false);
        return;
      }
      console.log("Regla aplicable encontrada:", regla);

    
 

      // Obtener técnicos con la especialidad requerida
      const tecnicosRes = await AutoTriageList.GetTechniciansByCategory(regla.SpecialityId);
      
      let listaTecnicos = [];
      if (Array.isArray(tecnicosRes.data)) {
        listaTecnicos = tecnicosRes.data;
      } else if (tecnicosRes.data && Array.isArray(tecnicosRes.data.data)) {
        listaTecnicos = tecnicosRes.data.data;
      }

        console.log("Técnicos obtenidos para autotriage:", listaTecnicos);

      if (listaTecnicos.length === 0) {
        toast.error(t("autotriage.noTechAlert"));
        setLoading(false);
        return;
      }

      // Seleccionar técnico con menor carga
      const tecnicoSeleccionado = listaTecnicos.reduce((prev, current) => 
        (prev.CurrentTicketCount < current.CurrentTicketCount) ? prev : current
      );

      console.log("Técnico seleccionado para asignación automática:", tecnicoSeleccionado);

    


      const actualizacion = await AutoTriageList.UpdateTicket({
        TicketId: ticket.TicketId,
        TechnicianId: tecnicoSeleccionado.TechnicianId,
      });


      const insertar = await AutoTriageList.InsertsTicket({
        TicketId: ticket.TicketId,
        TechnicianId: tecnicoSeleccionado.TechnicianId,
        Remarks: `Asignación automática por autotriage. Regla aplicada: R${regla.RuleOrder}, Especialidad: ${regla.SpecialityName}`,
        Method: "AutoTriage"
      });

      console.log("Respuesta de asignación automática:", insertar);

       //notificacion

       await NotificationService.InsertNotificationAssignTicketTechnician(tecnicoSeleccionado.TechnicianId, ticket.TicketId);
       await NotificationService.InsertNotificationTechToYourTickeCliente(tecnicoSeleccionado.TechnicianId, ticket.TicketId, 17);


       toast.success(t("autotriage.assignedAutoSuccess") + "   " + tecnicoSeleccionado.UserName);
       await cargarTicketsManual();
       await cargarTicketsAuto();


     

    } catch (error) {
      console.error("Error en asignación automática:", error);
      alert("Error al asignar el ticket automáticamente: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };


  const asignarManualIndividual = async (ticketId, techId, ticket) => {
    if (!techId || techId === "default") {
     toast.error(t("autotriage.selectTechAlert"));
      return;
    }

    try {
      setLoading(true);
      
      // Obtener información del técnico seleccionado
      const tecnicos = tecnicosDisponibles[ticketId] || [];
      const techIdNumber = parseInt(techId);
      
      console.log("techId recibido:", techId, "convertido a:", techIdNumber);
      console.log("Técnicos disponibles:", tecnicos);
      
   
      // Crear observación detallada
     
      // Asignar ticket manualmente
      const actualizacion = await AutoTriageList.UpdateTicket({
        TicketId: ticket.TicketId,
        TechnicianId: techIdNumber,
      });

      const insertar = await AutoTriageList.InsertsTicket({
        TicketId: ticket.TicketId,
        TechnicianId: techIdNumber,
        Remarks: `Asignación manual por el Administrador.`,
        Method: "AutoTriage"
      });

      let success = false;
      let message = "";
      
      if (insertar?.data?.success) {
        success = true;
      } else if (Array.isArray(insertar?.data) && insertar.data.length > 0 && insertar.data[0].success) {
        success = true;
      } else if (insertar?.data?.result?.success) {
        success = true;
      }
      
      if (insertar?.data?.message) {
        message = insertar.data.message;
      } else if (insertar?.data?.result?.message) {
        message = insertar.data.result.message;
      }

      if (success) {
        alert(`Ticket asignado manualmente a ${techIdNumber}`);
      toast.success(t("autotriage.assignedManualSuccess"));
        // Limpiar selección
        setSelectedTech(prev => ({
          ...prev,
          [ticketId]: "default"
        }));
        
       //notis
       await NotificationService.InsertNotificationAssignTicketTechnician(techIdNumber, ticket.TicketId);
       await NotificationService.InsertNotificationTechToYourTickeCliente(techIdNumber, ticket.TicketId, 17);

      // Recargar ambas listas
        await cargarTicketsManual();
        await cargarTicketsAuto();
      }
       else {
       

      }

    } catch (e) {
      console.error("Error en asignación manual:", e);
     toast.error(t("autotriage.noTicketsToAssign"));
    } finally {
      setLoading(false);
    }
  };


  const asignarTodosAuto = async () => {
    if (ticketsAuto.length === 0) {
      
      return;
    }

    const confirmacion = window.confirm(
      `¿Desea asignar automáticamente ${ticketsAuto.length} ticket(s)?`
    );

    if (!confirmacion) return;

    setLoading(true);
    let exitosos = 0;
    let fallidos = 0;

    for (const ticket of ticketsAuto) {
      try {
        await asignarAutoIndividual(ticket);
        exitosos++;
      } catch (error) {
       
        fallidos++;
      }
    }

   
    await cargarTicketsAuto();
    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white py-10 px-6">

      <h1 className="text-4xl font-extrabold text-center text-[#101dcf] tracking-wide drop-shadow-lg mb-10">
       {t("autotriage.title")}
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-10">
        <button
          onClick={() => {
            setTab("auto");
            cargarTicketsAuto();
          }}
          className={`px-10 py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-300
            ${tab === "auto"
              ? "bg-blue-600 border-blue-800 text-white scale-110 shadow-xl"
              : "bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-100"}
          `}
        >
          {t("autotriage.autoTab")}
        </button>

        <button
          onClick={() => {
            setTab("manual");
            cargarTicketsManual();
          }}
          className={`px-10 py-4 rounded-xl font-bold text-lg shadow-md border-2 transition-all duration-300
            ${tab === "manual"
              ? "bg-blue-600 border-blue-800 text-white scale-110 shadow-xl"
              : "bg-white border-blue-600 text-blue-700 hover:bg-blue-100"}
          `}
        >
         {t("autotriage.manualTab")}
        </button>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto bg-white/60 backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-blue-300">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-center text-lg text-gray-600">Cargando tickets...</p>
          </div>
        ) : tab === "auto" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-blue-900">
               {t(AutotriagePage.autoTitle)}
              </h2>
              
              {ticketsAuto.length > 0 && (
                <button
                  onClick={asignarTodosAuto}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition"
                >
               {t("autotriage.assignAll")} ({ticketsAuto.length})
                </button>
              )}
            </div>

            {ticketsAuto.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600"> {t("autotriage.noAutoTickets")} </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ticketsAuto.map((f) => (
                  <div 
                    key={f.TicketId} 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl text-blue-900 flex-1">
                        {f.Title}
                      </h3>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        #{f.TicketId}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-gray-800">
                        <span className="font-semibold"> {t("autotriage.category")}  </span> {f.CategoryName}
                      </p>
                      <p className="text-gray-800">
                        <span className="font-semibold">{t("autotriage.priority")}</span> {f.PriorityName}
                      </p>
                      <p className="text-gray-800">
                        <span className="font-semibold">{t("autotriage.score")}</span> 
                        <span className="text-blue-700 font-bold ml-2">
                          {f.Puntaje?.toFixed(2)}
                        </span>
                      </p>
                      <p className="text-gray-800">
                        <span className="font-semibold">{t("autotriage.slaRemaining")}</span> 
                        <span className={`ml-2 font-bold ${
                          f.HorasRestantes < 2 ? 'text-red-600' : 
                          f.HorasRestantes < 8 ? 'text-orange-600' : 
                          'text-green-600'
                        }`}>
                          {f.HorasRestantes?.toFixed(1)}h
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => asignarAutoIndividual(f)}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-[#DFA200] to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:from-yellow-600 hover:to-[#DFA200] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                     {t("autotriage.assignAuto")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-700 text-center mb-6">
             {t("autotriage.manualTitle")}
            </h2>

            {ticketsManual.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600">
                   {t("autotriage.noManualTickets")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ticketsManual.map((f) => (
                  <div 
                    key={f.TicketId} 
                    className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl text-red-800 flex-1">
                        {f.Title}
                      </h3>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        #{f.TicketId}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-gray-800">
                        <span className="font-semibold"> {t("autotriage.category")} </span> {f.CategoryName}
                      </p>
                      <p className="text-gray-800">
                        <span className="font-semibold">{t("autotriage.priority")}</span> {f.PriorityName}
                      </p>
                      <p className="text-sm text-gray-600 italic">
                         {t("autotriage.noManualTickets")}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                      {t("autotriage.selectTech")}
                      </label>
                      
                      <select
                        value={selectedTech[f.TicketId] || "default"}
                        onChange={(e) => {
                          setSelectedTech(prev => ({
                            ...prev,
                            [f.TicketId]: e.target.value
                          }));
                        }}
                        className="w-full border-2 border-red-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                      >
                        <option value="technician"> {t("autotriage.selectTechDefault")} </option>

                        {(tecnicosDisponibles[f.TicketId] || []).map((tec) => (
                          <option key={tec.TechnicianId} value={tec.TechnicianId}>
                            {tec.UserName} ({tec.CurrentTicketCount} tickets) - {tec.Specialities}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => asignarManualIndividual(
                          f.TicketId, 
                          selectedTech[f.TicketId],
                          f
                        )}
                        disabled={!selectedTech[f.TicketId] || selectedTech[f.TicketId] === "default" || loading}
                        className={`w-full py-3 font-bold rounded-xl shadow-lg transition-all duration-300 transform
                          ${selectedTech[f.TicketId] && selectedTech[f.TicketId] !== "default" && !loading
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105 cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                     {t("autotriage.assignManual")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}