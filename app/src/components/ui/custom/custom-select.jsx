import PropTypes from "prop-types";

export function CustomSelect({ field, data, label, getOptionLabel, getOptionValue, error }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-sm text-gray-700">
        {label}
      </label>

      <select
        {...field}
        className={`block w-full border rounded-md py-2 px-3 text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Seleccionar...</option>
        {data.map((item) => (
          <option key={getOptionValue(item)} value={getOptionValue(item)}>
            {getOptionLabel(item)}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

CustomSelect.propTypes = {
  field: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  getOptionValue: PropTypes.func.isRequired,
  error: PropTypes.string
};
