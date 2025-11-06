import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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


export function MaintainTechnician() {

  const [rolesList, setRolesList] = useState([]);
  const [dataSpecialities, setDataSpecialities] = useState([]);
  const [dataSeguros, setDataSeguros] = useState([]);
  const [dataTechnicians, setDataTechnicians] = useState([]);
  const [error, setError] = useState(null);

 /*** Esquema de validación Yup ***/
  const technicianSchema= yup.object({
    name: yup.string()
            .required('El nombre completo es requerido')
            .min(2, "El título debe tener al menos 2 caracteres"),
    seguro: yup 
      .number() 
      .typeError('Solo acepta números') 
      .required('El año es requerido') 
      .positive('Solo acepta números positivos'), 
    email: yup.string()
          .required("El email es requerido")
          .email("El email no es válido"),
              trabajocargo: yup.string()
      .required("El cargo de trabajo es requerido")
      .min(2, "El cargo de trabajo debe tener al menos 2 caracteres"),
    password: yup.string()
      .required("La contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    idrole: yup.array().min(1, 'El rol es requerido'),
    speciality_id: yup.array().of(
      yup.object().shape({ 
        actor_id: yup 
          .number() 
          .typeError('La especialidad es requerida') 
          .required('La especialidad es requerida'), 
        role: yup.string().required('La especialidad es requerida'), 
      }), 
    ), 
  })



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
      idrole: "",
      trabajocargo: "",
      speciality_id: [],

    },
    resolver:yupResolver(technicianSchema),
  });

  //Acciones para la gestión del array de especialidades


const { fields, append, remove } = useFieldArray({
  control,
  name: "speciality_id",
});


const addNewSpeciality = () => {
  append({ speciality_id: "", name: "" });
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
        // Si la petición es exitosa, se guardan los datos 
        setDataSpecialities(specialitiesRes.data.data || []); 
        setDataSeguros(segurosRes.data.data || []); 
        setDataTechnicians(techniciansRes.data.data || []); 
        console.log(specialitiesRes) 
        console.log(segurosRes) 
        console.log(techniciansRes) 
      } catch (error) {
        console.log(error)
        if(error.name != "AbortError") setError(error.message)
      }
    }
    fechData()
  },[])


/*** Submit ***/
const onSubmit = async (dataForm) => {
  try {
    // Crear técnico en el API
    const response = await TechniciansLists.create(dataForm);
    if (response.data) {
      toast.success(`Técnico creado #${response.data.data.id} - ${response.data.data.name}`, {
        duration: 4000,
        position: "top-center",
      });
      navigate("/maintenance/table");
    } else if (response.error) {
      setError(response.error);
    }
  } catch (err) {
    console.error(err);
    setError("Error al crear técnico");
  }
};



  return (

<Card className="p-6 max-w-5xl mx-auto">
  <h2 className="text-2xl font-bold mb-6">Crear Técnico</h2>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    
    {/* Nombre completo y correo */}
    <div className="grid sm:grid-cols-2 gap-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <CustomInputField
            {...field}
            label="Nombre completo"
            placeholder="Ashley Rojas"
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
            placeholder="ashley@example.com"
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
            getOptionLabel={(item) => `${item.name}`}
            getOptionValue={(item) => item.id}
            error={errors.seguro?.message}
          />
        )}
      />
    </div>

    {/* Cargo y rol */}
    <div className="grid sm:grid-cols-2 gap-4">
      <Controller
        name="trabajocargo"
        control={control}
        render={({ field }) => (
          <CustomInputField
            {...field}
            label="Cargo de trabajo"
            placeholder="Electricista"
            error={errors.trabajocargo?.message}
          />
        )}
      />

      <Controller
        name="idrole"
        control={control}
        render={({ field }) => (
          <CustomMultiSelect
            field={field}
            data={rolesList}
            label="Roles asignados"
            getOptionLabel={(item) => item.role}
            getOptionValue={(item) => item.id}
            error={errors.idrole?.message}
            placeholder="Seleccione roles"
          />
        )}
      />
    </div>

    {/* Especialidades (useFieldArray) */}
    <div>
      <div className="flex items-center justify-between">
        <Label className="block mb-1 text-sm font-medium">Especialidades</Label>
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
            key={field.id}
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
        variant="default"
        className="flex items-center gap-2 bg-accent text-white"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar
      </Button>
      <Button type="submit" className="flex-1">
        <Save className="w-4 h-4" />
        Guardar
      </Button>
    </div>
  </form>
</Card>

  );
}
