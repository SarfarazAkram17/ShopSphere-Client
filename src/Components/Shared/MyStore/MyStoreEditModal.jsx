import { FiX } from "react-icons/fi";
import SellerPersonalInfoEditForm from "./SellerPersonalInfoEditForm";
import SellerStoreInfoEditForm from "./SellerStoreInfoEditForm";

const MyStoreEditModal = ({
  activeModal,
  setActiveModal,
  store,
  formData,
  setFormData,
  regions,
  selectedRegion,
  handleRegionChange,
  districts,
  selectedDistrict,
  handleDistrictChange,
  thanas,
  selectedThana,
  handleThanaChange,
  categories,
  selectedCategories,
  handleCategoryChange,
  logoPreview,
  coverPreview,
  handleUpdate,
  handleImageChange,
  loading,
  isSaveDisabled,
}) => {
  return (
    <>
      {activeModal && (
        <>
          <div
            className="fixed inset-0 z-40 backdrop-blur-md bg-black/15"
            onClick={() => !loading && setActiveModal(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-h-[95vh] overflow-y-scroll hide-scrollbar border rounded-lg max-w-3xl w-full p-5 relative shadow-xl">
              <button
                onClick={() => !loading && setActiveModal(null)}
                className="absolute top-4 right-4 hover:text-red-500 text-gray-500 cursor-pointer"
                disabled={loading}
              >
                <FiX size={26} />
              </button>

              <h3 className="text-2xl font-semibold mb-6 text-center">
                Edit{" "}
                {activeModal === "personal" ? "Personal Info" : "Store Info"}
              </h3>

              {/* Personal Form */}
              {activeModal === "personal" && (
                <SellerPersonalInfoEditForm
                  store={store}
                  formData={formData}
                  setFormData={setFormData}
                ></SellerPersonalInfoEditForm>
              )}

              {/* Store Form */}
              {activeModal === "store" && (
                <SellerStoreInfoEditForm
                  formData={formData}
                  setFormData={setFormData}
                  regions={regions}
                  selectedRegion={selectedRegion}
                  handleRegionChange={handleRegionChange}
                  districts={districts}
                  selectedDistrict={selectedDistrict}
                  handleDistrictChange={handleDistrictChange}
                  thanas={thanas}
                  selectedThana={selectedThana}
                  handleThanaChange={handleThanaChange}
                  categories={categories}
                  selectedCategories={selectedCategories}
                  handleCategoryChange={handleCategoryChange}
                  logoPreview={logoPreview}
                  coverPreview={coverPreview}
                  handleImageChange={handleImageChange}
                ></SellerStoreInfoEditForm>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => !loading && setActiveModal(null)}
                  className="btn btn-outline disabled:text-black/50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="btn btn-primary text-white disabled:text-black/50"
                  disabled={loading || isSaveDisabled()}
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-5 h-5 text-primary animate-spin"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                        />
                        <line
                          x1="50"
                          y1="50"
                          x2="50"
                          y2="25"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                        <line
                          x1="50"
                          y1="50"
                          x2="75"
                          y2="50"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>{" "}
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyStoreEditModal;