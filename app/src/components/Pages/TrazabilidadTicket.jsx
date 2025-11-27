import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketLists from "../../Services/TicketsLists";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { CustomInputField } from "../../components/ui/custom/custom-input-field";
import { Plus, Save, ArrowLeft } from "lucide-react";

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
    const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 


  
   /*** Esquema de validación Yup ***/
  const TicketSchemaTrazabilidad = yup.object({
    responsableuser: yup.string().required("La descripción es requerida"),
    estadoanterior: yup.number().typeError("Debe seleccionar una prioridad").required("La prioridad es requerida"),
    nuevoestado: yup.string().required(),
    observacion: yup.string().required(),
    imagen: yup.number().required("La etiqueta es requerida"),
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
  categoriaId: null
}, resolver:yupResolver(TicketSchemaTrazabilidad), });


const onSubmit = async (dataForm) => {

console.log("categoriaId:", dataForm.categoriaId)

    const response = await TicketsLists.createticket(body);

    if (response.data?.success === true) {
      toast.success(`Ticket creado exitosamente`);
      navigate(-1);
      return;
    }

    
};


 /*** Manejo de imagen ***/
  const handleChangeImage = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    }
  };


useEffect(() => {
  const fetchTicketDetail = async () => {
    try {
      const response = await TicketLists.GetTicketById(id);
      console.log("Detalle del ticket:", response.data);

      if (!response.data || !response.data.data || response.data.data.length === 0) {
        throw new Error("No se encontraron datos del ticket");
      }

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
    console.log("EVIDENCE PATH:", r.EvidencePath); // ← aquí sí funciona

    return {
      id: r.EvidenceId || Math.random(),
      path: r.EvidencePath
    };
  });


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

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    
    try {
      const date = new Date(dateString);
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha inválida";
    }
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


  const priorityConfig = getPriorityConfig(ticket.priority);
  const stateConfig = getStateConfig(ticket.state);


return (
  <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-8">
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition font-semibold"
      >
        <span className="text-xl">←</span>
        <span>Volver a la lista</span>
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
              <FontAwesomeIcon icon={faFire} /> Prioridad: {priorityConfig.label}
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
            Descripción</h3>
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {/* Información del Ticket */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-xl"> <FontAwesomeIcon icon={faFolder} /></span>
              <p className="font-semibold text-gray-700">Categoría</p>
            </div>
            <p className="text-gray-900 font-medium">{ticket.Category}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-xl"> <FontAwesomeIcon icon={faUser} /></span>
              <p className="font-semibold text-gray-700">Cliente</p>
            </div>
            <p className="text-gray-900 font-medium">{ticket.client}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-xl"> <FontAwesomeIcon icon={faUserTie} /></span>
              <p className="font-semibold text-gray-700">Técnico Asignado</p>
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
              <p className="font-semibold text-gray-700">Nivel de Prioridad</p>
            </div>
            <p className={`${priorityConfig.textColor} font-bold text-lg`}>
              {priorityConfig.label}
            </p>
          </div>
        </div>
      </div>


     
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-500 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <FontAwesomeIcon icon={faCamera} className="text-green-500 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-900">Evidencias</h2>
        </div>

        {ticket.evidences?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ticket.evidences.map((e) => (
              <div key={e.id} className="rounded-lg overflow-hidden shadow-md">
                             <img 
                  src={e.path} 
                  alt="Evidencia"
                  className="object-cover w-full h-48"
                />

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay evidencias registradas.</p>
        )}
      </div>


    {/* a partir de aqui es el mantenimiento de trazabilidad de ticket*/}
<div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-800">

  <div className="flex items-center gap-2 mb-6">
  <span className="text-purple-500 text-2xl">
<FontAwesomeIcon icon={faTicket} className="text-blue-600 text-2xl" />

</span>

    <h2 className="text-2xl font-bold text-gray-900">Trazabilidad del Ticket</h2>
  </div>
 <span className={`inline-block ${stateConfig.color} px-4 py-2 rounded-full text-sm font-semibold`}>
              Estado Actual: {stateConfig.icon} {stateConfig.label}
            </span>
<span className={`inline-block ${stateConfig.color} px-4 py-2 rounded-full text-sm font-semibold`}>
              Estado a Actualizar: {stateConfig.icon} {stateConfig.label}
            </span>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
    <div className="grid sm:grid-cols-2 gap-4 ">
              
<div className="mb-4">
  <label className="block mb-1 text-sm font-medium">Fecha y hora de creación</label>
  <input
    type="datetime-local"
    defaultValue={(() => {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localTime = new Date(now - offset);
      return localTime.toISOString().slice(0, 16);
    })()}
    disabled={true}
    className="w-full rounded-xl border border-gray-300 shadow-sm text-base p-2"
  />
</div>



    {/* usuario responsable*/}
      
      <div className="mb-2">
  <div className="flex items-center gap-1 mb-1">
    <span className="text-blue-600 text-xl">
      <FontAwesomeIcon icon={faUser} />
    </span>
    <p className="font-semibold text-gray-700">Usuario responsable</p>
  </div>
  <p className="text-gray-900 font-normal">
    {ticket.client}
  </p>
</div>



    </div>

   {/* obser */}
        <Controller
          name="observacion"
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Observación"
              placeholder="Escriba su observación..."
              error={errors.description?.message}
            />
          )}
        />

        {/* Imagen */}
        <div className="mb-6">
        
          <div
            className="relative w-56 h-56 border-2 border-dashed border-muted/50 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors"
            onClick={() => document.getElementById("image").click()}
          >
            {!fileURL && (
              <div className="text-center px-4">
                <p className="text-sm text-muted-foreground">Haz clic o arrastra una imagen</p>
                <p className="text-xs text-muted-foreground">(jpg, png, máximo 5MB)</p>
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
            onChange={handleChangeImage}
          />
        </div>

<Button
  type="submit"
  className="flex-1 bg-[#071f5f] text-white rounded-xl shadow-md hover:bg-[#052046]">
  <Save className="w-4 h-4" />
  Guardar
</Button>
 </form>
  </div>
</div>
    </div> 

  </div>

  
);

}