import { AiOutlineUser, AiOutlinePhone } from "react-icons/ai";
import { BsBuilding } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiMap } from "react-icons/bi";

const iconMap = {
  user: AiOutlineUser,
  phone: AiOutlinePhone,
  building: BsBuilding,
  location: HiOutlineLocationMarker,
  map: BiMap,
};

const FormInput = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}) => {
  const Icon = iconMap[icon];

  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-teal-500" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
      />
    </div>
  );
};

export default FormInput;