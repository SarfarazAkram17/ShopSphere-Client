import { FaXmark } from "react-icons/fa6";
import MiniLoader from "../../Loader/MiniLoader";

const AddressDrawer = ({
  isOpen,
  isClosing,
  title,
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNew,
  onSave,
  onCancel,
  isSaving,
  addressType = "shipping", // "shipping" or "billing"
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/10 bg-opacity-50 z-40 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={onCancel}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[300px] sm:max-w-sm bg-white shadow-2xl z-50 animate-slide-in-right overflow-y-auto hide-scrollbar transition-transform duration-300 ease-in-out ${
          isClosing ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <FaXmark size={24} />
            </button>
          </div>

          <button
            onClick={onAddNew}
            className="w-full mb-4 btn btn-secondary btn-outline hover:text-white"
          >
            Add new address
          </button>

          <div className="space-y-4">
            {addresses?.length > 0 ? (
              addresses.map((addr) => (
                <div
                  key={addr._id || addr.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAddress === addr._id
                      ? "border-primary bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => onSelectAddress(addr._id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={selectedAddress === addr._id}
                      onChange={() => onSelectAddress(addr._id)}
                      className="radio radio-primary radio-sm mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{addr.name}</p>
                        <span className="text-sm text-gray-600">
                          {addr.phone}
                        </span>
                      </div>
                      <span
                        className={`${
                          addr.label === "HOME" ? "bg-orange-500" : "bg-primary"
                        } text-white text-xs px-2 py-0.5 rounded-full`}
                      >
                        {addr.label}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {addr.address}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {addr.thana} - {addr.district} - {addr.region}
                      </p>
                      {((addressType === "shipping" &&
                        addr.isDefaultShipping) ||
                        (addressType === "billing" &&
                          addr.isDefaultBilling)) && (
                        <span className="text-xs text-blue-600 mt-1 inline-block">
                          Default{" "}
                          {addressType === "shipping" ? "Shipping" : "Billing"}{" "}
                          Address
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No addresses found</p>
                <p className="text-sm mt-2">Add a new address to continue</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 btn disabled:text-black/50"
              disabled={isSaving}
            >
              CANCEL
            </button>
            <button
              onClick={onSave}
              disabled={isSaving || !selectedAddress}
              className="flex-1 btn text-white btn-primary disabled:text-black/50"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <MiniLoader /> Saving...
                </span>
              ) : (
                "SAVE"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressDrawer;