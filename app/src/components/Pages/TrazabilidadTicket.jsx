import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketLists from "../../Services/TicketsLists";
import ImageService from "../../Services/ImagenList";
import NotificationsService from "../../Services/NotificationServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { CustomInputField } from "../../components/ui/custom/custom-input-field";
import { Plus, Save, ArrowLeft } from "lucide-react";
import { useUser } from '../../context/UserContext';
import ComponentCardCronology from "../ui/ComponentCardCronology";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

import { faArrowLeft,
  faTicket,
  faClipboardList,
  faFolder,
faUser,
faTriangleExclamation,
faUserTie,
faComments,
faStar,
faCalendarDays,
faCamera,
faFire,
faX,
faCheck,
faQuestion,
faMagnifyingGlass,
faClock,
faAlarmClock,
faStopwatch
 } from "@fortawesome/free-solid-svg-icons";


export function TrazabilidadTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [loading, setLoading] = useState(true);
    const { selectedUser } = useUser();
  const [error, setError] = useState(null);
  const [fechaHora, setFechaHora] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const { t } = useTranslation();

  
   /*** Esquema de validación Yup ***/
  const TicketSchemaTrazabilidad = yup.object({
 observacion: yup.string().nullable(),
  imagen: yup.mixed().nullable()
  });
  

 /*** React Hook Form ***/
const { control, handleSubmit, register, watch, setValue, formState:{ errors } } = useForm({

defaultValues: {
  title: "",
  descripcion: "",
  categoriaNombre: "",
  prioridad: "",
  fecha_creacion: new Date().toISOString().split("T")[0],
  estado: "Pendiente",
  tags: "",
  categoriaId: null,
  responsableuser: null,
  observacion: "",
}, resolver:yupResolver(TicketSchemaTrazabilidad), });




 /*** Manejo de imagen ***/
const handleChangeImage = (e) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile));
    setValue("imagen", selectedFile);
  } else {
    setValue("imagen", null);
  }
};


useEffect(() => {
  const fetchTicketDetail = async () => {
    try {
      const response = await TicketLists.GetTicketById(id);
    
      const resp = await TicketLists.GetHoraFecha();
       setFechaHora(resp.data.data[0].FechaHoraActual);
   
     const result = await TicketLists.getHistoryByTicket(id);
    let historyData = [];

if (Array.isArray(result.data.data)) {
  historyData = result.data.data;
}
setHistory(historyData);

      const rows = response.data.data;
      const t = rows[0];

      // Agrupamos los posibles comentarios, valoraciones y evidencias
      const comments = rows
        .filter(r => r.CommentId && r.CommentText)
        .map(r => ({
          id: r.CommentId,
          user: r.CommentUser || "Usuario desconocido",
          text: r.CommentText,
          date: r.CommentDate
        }));

      const ratings = rows
        .filter(r => r.RatingId && r.Rating)
        .map(r => ({
          id: r.RatingId,
          user: r.RatingUser || "Usuario desconocido",
          rating: r.Rating,
          comment: r.RatingComment,
          date: r.Rating_Date
        }));

     const evidences = rows
  .filter(r => r.EvidencePath)
  .map(r => {
  
    return {
      id: r.EvidenceId || Math.random(),
      path: r.EvidencePath
    };
  });

  const ticketDetail = response.data.data[0];
const clientId = ticketDetail.IdCliente;


      const mappedTicket = {
        ticketId: t.TicketId || "N/A",
        title: t.Title || "Sin título",
        description: t.Description || "Sin descripción",
        priority: t.Priority || 1,
        state: t.State || "Pendiente",
        startDate: t.Ticket_Start_Date || null,
        endDate: t.Ticket_End_Date || null,
        Category: t.Category || "Sin categoría",
        technician: t.Tecnico || "Sin asignar",
        client: t.Cliente || "Desconocido",
        Ticket_Response_SLA: t.Ticket_Response_SLA || null,
        Ticket_Resolution_SLA: t.Ticket_Resolution_SLA || null,
         IdCliente: clientId,
        comments,
        ratings,
        evidences
      };
      

      console.log("Mapped ticket:", mappedTicket);
      setTicket(mappedTicket);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Error al cargar el detalle del ticket");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchTicketDetail();
  } else {
    setError("ID de ticket no válido");
    setLoading(false);
  }
}, [id]);
   
const fechaHoraLocal = fechaHora ? fechaHora.replace(" ", "T").slice(0, 16) : "";

const onSubmit = async (dataForm) => {
 const nextState = getNextState(ticket.state);

  

const payload = {
    TicketId: id,
    NewState: nextState,  
    Comment: dataForm.observacion,
    UserId: selectedUser.Id, //user a cargo (luego cambiamos esto vdd importante!!)

  };

 
  
  if (ticket.state == "Cerrado") {
     toast.error(`El flujo del ticket ya está cerrado`);
    return null;
  }
setIsSubmitting(true);
    const response = await TicketLists.ChangeState(payload);



if (response.data?.success) {
const historyId = response.data.data.historyId;


if (nextState === "Cerrado") {
  await TicketLists.SetEndDate({ TicketId: id });
}


    if (file) {
        const formData = new FormData();
   
        formData.append("file", file);
        formData.append("ticket_id", id);
        formData.append("history_id", historyId);

        const imgResponse = await ImageService.uploadEvidence(formData);

        if (imgResponse.data.success) {
            toast.success("Evidencia adjuntada");
        }
    }
    //notificaciones, enviar



    await NotificationsService.InsertNotificationClienteFlowTicket(selectedUser.Id, id, ticket.IdCliente, ticket.state, nextState);
    await NotificationsService.InsertNotificationTechnicianFlowTicket(selectedUser.Id, id, ticket.state, nextState);
   
 
    toast.success("Estado del ticket actualizado");



  } else {
    setIsSubmitting(false); 
  }



    
};

  const getPriorityConfig = (priority) => {
    const priorityNum = parseInt(priority, 10);
    switch (priorityNum) {
      case 3:
        return { 
          label: "Alta", 
          color: "bg-red-600", 
          bgLight: "bg-red-50",
          textColor: "text-red-600",
          borderColor: "border-red-600"
        };
      case 2:
        return { 
          label: "Media", 
          color: "bg-yellow-500", 
          bgLight: "bg-yellow-50",
          textColor: "text-yellow-600",
          borderColor: "border-yellow-500"
        };
      case 1:
        return { 
          label: "Baja", 
          color: "bg-green-600", 
          bgLight: "bg-green-50",
          textColor: "text-green-600",
          borderColor: "border-green-600"
        };
      default:
        return { 
          label: "Desconocida", 
          color: "bg-gray-600", 
          bgLight: "bg-gray-50",
          textColor: "text-gray-600",
          borderColor: "border-gray-600"
        };
    }
  };
  


  const getStateConfig = (state) => {
    // Manejar tanto números como strings
    const stateStr = String(state).toLowerCase();
    
    if (stateStr === "pendiente" || stateStr === "1") {
      return { 
        label: "Pendiente", 
        color: "bg-gray-100 text-gray-800",
        icon: <FontAwesomeIcon icon={faTriangleExclamation} />
      };
    }
    if (stateStr === "asignado" || stateStr === "2") {
      return { 
        label: "Asignado", 
        color: "bg-blue-100 text-blue-800",
        icon: <FontAwesomeIcon icon={faClipboardList} />
      };
    }
    if (stateStr === "en proceso" || stateStr === "3") {
      return { 
        label: "En Proceso", 
        color: "bg-yellow-100 text-yellow-800",
        icon: <FontAwesomeIcon icon={faFire} />
      };
    }
    if (stateStr === "resuelto" || stateStr === "4") {
      return { 
        label: "Resuelto", 
        color: "bg-green-100 text-green-800",
        icon: <FontAwesomeIcon icon={faCheck} />
      };
    }
    if (stateStr === "cerrado" || stateStr === "5") {
      return { 
        label: "Cerrado", 
        color: "bg-purple-100 text-purple-800",
        icon: <FontAwesomeIcon icon={faX} />
      };
    }
    
    return { 
      label: state || "Desconocido", 
      color: "bg-gray-100 text-gray-800",
      icon: <FontAwesomeIcon icon={faQuestion} />
    };
  };




  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Cargando detalles del ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <span className="text-6xl mb-4 block"> <FontAwesomeIcon icon={faTriangleExclamation} /></span>
          <p className="text-red-500 text-lg mb-4">{error}</p>
         <button
  onClick={() => navigate(-1)}  
  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
>
  Volver
</button>

        </div>
      </div>
    );
  }

  

  const stateConfig = getStateConfig(ticket.state);

const getNextState = (currentState) => {
  switch (currentState) {
    case "Pendiente": return "Asignado";
    case "Asignado": return "En Proceso";
    case "En Proceso": return "Resuelto";
    case "Resuelto": return "Cerrado";
    case "Cerrado": return "Flujo del ticket Cerrado"; 
    default: return null;
  }
};



 const priorityConfig = getPriorityConfig(ticket.priority);
 const nextState = getNextState(ticket.state);

  



return (
<div className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-10 pb-24">

    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition font-semibold"
      >
        <span className="text-xl">←</span>
        <span>{t("ticketTraceability.backToList")}</span>
      </button>

      {/* Tarjeta Principal del Ticket */}
      <div className={`bg-white rounded-2xl shadow-xl p-8 border-2 ${priorityConfig.borderColor} mb-6`}>
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
          <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-4xl"> <FontAwesomeIcon icon={faTicket} /></span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {ticket.title}
          </h1>
          <p className="text-gray-600 text-sm mb-3">Ticket #{ticket.ticketId}</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <span className={`inline-block ${priorityConfig.color} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
              <FontAwesomeIcon icon={faFire} /> {t("ticketTraceability.priority")}:{priorityConfig.label}
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
            {t("ticketTraceability.description")}</h3>
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {/* Información del Ticket */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-xl"> <FontAwesomeIcon icon={faFolder} /></span>
              <p className="font-semibold text-gray-700">{t("ticketTraceability.category")}</p>
            </div>
            <p className="text-gray-900 font-medium">{ticket.Category}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-xl"> <FontAwesomeIcon icon={faUser} /></span>
              <p className="font-semibold text-gray-700">{t("ticketTraceability.client")}</p>
            </div>
            <p className="text-gray-900 font-medium">{ticket.client}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-xl"> <FontAwesomeIcon icon={faUserTie} /></span>
              <p className="font-semibold text-gray-700">{t("ticketTraceability.assignedTechnician")}</p>
            </div>
            <p className="text-gray-900 font-medium">
              {ticket.technician === "Sin asignar" ? (
                <span className="text-gray-500 italic">{ticket.technician}</span>
              ) : (
                ticket.technician
              )}
            </p>
          </div>

          <div className={`${priorityConfig.bgLight} p-4 rounded-lg border-l-4 ${priorityConfig.borderColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`${priorityConfig.textColor} text-xl`}> <FontAwesomeIcon icon={faTriangleExclamation} /></span>
              <p className="font-semibold text-gray-700">{t("ticketTraceability.priorityLevel")}</p>
            </div>
            <p className={`${priorityConfig.textColor} font-bold text-lg`}>
              {priorityConfig.label}
            </p>
          </div>
        </div>
      </div>


      {/* COMENTARIOS*/}
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-600 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <FontAwesomeIcon icon={faComments} className="text-blue-500 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-900">{t("ticketTraceability.comments")}</h2>
        </div>

        {ticket.comments?.length > 0 ? (
          <div className="space-y-4">
            {ticket.comments.map((c) => (
              <div key={c.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-gray-900 font-medium">{c.text}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {t("ticketTraceability.by")} {c.user} — {c.date}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">{t("ticketTraceability.noHistory")}</p>
        )}
      </div>

  

 {/* CRONOLOGIA FLUJO ESTADO DEL TICKET */}  
<ComponentCardCronology history={history} />


{history.length === 0 && (
  <div className="text-center py-10">
    <p className="text-gray-500 italic text-lg">
      Aún no se ha registrado ningún movimiento en este ticket.
    </p>

    <div className="mt-4 flex justify-center">
      <div className="w-32 h-32 opacity-40">
        <img
          src="https://cdn-icons-png.flaticon.com/512/992/992651.png"
          alt="no-history"
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  </div>
)}
  


{/* a partir de aqui es el mantenimiento de trazabilidad de ticket */}
<div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-800">

  <div className="flex items-center gap-3 mb-6">
    <FontAwesomeIcon icon={faTicket} className="text-blue-600 text-2xl" />
    <h2 className="text-2xl font-bold text-gray-900">{t("ticketTraceability.updateState")}</h2>
  </div>

  {/* estado */}
  <div className="flex flex-wrap gap-2 mb-6">
    <span className={`inline-block ${stateConfig.color} px-4 py-2 rounded-full text-sm font-semibold  `}>
      {t("ticketTraceability.currentState")} {stateConfig.label}
    </span>


<span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
  {t("ticketTraceability.nextState")} {nextState}
</span>

  </div>

  {/* form*/}
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <div className="grid sm:grid-cols-2 gap-6">
      <div>
        <label className="block mb-1 text-sm font-medium">{t("ticketTraceability.dateTime")}  </label>
        <input
          type="datetime-local"
          value={fechaHoraLocal}
          readOnly
          className="w-full rounded-xl border border-gray-300 shadow-sm text-base p-2 bg-gray-100"
        />
      </div>

      {/* responsalbe*/}
      <div>
        <label className="block mb-1 text-sm font-medium  items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-blue-600" />
          {t("ticketTraceability.responsible")}
        </label>
        <div className="p-2 px-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900">
          {ticket.client}
        </div>
      </div>

    </div>

    {/* OBSERVACIÓN */}
    <div>
      <Controller
        name="observacion"
        control={control}
        render={({ field }) => (
          <CustomInputField
            {...field}
           label={t("ticketTraceability.observation")}
           placeholder={t("ticketTraceability.observationPlaceholder")}
            error={errors.observacion?.message}
          />
        )}
      />
    </div>

    {/* IMAGEN */}
    <div className="flex flex-col items-start">
      <label className="mb-2 text-sm font-medium">{t("ticketTraceability.evidence")}</label>

      <div
        className="relative w-56 h-56 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-500 transition"
        onClick={() => document.getElementById("image").click()}
      >
        {!fileURL && (
          <div className="text-center px-4 text-gray-500">
            <p>{t("ticketTraceability.imageHelp")}</p>
            <p className="text-xs">({t("ticketTraceability.imageFormat")})</p>
          </div>
        )}

        {fileURL && (
          <img
            src={fileURL}
            alt="preview"
            className="w-full h-full object-contain rounded-lg shadow-sm"
          />
        )}
      </div>

          <input
        type="file"
        id="image"
        className="hidden"
        accept="image/*"
        {...register("imagen")}
        onChange={handleChangeImage}
      />

    </div>

    {/* BOTÓN */}
    <div className="flex justify-end">
      <Button
        type="submit"
          disabled={isSubmitting}
        className="px-6 py-3 bg-[#071f5f] text-white rounded-xl shadow-md hover:bg-[#052046] flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {t("ticketTraceability.updateButton")}
      </Button>
    </div>

  </form>

</div>




    </div> 

  </div>

  
);

}