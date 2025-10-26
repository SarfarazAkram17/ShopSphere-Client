import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineCheck,
} from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import AddressForm from "./AddressForm";

const AddressModal = ({
  isEdit,
  formData,
  setFormData,
  selectedRegion,
  selectedDistrict,
  selectedThana,
  regions,
  districts,
  thanas,
  onRegionChange,
  onDistrictChange,
  onThanaChange,
  onSubmit,
  onClose,
  onDelete,
  isSubmitting,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <HiOutlineLocationMarker className="w-7 h-7" />
              {isEdit ? "Edit Address" : "Add New Address"}
            </h2>
            <div className="flex items-center gap-3">
              {isEdit && (
                <button
                  onClick={onDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-red-600 transition-all cursor-pointer"
                >
                  <AiOutlineDelete size={18} />
                  Delete
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-white/20 text-white p-2 rounded-xl hover:bg-white/30 transition-all cursor-pointer"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <AddressForm
            formData={formData}
            setFormData={setFormData}
            selectedRegion={selectedRegion}
            selectedDistrict={selectedDistrict}
            selectedThana={selectedThana}
            regions={regions}
            districts={districts}
            thanas={thanas}
            onRegionChange={onRegionChange}
            onDistrictChange={onDistrictChange}
            onThanaChange={onThanaChange}
          />

          <div className="flex justify-end gap-4 pt-6 border-t mt-8">
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <AiOutlineCheck size={20} />
                  Save Address
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;