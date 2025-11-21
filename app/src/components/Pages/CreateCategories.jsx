import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useForm, Controller, set } from "react-hook-form";

// Servicio de categorías
import CategoriesServices from "../../Services/CategoriesList";
import SpecialitiesList from "../../Services/SpecialitiesList";
import SLAService from "../../Services/SLAService";

// UI
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { CustomInputField } from "../../components/ui/custom/custom-input-field";
import { CustomSelect } from "../../components/ui/custom/custom-select";
import { CustomMultiSelect } from "../../components/ui/custom/custom-multiple-select";
import { Save, ArrowLeft } from "lucide-react";

export function CreateCategories() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = !!id;


  const [showNewSLA, setShowNewSLA] = useState(false);
  const [showExistingSLA, setShowExistingSLA] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  

  // LISTA DE SLA DESDE LA BDA
  const [slaList, setSlaList] = useState([]);
  //especialidades
  const [dataSpecialities, setDataSpecialities] = useState([]);
  //tags
  const [dataTags, setDataTags] = useState([]);

  
  //Listados de carga en el formulario 
 useEffect(() => {
 const loadSLAList = async () => {
    try {
      const response = await SLAService.getAllSLA();
      const ResEspecialidades = await SpecialitiesList.getAll();
      const ResTags = await SpecialitiesList.GetAllTags();
 
      setSlaList(response.data.data || []);
      setDataSpecialities(ResEspecialidades.data.data || []);
      setDataTags(ResTags.data.data || []);

      console.log("Especialidades:", ResEspecialidades.data);
      console.log("Tags:", ResTags.data);

    } catch (err) {
      console.error('Error completo:', err); 
      toast.error("No se pudieron cargar los datos");
    }
  };
  loadSLAList();
  // si es edición, cargar datos de la categoría una vez que las listas estén cargadas
  if (isEdit) {
    const loadCategoryForEdit = async () => {
      try {
        
        const [basicResp, detailsResp] = await Promise.all([
          CategoriesServices.GetCategoryById(id),
          CategoriesServices.GetCategoryDetailsByID(id),
        ]);

        const basic = basicResp.data?.data?.[0];
        const details = detailsResp.data?.data?.[0];

        if (basic) {
          setValue("name", basic.Name || basic.Categorie || "");
          setValue("description", basic.Descripcion || "");
          if (basic.SLAId) {
            setSelectedOption("existing");
            setShowExistingSLA(true);
            setValue("slaId", basic.SLAId);
          }
        }

        // Mapear especialidades y tags
        if (details) {
          const specialitiesNames = details.Especialidades
            ? details.Especialidades.split(", ")
            : [];
          const tagsNames = details.Tags ? details.Tags.split(", ") : [];

          // Usar estados si ya están cargados, si no, obtener listas directamente
          const specialitiesSource =
            dataSpecialities.length > 0
              ? dataSpecialities
              : (await SpecialitiesList.getAll()).data.data || [];

          const tagsSource =
            dataTags.length > 0
              ? dataTags
              : (await SpecialitiesList.GetAllTags()).data.data || [];

          const specialitiesIds = specialitiesSource
            .filter((s) => specialitiesNames.includes(s.Speciality))
            .map((s) => s.Id);

          const tagsIds = tagsSource
            .filter((t) => tagsNames.includes(t.Tag))
            .map((t) => t.Id);

          // Si no encontramos por nombre, dejar array vacío para evitar errores
          setValue("especialidades", specialitiesIds);
          setValue("tags", tagsIds);
        }
      } catch (err) {
        console.error("Error cargando categoría para edición:", err);
        toast.error("No se pudieron cargar los datos de la categoría");
      }
    };

    // Esperar un poco a que las listas se establezcan (alternativa simple)
    // Si las listas están vacías, loadSLAList() ya las llenó, así que llamamos directo
    loadCategoryForEdit();
  }
}, []);

const categorySchema = yup.object({
  name: yup.string().required("El nombre es requerido").min(2),
  description: yup.string().required("La descripción es requerida").min(4),

  especialidades: yup
    .array()
    .min(1, "Debe seleccionar al menos una especialidad"),

  tags: yup
    .array()
    .min(1, "Debe seleccionar al menos una etiqueta")
});

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      slaHours: null,
      slaMinutes: null,
      slaId: null,
      especialidades: [], 
      tags: []
    },
    resolver: yupResolver(categorySchema),
  });


  const [SlaDataSaved, setSlaDataSaved] = useState(null);
 
  

  // validaciones para la creacion de la categoría
  const onSubmit = async (SlaData) => {
  let slaIdToUse = null;

if (!selectedOption) {
  toast.error("Debes seleccionar si usarás un SLA nuevo o uno existente");
  return;
}

if (selectedOption === "new") {
 
  if (!SlaData.slaHours || SlaData.slaHours <= 0) {
    toast.error("Tiempo de respuesta (horas) debe ser mayor a 0");
    return;
  }

  if (!SlaData.slaMinutes || SlaData.slaMinutes <= SlaData.slaHours) {
    toast.error("Tiempo de resolución debe ser mayor que el tiempo de respuesta");
    return;
  }
}

if (selectedOption === "existing") {
  
  if (!SlaData.slaId) {
    toast.error("Debes seleccionar un SLA existente");
    return;
  }
}

 
  if (selectedOption === "new") {
    try {

      const Sla = await SLAService.CreateSLA(
        SlaData.slaHours,
        SlaData.slaMinutes
      );
      
      slaIdToUse =  Sla.data.data?.id;
    
      setSlaDataSaved("true");
      toast.success("SLA creado exitosamente");
    } catch (err) {
      toast.error("No se pudo crear el SLA");
       setSlaDataSaved("false");
      return;
    }
  } else if (selectedOption === "existing") {

    slaIdToUse = SlaData.slaId;
 
  } else {
    toast.error("Debes seleccionar o crear un SLA");
    return;
  }

  
  const formData = {
    Name: SlaData.name,
    Descripcion: SlaData.description,
    SLAId: slaIdToUse,  
    Tags: SlaData.tags,
    Specialities: SlaData.especialidades,
  };

 
  try {
      let response;
      if (isEdit) {
       
        response = await CategoriesServices.UpdateCategoryByid(id, formData);
        if (response.data?.success === true) {
          toast.success(`Categoría "${formData.Name}" actualizada exitosamente`);
          navigate(-1);
          return;
        }
        toast.error("No se pudo actualizar la categoría");
      } else {
        response = await CategoriesServices.CreateCategory(formData);
        if (response.data?.success === true) {
          toast.success(`Categoría "${formData.Name}" creada exitosamente`);
          navigate(-1);
          return;
        }
        toast.error("No se pudo crear la categoría");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al crear la categoría");
    }

};

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-16 border-2 border-[#DFA200] rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold tracking-tight text-[#071f5f] font-sans">
        {isEdit ? "Actualizar Categoría" : "Crear Categoría"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* NOMBRE */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Nombre de la categoría"
              placeholder="Ejemplo: Computadoras"
              error={errors.name?.message}
            />
          )}
        />

        {/* DESCRIPCIÓN */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Descripción"
              placeholder="Breve descripción"
              error={errors.description?.message}
            />
          )}
        />

        {/* Especialidades*/}
      
          <Controller
            name="especialidades"
            control={control}
            render={({ field }) =>
              <CustomMultiSelect field={field} data={dataSpecialities}
                label="Especialidades"
                getOptionLabel={(item) => item.Speciality}
                getOptionValue={(item) => item.Id}

                placeholder="Seleccione especialidades" 
                error={errors.especialidades?.message}/>}
          />
       

        {/* Etiquetas */}

                  
          <Controller
            name="tags"
            control={control}
            render={({ field }) =>
              <CustomMultiSelect field={field} data={dataTags}
                label="Etiquetas"
                getOptionLabel={(item) => item.Tag}
               getOptionValue={(item) => item.Id}

                placeholder="Seleccione etiquetas" 
                error={errors.tags?.message}/>}
          />
       

                  

        {/* BOTONES SLA */}

        <div className="flex justify-evenly gap-1 mt-6">
          {/* NUEVO SLA */}
          <Button
            type="button"
            onClick={() => {
              setSelectedOption("new");
              setShowNewSLA(true);
              setShowExistingSLA(false);
              setValue("slaId", null);
            }}
            className="flex gap-2 bg-[#DFA200] text-white rounded-xl shadow-md hover:bg-[#c48c00]"
          >
            Crear nuevo SLA
          </Button>

          

          {/* SLA EXISTENTE */}
          <Button
            type="button"
            onClick={() => {
              setSelectedOption("existing");
              setShowExistingSLA(true);
              setShowNewSLA(false);
              setValue("slaHours", null);
              setValue("slaMinutes", null);
            }}
            className="flex gap-2 bg-[#DFA200] text-white rounded-xl shadow-md hover:bg-[#c48c00]"
          >
            Seleccionar SLA existente
          </Button>
        </div>

        {/* FORMULARIO PARA UN NUEVO SLA */}
        {showNewSLA && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Controller
              name="slaHours"
              control={control}
              render={({ field }) => (
                <CustomInputField
                  {...field}
                  type="number"
                  label="Hora maxima para respuesta"
                  placeholder="Ej: 2"
                  error={errors.slaHours?.message}
                />
              )}
            />

            <Controller
              name="slaMinutes"
              control={control}
              render={({ field }) => (
                <CustomInputField
                  {...field}
                  type="number"
                  label="Hora maxima para resolución"
                  placeholder="Ej: 30"
                  error={errors.slaMinutes?.message}
                />
              )}
            />
          </div>
        )}

        {/* SELECT PARA SLA EXISTENTE */}
        {showExistingSLA && (
          <Controller
            name="slaId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                field={field}
                data={slaList}
                label="Selecciona un SLA"
                getOptionLabel={(item) =>
                  "MaxSLAResponse: " +
                  item.MaxTimeResponse +
                  " - MaxSLAResolution: " +
                  item.MaxTimeResolution
                }
                getOptionValue={(item) => item.Id}
                
               
                error={errors.slaId?.message}
              />
              
            )}
          />
        )}

        {/* BOTONES */}
        <div className="flex justify-between gap-4 mt-6">
          <Button
            type="button"
            onClick={() => {
              if (location.key !== "default") navigate(-1);
              else navigate("/categories");
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
