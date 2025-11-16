import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Button } from "./button";
import { CustomSelect } from "./custom/custom-select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Trash } from "lucide-react";

SpecialityForm.propTypes = {
  data: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  disableRemoveButton: PropTypes.bool,
  error: PropTypes.object
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
   <div className="mb-4 p-4 border rounded-xl shadow-sm flex items-center gap-4">

      {/* Select de especialidad */}
      <div className="flex-1 w-full">
        <Controller
          name={`especialidades.${index}.Id`}
          control={control}
          render={({ field }) => (
            <CustomSelect
              field={field}
              data={data}
              label="Especialidad"
              getOptionLabel={(item) => item.Speciality}
              getOptionValue={(item) => item.Id}
                error={error?.especialidades?.[index]?.Id?.message}
            />
          )}
        />
      </div>

      {/* Botón eliminar */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              disabled={disableRemoveButton}
              onClick={() => onRemove(index)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Eliminar</TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </div>
  );
}
