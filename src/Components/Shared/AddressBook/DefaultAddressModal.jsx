import { AiOutlineCheck } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsBuilding } from "react-icons/bs";
import DefaultAddressItem from "./DefaultAddressItem";

const DefaultAddressModal = ({
  type,
  addresses,
  selectedId,
  onSelect,
  onSave,
  onClose,
  isSaving,
}) => {
  const isShipping = type === "shipping";
  const title = isShipping
    ? "Select Default Shipping Address"
    : "Select Default Billing Address";
  const Icon = isShipping ? HiOutlineLocationMarker : BsBuilding;
  const gradientClass = isShipping
    ? "from-teal-500 to-cyan-500"
    : "from-cyan-500 to-blue-500";
  const buttonGradient = isShipping
    ? "from-teal-500 to-cyan-500"
    : "from-cyan-500 to-blue-500";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <div className={`bg-gradient-to-r ${gradientClass} p-4 sm:p-6`}>
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <Icon className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0" />
            <span className="leading-tight">{title}</span>
          </h2>
        </div>

        <div className="p-3 sm:p-6 md:p-8 overflow-y-auto hide-scrollbar flex-1">
          <div className="space-y-3 sm:space-y-4">
            {addresses.length === 0 ? (
              <div className="flex justify-center items-center py-12 sm:py-15 text-gray-500 font-semibold text-sm sm:text-base">
                <span>No Address added yet</span>
              </div>
            ) : (
              addresses.map((address) => (
                <DefaultAddressItem
                  key={address._id}
                  address={address}
                  isSelected={selectedId === address._id}
                  onSelect={() => onSelect(address._id)}
                  type={type}
                />
              ))
            )}
          </div>
        </div>

        <div className="p-3 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
          <button
            onClick={onClose}
            className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 w-full sm:w-fit border-gray-300 rounded-xl font-semibold text-sm sm:text-base hover:bg-white transition-all cursor-pointer order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-fit bg-gradient-to-r ${buttonGradient} text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefaultAddressModal;
