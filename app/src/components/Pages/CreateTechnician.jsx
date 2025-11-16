import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation} from "react-router-dom";



import { toast } from "react-hot-toast";


import { useForm, Controller, useFieldArray } from "react-hook-form";

//servicios tecnicos, especialidades, seguros
import TechniciansLists from "../../Services/TechniciansLists";
import SpecialitiesList from "../../Services/SpecialitiesList";
import { data } from "autoprefixer";

//Componentes UI
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Plus, Save, ArrowLeft } from "lucide-react";
import { Card } from "../../components/ui/card";

import { CustomInputField } from "../../components/ui/custom/custom-input-field";
import { CustomSelect } from "../../components/ui/custom/custom-select";
import { CustomMultiSelect } from "../../components/ui/custom/custom-multiple-select";
import { SpecialityForm } from "../../components/ui/SpecialityForm";  



import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";


export function CreateTechnician() {

const navigate = useNavigate();
const location = useLocation();



const rolesList = [{ id: 1, role: "Técnico" }];

  const [dataSpecialities, setDataSpecialities] = useState([]);
  const [dataSeguros, setDataSeguros] = useState([]);
  const [dataTechnicians, setDataTechnicians] = useState([]);
  const [error, setError] = useState(null);

 /*** Esquema de validación Yup ***/
const technicianSchema = yup.object({
  name: yup.string().required("El nombre completo es requerido").min(2, "Debe tener al menos 2 caracteres"),
  seguro: yup.number()
    .typeError("Debe seleccionar un seguro").required("El seguro es requerido").positive("Valor inválido"),
  email: yup.string().required("El email es requerido") .email("Formato de email no válido"),
  trabajocargo: yup.string().required("El cargo de trabajo es requerido").min(2, "Debe tener al menos 2 caracteres"),
 password: yup.string().required("La contraseña es requerida").min(6, "Mínimo 6 caracteres"),
  idrol: yup.number().required("El rol es requerido"),
especialidades: yup
    .array()
    .of(
      yup.object({
        Id: yup
          .number()
          .typeError("Debe seleccionar una especialidad")
          .required("La especialidad es repetida"),
      })
    )
    .min(1, "Debe seleccionar al menos una especialidad"),
    
});

  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
 defaultValues: {
  name: "",
  seguro: "",
  email: "",
  password: "",
  idrol: 1, 
  trabajocargo: "",
  especialidades: [], 
}
,

    resolver:yupResolver(technicianSchema),
  });

  //Acciones para la gestión del array de especialidades


const { fields, append, remove } = useFieldArray({
  control,
  name: "especialidades",
});


const addNewSpeciality = () => {
   append({ Id: null });
};

const removeSpeciality = (index) => {
  if (fields.length > 1) remove(index);
};


  /***Listados de carga en el formulario ***/
  useEffect(()=>{
    const fechData=async()=>{
      try {
        //Lista de especialidades
        const specialitiesRes= await SpecialitiesList.getAll()
        //Lista de seguros
        const segurosRes= await TechniciansLists.getSeguros()
        //Lista de tecnicos
        const techniciansRes= await TechniciansLists.getAllTechnicians()
        // s la petición es exitosa, se guardan los datos 
        setDataSpecialities(specialitiesRes.data.data || []); 
        setDataSeguros(segurosRes.data.data || []); 
        setDataTechnicians(techniciansRes.data.data || []); 
    
        
      } catch (error) {
        console.log(error)
        if(error.name != "AbortError") setError(error.message)
      }
    }
    fechData()
  },[])


/*** Submit ***/

const onSubmit = async (dataForm) => {

  const ids = dataForm.especialidades.map(e => e.Id);
  const hayRepetidos = new Set(ids).size !== ids.length;

  if (hayRepetidos) {
    toast.error("No se puede seleccionar especialidades repetidas");
    return;
  }

  try {
    const response = await TechniciansLists.create(dataForm);

    if (response.data?.success === true) {
      toast.success(`Técnico ${dataForm.name} creado exitosamente`);
      navigate(-1);
      return;
    }

    

  } catch (err) {
   
    
    toast.error(err.response?.data?.message || "Error al crear técnico");
  }
};




  return (

<Card className="p-6 max-w-5xl mx-auto mt-16 border-2 border-[#DFA200] rounded-xl shadow-md">


     <h1 className="text-2xl font-semibold tracking-tight text-[#071f5f] font-sans">
    Crear Técnico
</h1>


  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
    
    {/* Nombre completo y correo */}
    <div className="grid sm:grid-cols-2 gap-4 ">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <CustomInputField
            {...field}
            label="Nombre completo"
            placeholder="Su nombre completo"
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <CustomInputField
            {...field}
            label="Correo electrónico"
            placeholder="technician@Helpdesk.com"
            error={errors.email?.message}
          />
        )}
      />
    </div>

    {/* Contraseña y seguro */}
    <div className="grid sm:grid-cols-2 gap-4">
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <CustomInputField
            {...field}
            type="password"
            label="Contraseña"
            placeholder="********"
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        name="seguro"
        control={control}
        render={({ field }) => (
          <CustomSelect
            field={field}
            data={dataSeguros}
            label="Seguro médico"
            getOptionLabel={(item) => `${item.Name}`}
            getOptionValue={(item) => item.Id}
            error={errors.seguro?.message}
          />
        )}
      />

      
    </div>

    {/* Cargo*/}
    <div className="grid sm:grid-cols-2 gap-4">
      <Controller
        name="trabajocargo"
        control={control}
        render={({ field }) => (
          <CustomInputField
            {...field}
            label="Cargo de trabajo"
            placeholder="Accountant"
            error={errors.trabajocargo?.message}
          />
        )}
      />



    </div>

    {/* Especialidades (useFieldArray) */}
    <div>
      <div className="flex items-center justify-between">
        <Label className="block mb-1 text-sm font-medium">Especialidades</Label> {errors.especialidades && ( <p className="text-red-500 text-xs mt-1">
        {errors.especialidades.message}
      </p>
    )}



        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" onClick={addNewSpeciality}
              className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Agregar especialidad</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-4 mt-3">
        {fields.map((field, index) => (
          <SpecialityForm
            key={field.Id}
            index={index}
            control={control}
            data={dataSpecialities}
            onRemove={removeSpeciality}
            disableRemoveButton={fields.length === 1}
            error={errors}
          />
        ))}
      </div>
    </div>

    <div className="flex justify-between gap-4 mt-6">

<Button
  type="button"
  onClick={() => {
    if (location.key !== "default") navigate(-1);
    else navigate("/technicians");
  }}
  className="flex items-center gap-2 bg-[#DFA200] text-white rounded-xl shadow-md hover:bg-[#c48c00]"
>
  <ArrowLeft className="w-4 h-4" />
  Regresar
</Button>


<Button
  type="submit"
  className="flex-1 bg-[#071f5f] text-white rounded-xl shadow-md hover:bg-[#052046]"
>
  <Save className="w-4 h-4" />
  Guardar
</Button>


    </div>
  </form>
</Card>

  );
}
