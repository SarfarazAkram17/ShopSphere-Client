import Select from "react-select";
import { AiOutlineHome } from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import MiniLoader from "../../Loader/MiniLoader";

const DeliveryInformationForm = ({
  formData,
  setFormData,
  selectedRegion,
  selectedDistrict,
  selectedThana,
  regions,
  districts,
  thanas,
  handleRegionChange,
  handleDistrictChange,
  handleThanaChange,
  onSave,
  isSubmitting,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Delivery Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your first and last name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Please enter your phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region <span className="text-red-500">*</span>
          </label>
          <Select
            options={regions.map((r) => ({ value: r, label: r }))}
            value={selectedRegion}
            onChange={handleRegionChange}
            placeholder="Select Region"
            className="text-sm"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
                "&:hover": { borderColor: "#14b8a6" },
              }),
            }}
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District <span className="text-red-500">*</span>
          </label>
          <Select
            options={districts.map((d) => ({ value: d, label: d }))}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Select District"
            isDisabled={!selectedRegion}
            className="text-sm"
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: "#d1d5db",
                backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
                "&:hover": {
                  borderColor: state.isDisabled ? "#d1d5db" : "#14b8a6",
                },
              }),
            }}
          />
        </div>

        {/* Thana */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thana <span className="text-red-500">*</span>
          </label>
          <Select
            options={thanas.map((t) => ({ value: t, label: t }))}
            value={selectedThana}
            onChange={handleThanaChange}
            placeholder="Select Thana"
            isDisabled={!selectedRegion || !selectedDistrict}
            className="text-sm"
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: "#d1d5db",
                backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
                "&:hover": {
                  borderColor: state.isDisabled ? "#d1d5db" : "#14b8a6",
                },
              }),
            }}
          />
        </div>

        {/* Building/House */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building / House No / Floor / Street
          </label>
          <input
            type="text"
            value={formData.building}
            onChange={(e) =>
              setFormData({ ...formData, building: e.target.value })
            }
            placeholder="Please enter"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Full Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="For Example: House# 123, Street# 123, ABC Road"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Address Type Selector */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select a label for effective delivery:
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setFormData({ ...formData, label: "HOME" })}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 transition-all cursor-pointer ${
              formData.label === "HOME"
                ? "border-orange-500 bg-orange-50 text-orange-600"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <AiOutlineHome
              size={24}
              className={
                formData.label === "HOME" ? "text-orange-600" : "text-gray-400"
              }
            />
            HOME
          </button>
          <button
            onClick={() => setFormData({ ...formData, label: "OFFICE" })}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 transition-all cursor-pointer ${
              formData.label === "OFFICE"
                ? "border-primary bg-primary/10 text-primary"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <BsBriefcase
              size={24}
              className={
                formData.label === "OFFICE" ? "text-teal-600" : "text-gray-400"
              }
            />
            OFFICE
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onSave}
          disabled={isSubmitting}
          className="btn btn-primary text-white disabled:text-black/50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <MiniLoader /> SAVING...
            </span>
          ) : (
            "SAVE"
          )}
        </button>
      </div>
    </div>
  );
};

export default DeliveryInformationForm;