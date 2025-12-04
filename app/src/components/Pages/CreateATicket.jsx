import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation} from "react-router-dom";


import { toast } from "react-hot-toast";


import { useForm, Controller, useFieldArray } from "react-hook-form";

//servicios tecnicos, especialidades
import TechniciansLists from "../../Services/TechniciansLists";
import SpecialitiesList from "../../Services/SpecialitiesList";
import TicketsLists from "../../Services/TicketsLists";
import { data } from "autoprefixer";
import { useUser } from '../../context/UserContext';
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

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";


export function CreateATicket() {

const navigate = useNavigate();
const location = useLocation();

  const { t } = useTranslation();


    const { selectedUser } = useUser();
  const [dataPriorities, setDataPriorities] = useState([]);
  const [dataTags, setDataTags] = useState([]);
  const [dataCategory, setDataCategory] = useState(null);

 /*** Esquema de validación Yup ***/
const ticketSchema = yup.object({
  title: yup.string().required("El título es requerido"),
  descripcion: yup.string().required("La descripción es requerida"),
  prioridad: yup.number().typeError("Debe seleccionar una prioridad").required("La prioridad es requerida"),
  fecha_creacion: yup.string().required(),
  estado: yup.string().required(),
  tags: yup.number().required("La etiqueta es requerida"),
  categoriaId: yup.number().nullable(),
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
}

,

    resolver:yupResolver(ticketSchema),
  });

  //watch es utilizado para saber qué etiqueta seleccionó el usuario, y hacer el llamado al backend

const tagsSelected = watch("tags");





  /***Listados de carga en el formulario ***/
  useEffect(()=>{
    const fechData=async()=>{
      try {
        //Lista deprioridades y etiquetas
        const PrioriRes = await TicketsLists.getAllPriorities();
        const ResTags = await SpecialitiesList.GetAllTags();
        
        //los datos se guardarán
     
        setDataPriorities(PrioriRes.data.data || []); 
        setDataTags(ResTags.data.data || []);

        //tomaré el primer tag seleccionado
        if (tagsSelected !== "") {
          
        var firstTagId = tagsSelected;
        const CatRes = await TicketsLists.getCategoriesByTags(firstTagId);
         
        const category = CatRes.data.data[0];
         setDataCategory(category);
         setValue("categoriaId", category.Id);    
         setValue("categoriaNombre", category.Name);

        }else{
           setDataCategory(null);
           setValue("categoriaId", null);
           setValue("categoriaNombre",null);

        }
        
      } catch (error) {
        console.log(error)

      }
    }
    fechData()
  },[tagsSelected])


/*** Submit ***/

const onSubmit = async (dataForm) => {



  try {

const body = {
  Title: dataForm.title,
  Description: dataForm.descripcion,
  PriorityId: dataForm.prioridad,
  CategoryId: dataForm.categoriaId,
  UserId: selectedUser.Id
};


console.log("categoriaId:", dataForm.categoriaId)

    const response = await TicketsLists.createticket(body);

    if (response.data?.success === true) {
      toast.success(`Ticket creado exitosamente`);
      navigate(-1);
      return;
    }

    

  } catch (err) {
   
    
    toast.error(err.response?.data?.message || "Error al crear ticket");
  }
};




  return (

<Card className="p-6 max-w-5xl mx-auto mt-16 border-2 border-[#DFA200] rounded-xl shadow-md">


     <h1 className="text-2xl font-semibold tracking-tight text-[#071f5f] font-sans">
    {t('tickets.createNew')}
  </h1>


  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
    
    {/* Ntitulo */}
    <div className="grid sm:grid-cols-2 gap-4 ">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <CustomInputField
            {...field}
            label={t('tickets.title')}
            placeholder={t('tickets.titlePlaceholder')}
            error={errors.title?.message}
          />
        )}
      />


<Controller
  name="estado"
  control={control}
  defaultValue="Pendiente"
  render={({ field }) => (
    <CustomInputField
      {...field}
      label={t('tickets.status')}
      placeholder={t('tickets.pending')}
      disabled={true}
    />
  )}
/>


    </div>




  <Controller
  name="descripcion"
  control={control}
  render={({ field }) => (
    <CustomInputField
      {...field}
      as="textarea"
      label={t('tickets.description')}
      placeholder={t('tickets.descriptionPlaceholder')}
      error={errors.descripcion?.message}
      className="min-h-[120px]"  
    />
  )}
/>


   

    {/* prioridad */}
    <div className="grid sm:grid-cols-2 gap-4">
     
   <Controller
        name="prioridad"
        control={control}
        render={({ field }) => (
          <CustomSelect
            field={field}
            data={dataPriorities}
                    label={t('tickets.priority')}
            getOptionLabel={(item) => `${item.Name}`}
            getOptionValue={(item) => item.Id}
            error={errors.prioridad?.message}
          />
        )}
      />
      

    {/* fecha*/}
      
  <Controller
    name="fecha_creacion"
    control={control}
    defaultValue={new Date().toISOString().split("T")[0]} 
    render={({ field }) => (
      <CustomInputField
        {...field}
        type="date"
        label={t('tickets.createdAt')}
        disabled={true}               
        error={errors.fecha_creacion?.message}
      />
    )}
  />
    </div>
                      
      <Controller
  name="tags"
  control={control}
  render={({ field }) => (
    <CustomSelect
      field={field}
      data={dataTags}
        label={t('tickets.tags')}
      getOptionLabel={(item) => item.Tag}
      getOptionValue={(item) => item.Id}
        placeholder={t('tickets.selectTag')}
      error={errors.tags?.message}
    />
  )}
/>

    <CustomInputField
  label={t('tickets.category')}
  value={dataCategory ? dataCategory.Name : ""}
  disabled={true}
/>
 <input type="hidden" {...register("categoriaId")} />



       
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
}
