import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
import { useTranslation } from 'react-i18next';
import { CustomInputField } from "../../components/ui/custom/custom-input-field";
import { CustomSelect } from "../../components/ui/custom/custom-select";
import { CustomMultiSelect } from "../../components/ui/custom/custom-multiple-select";
import { SpecialityForm } from "../../components/ui/SpecialityForm";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";


export function UpdateTechnician() {
const { t } = useTranslation();

const { id } = useParams();
const navigate = useNavigate();
const location = useLocation();

  const [dataTechnician, setDataTechnician] = useState([]);
  const [dataSpecialities, setDataSpecialities] = useState([]);
  const [dataSeguros, setDataSeguros] = useState([]);


 /*** Esquema de validación Yup ***/
const technicianSchema = yup.object({
  name: yup.string().required(t('updateTechnician.validation.nameRequired')).min(2, t('updateTechnician.validation.nameMin')),
  seguro: yup.number().typeError(t('updateTechnician.validation.insuranceInvalid')).required(t('updateTechnician.validation.insuranceRequired')).positive(t('updateTechnician.validation.insuranceInvalid')),
  email: yup.string().required(t('updateTechnician.validation.emailRequired')).email(t('updateTechnician.validation.emailInvalid')),
  trabajocargo: yup.string().required(t('updateTechnician.validation.workPositionRequired')).min(2, t('updateTechnician.validation.workPositionMin')),
  password: yup.string().required(t('updateTechnician.validation.passwordRequired')).min(6, t('updateTechnician.validation.passwordMin')),
  especialidades: yup.array().of(
    yup.object({
      Id: yup.number().typeError(t('updateTechnician.validation.specialtyInvalid')).required(t('updateTechnician.validation.specialtyRequired')),
    })
  ).min(1, t('updateTechnician.validation.specialtiesMin')),
});


  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm({
 defaultValues: {
  id: "",
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
    
      
        const TechnicianRes = await TechniciansLists.GetDetailTechnicianById(id);

        setDataSpecialities(specialitiesRes.data.data || []); 
        setDataSeguros(segurosRes.data.data || []); 
        setDataTechnician(TechnicianRes.data.data || []); 

   try {
   
    
   if (TechnicianRes.data) {
          const technician = TechnicianRes.data.data[0];
          console.log(technician)
       
    reset({
      id: technician.Id,
      name: technician.UserName,
      email: technician.Email,
      seguro: technician.idInsu, 
      password: technician.Password,
      trabajocargo: technician.Work_Charge,
      especialidades: technician.Especialidades.map(e => ({ Id: e.Id }))
    });
       
          //Guardar
          setDataTechnician(technician)
        }



   } catch (error) {
         if (error.name !== "AbortError") setError(error.message)
       
   }
       
    
        
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
toast.error(t('updateTechnician.duplicateSpecialties'));
    return;
  }

  try {

   
    const response = await TechniciansLists.update(dataForm);


    if (response.data) {
      const formData = new FormData();
      formData.append("Id", response.data.data.id);
      
    toast.success(t('updateTechnician.technicianUpdated'));
      navigate(-1);
      return;
    }

    
  } catch (err) {
    
    toast.error(err.response?.data?.message || "Error al actualizar técnico");
  }
};

  return (
    
<Card className="p-6 max-w-5xl mx-auto mt-16 border-2 border-[#DFA200] rounded-xl shadow-md">


     <h1 className="text-2xl font-semibold tracking-tight text-[#071f5f] font-sans">
  {t('updateTechnician.title')}
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
            label={t('updateTechnician.fullName')}
             placeholder={t('updateTechnician.fullNamePlaceholder')}
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
           label={t('updateTechnician.email')}
            placeholder={t('updateTechnician.emailPlaceholder')}
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
        
          label={t('updateTechnician.password')}
        placeholder={t('updateTechnician.passwordPlaceholder')}
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
label={t('updateTechnician.insurance')}
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
           label={t('updateTechnician.workPosition')}
          placeholder={t('updateTechnician.workPositionPlaceholder')}
            error={errors.trabajocargo?.message}
          />
        )}
      />



    </div>

    {/* Especialidades (useFieldArray) */}
    <div>
      <div className="flex items-center justify-between">
        <Label className="block mb-1 text-sm font-medium">{t('updateTechnician.specialties')}</Label> {errors.especialidades && ( <p className="text-red-500 text-xs mt-1">
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
            <TooltipContent>{t('updateTechnician.addSpecialty')}</TooltipContent>
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
navigate(-1);
 }}
  className="flex items-center gap-2 bg-[#DFA200] text-white rounded-xl shadow-md hover:bg-[#c48c00]"
>
  <ArrowLeft className="w-4 h-4" />
{t('common.back')}
</Button>


<Button
  type="submit"
  className="flex-1 bg-[#071f5f] text-white rounded-xl shadow-md hover:bg-[#052046]"
>
  <Save className="w-4 h-4" />
 {t('buttons.save')}
</Button>


    </div>
  </form>
</Card>

  );
};

