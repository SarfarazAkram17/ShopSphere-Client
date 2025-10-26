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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className={`bg-gradient-to-r ${gradientClass} p-6`}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Icon className="w-7 h-7" />
            {title}
          </h2>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="flex justify-center items-center py-15 text-gray-500 font-semibold">
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

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`px-8 py-3 bg-gradient-to-r ${buttonGradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer`}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <AiOutlineCheck size={20} />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefaultAddressModal;