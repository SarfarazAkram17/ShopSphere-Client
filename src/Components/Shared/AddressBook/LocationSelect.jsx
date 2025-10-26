import Select from "react-select";
import { BiMap } from "react-icons/bi";

const LocationSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
  required,
}) => {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <BiMap size={16} className="text-teal-500" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        placeholder={placeholder}
        className="text-sm"
        styles={{
          control: (base, state) => ({
            ...base,
            borderRadius: "0.75rem",
            borderWidth: "2px",
            borderColor: "#e5e7eb",
            padding: "0.25rem",
            backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
            "&:hover": {
              borderColor: state.isDisabled ? "#e5e7eb" : "#14b8a6",
            },
          }),
        }}
      />
    </div>
  );
};

export default LocationSelect;