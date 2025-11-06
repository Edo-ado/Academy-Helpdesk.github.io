import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Button } from "./button";

import { CustomSelect } from "./custom/custom-select";

import { CustomInputField } from "./custom/custom-input-field";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

import { Trash, Wrench } from "lucide-react"; // Icono de herramienta para especialidad

SpecialityForm.propTypes = {
  data: PropTypes.array.isRequired,       // Lista de especialidades
  control: PropTypes.object.isRequired,   // React Hook Form
  index: PropTypes.number.isRequired,     // Índice del item
  onRemove: PropTypes.func.isRequired,    // Función para eliminar especialidad
  disableRemoveButton: PropTypes.bool,    // Deshabilitar botón eliminar
  error: PropTypes.object                 // Errores del form
};

export function SpecialityForm({
  data,
  control,
  index,
  onRemove,
  disableRemoveButton,
  error
}) {
  return (
    <div className="mb-4 p-4 border rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
      
      {/* Número + ícono */}
      {index + 1}. <Wrench className="w-5 h-5 text-muted-foreground" />

      {/* Select de especialidad */}
      <div className="flex-1 w-full md:w-1/3">
        <Controller
          name={`speciality_id.${index}.actor_id`}
          control={control}
          render={({ field }) => (
            <CustomSelect
              field={field}
              data={data}
              label="Especialidad"
              getOptionLabel={(item) => item.name}
              getOptionValue={(item) => item.id}
              error={error?.speciality_id?.[index]?.actor_id?.message}
            />
          )}
        />
      </div>

      {/* Campo rol o nivel */}
      <div className="flex-1 w-full md:w-1/3">
        <Controller
          name={`speciality_id.${index}.role`}
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Rol / Nivel"
              placeholder="Ej: Nivel experto"
              error={error?.speciality_id?.[index]?.role?.message}
            />
          )}
        />
      </div>

      {/* Botón eliminar */}
      <Button
        size="icon"
        disabled={disableRemoveButton}
        onClick={() => onRemove(index)}
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
