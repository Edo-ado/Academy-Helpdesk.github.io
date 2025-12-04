import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation} from "react-router-dom";
import { toast } from "react-hot-toast";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next"; 

// Servicios
import TechniciansLists from "../../Services/TechniciansLists";
import SpecialitiesList from "../../Services/SpecialitiesList";

// Componentes UI
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
  const { t } = useTranslation(); 

  const [dataSpecialities, setDataSpecialities] = useState([]);
  const [dataSeguros, setDataSeguros] = useState([]);


  const technicianSchema = yup.object({
    name: yup
      .string()
      .required(t("createTechnician.validation.nameRequired"))
      .min(2, t("createTechnician.validation.nameMin")),
    seguro: yup
      .number()
      .typeError(t("createTechnician.validation.insuranceInvalid"))
      .required(t("createTechnician.validation.insuranceRequired"))
      .positive(t("createTechnician.validation.insuranceInvalid")),
    email: yup
      .string()
      .required(t("createTechnician.validation.emailRequired"))
      .email(t("createTechnician.validation.emailInvalid")),
    trabajocargo: yup
      .string()
      .required(t("createTechnician.validation.workPositionRequired"))
      .min(2, t("createTechnician.validation.workPositionMin")),
    password: yup
      .string()
      .required(t("createTechnician.validation.passwordRequired"))
      .min(6, t("createTechnician.validation.passwordMin")),
    idrol: yup
      .number()
      .required(t("createTechnician.validation.roleRequired")),
    especialidades: yup
      .array()
      .of(
        yup.object({
          Id: yup
            .number()
            .typeError(t("createTechnician.validation.specialtyInvalid"))
            .required(t("createTechnician.validation.specialtyRequired")),
        })
      )
      .min(1, t("createTechnician.validation.specialtiesMin")),
  });

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
    },
    resolver: yupResolver(technicianSchema),
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

  useEffect(() => {
    const fechData = async () => {
      try {
        const specialitiesRes = await SpecialitiesList.getAll();
        const segurosRes = await TechniciansLists.getSeguros();
        
        setDataSpecialities(specialitiesRes.data.data || []); 
        setDataSeguros(segurosRes.data.data || []); 
      } catch (error) {
        console.log(error);
        if (error.name != "AbortError") setError(error.message);
      }
    };
    fechData();
  }, []);

  const onSubmit = async (dataForm) => {
    const ids = dataForm.especialidades.map(e => e.Id);
    const hayRepetidos = new Set(ids).size !== ids.length;

    if (hayRepetidos) {
      toast.error(t("createTechnician.duplicateSpecialties")); 
      return;
    }

    try {
      const response = await TechniciansLists.create(dataForm);

      if (response.data?.success === true) {
        toast.success(t("createTechnician.successMessage", { name: dataForm.name })); 
        navigate(-1);
        return;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("createTechnician.errorMessage")); 
    }
  };

  return (
    <Card className="p-6 max-w-5xl mx-auto mt-16 border-2 border-[#DFA200] rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold tracking-tight text-[#071f5f] font-sans">
        {t("createTechnician.title")} 
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Nombre completo y correo */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                label={t("createTechnician.fullName")} 
                placeholder={t("createTechnician.fullNamePlaceholder")} 
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
                label={t("createTechnician.email")} 
                placeholder={t("createTechnician.emailPlaceholder")} 
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
                label={t("createTechnician.password")} 
                placeholder={t("createTechnician.passwordPlaceholder")} 
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
                label={t("createTechnician.insurance")}
                getOptionLabel={(item) => `${item.Name}`}
                getOptionValue={(item) => item.Id}
                error={errors.seguro?.message}
              />
            )}
          />
        </div>

        {/* Cargo */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Controller
            name="trabajocargo"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                label={t("createTechnician.workPosition")}
                placeholder={t("createTechnician.workPositionPlaceholder")} 
                error={errors.trabajocargo?.message}
              />
            )}
          />
        </div>

        {/* Especialidades */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="block mb-1 text-sm font-medium">
              {t("createTechnician.specialties")} 
            </Label>
            {errors.especialidades && (
              <p className="text-red-500 text-xs mt-1">
                {errors.especialidades.message}
              </p>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    size="icon" 
                    onClick={addNewSpeciality}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t("createTechnician.addSpecialty")} 
                </TooltipContent>
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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[#DFA200] text-white rounded-xl shadow-md hover:bg-[#c48c00]"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("createTechnician.backButton")} 
          </Button>

          <Button
            type="submit"
            className="flex-1 bg-[#071f5f] text-white rounded-xl shadow-md hover:bg-[#052046]"
          >
            <Save className="w-4 h-4" />
            {t("createTechnician.saveButton")} 
          </Button>
        </div>
      </form>
    </Card>
  );
}
