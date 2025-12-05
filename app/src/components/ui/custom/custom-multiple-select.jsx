import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Check, ChevronsUpDown, X, AlertCircle } from "lucide-react";
import { Button } from "../button";
import { cn } from "../../../lib/utils";
import { useTranslation } from "react-i18next";

export function CustomMultiSelect({
  field,
  data,
  label,
  getOptionLabel,
  getOptionValue,
  error,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedValues = (field?.value ?? []).map(String);

  const toggleValue = (value) => {
    const exists = selectedValues.includes(value);
    const newValues = exists
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    field?.onChange(newValues);
  };

  const removeValue = (value) => {
    const newValues = selectedValues.filter((v) => v !== value);
    field?.onChange(newValues);
  };

  const filteredOptions = useMemo(() => {
    const term = search.toLowerCase();
    return (data ?? []).filter((item) =>
      getOptionLabel(item).toLowerCase().includes(term)
    );
  }, [data, search, getOptionLabel]);

  const selectedItems =
    (data ?? []).filter((item) =>
      selectedValues.includes(String(getOptionValue(item)))
    ) || [];

  return (
    <div className="w-full relative">
      <label className="block mb-1 text-sm font-medium">{label}</label>

      <Button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full justify-between rounded-xl border shadow-sm text-base",
          "bg-transparent text-gray-400",
          error ? "border-red-500" : "border-gray-300"
        )}
      >
        {selectedItems.length > 0
          ? `${selectedItems.length} ${t('customMultiSelect.selected')}`
          : `${t('customMultiSelect.select')} ${label}`}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-[9999] mt-1 w-full max-h-60 overflow-auto rounded-xl border bg-white shadow-lg p-2">
          {filteredOptions.length === 0 && (
            <p className="text-sm text-gray-500 px-1">
              {t('customMultiSelect.noResults')}
            </p>
          )}

          <ul className="space-y-1">
            {filteredOptions.map((item) => {
              const value = String(getOptionValue(item));
              const selected = selectedValues.includes(value);
              return (
                <li
                  key={value}
                  className={cn(
                    "flex items-center justify-between px-2 py-1 rounded-md cursor-pointer text-sm",
                    selected
                      ? "bg-[#071f5f] text-white"
                      : "hover:bg-gray-100 text-gray-800"
                  )}
                  onClick={() => toggleValue(value)}
                >
                  <span className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {getOptionLabel(item)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {selectedItems.map((item) => {
          const value = String(getOptionValue(item));
          return (
            <span
              key={value}
              className="flex items-center bg-[#071f5f] text-white text-sm px-2 py-1 rounded-full gap-1"
            >
              {getOptionLabel(item)}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeValue(value)}
              />
            </span>
          );
        })}
      </div>

      {error && (
        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}

CustomMultiSelect.propTypes = {
  field: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  getOptionValue: PropTypes.func.isRequired,
  error: PropTypes.string,
};
