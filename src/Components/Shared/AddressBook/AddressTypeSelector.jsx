import { AiOutlineHome } from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";

const AddressTypeSelector = ({ selectedType, onSelect }) => {
  return (
    <div className="pt-4">
      <label className="block text-sm font-semibold text-gray-700 mb-4">
        Select Address Type
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect("HOME")}
          className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-3 transition-all cursor-pointer ${
            selectedType === "HOME"
              ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <AiOutlineHome
            size={24}
            className={
              selectedType === "HOME" ? "text-orange-600" : "text-gray-400"
            }
          />
          <span
            className={`font-bold text-lg ${
              selectedType === "HOME" ? "text-orange-700" : "text-gray-600"
            }`}
          >
            HOME
          </span>
        </button>

        <button
          onClick={() => onSelect("OFFICE")}
          className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-3 transition-all cursor-pointer ${
            selectedType === "OFFICE"
              ? "border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-100 shadow-lg scale-105"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <BsBriefcase
            size={24}
            className={
              selectedType === "OFFICE" ? "text-teal-600" : "text-gray-400"
            }
          />
          <span
            className={`font-bold text-lg ${
              selectedType === "OFFICE" ? "text-teal-700" : "text-gray-600"
            }`}
          >
            OFFICE
          </span>
        </button>
      </div>
    </div>
  );
};

export default AddressTypeSelector;