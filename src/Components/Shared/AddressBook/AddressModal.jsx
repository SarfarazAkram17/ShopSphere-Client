import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import AddressForm from "./AddressForm";
import MiniLoader from "../../Loader/MiniLoader";

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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-80 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 rounded-t-3xl flex flex-col sm:block">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <HiOutlineLocationMarker className="w-7 h-7" />
              {isEdit ? "Edit Address" : "Add New Address"}
            </h2>
            <div className="flex items-center gap-3">
              {isEdit && (
                <button
                  onClick={onDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium sm:flex items-center gap-2 hover:bg-red-600 transition-all cursor-pointer hidden"
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
          {isEdit && (
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-red-600 transition-all cursor-pointer sm:hidden mt-6 w-fit"
            >
              <AiOutlineDelete size={18} />
              Delete
            </button>
          )}
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 pt-6 border-t mt-8">
            <button onClick={onClose} className="btn">
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="btn btn-primary disabled:text-black/50 disabled:cursor-not-allowed text-white"
            >
              {isSubmitting ? (
                <>
                  <MiniLoader /> Saving...
                </>
              ) : (
                "Save Address"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;