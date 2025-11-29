import Select from "react-select";
import LazyImage from "../../LazyImage/LazyImage";

const SellerStoreInfoEditForm = ({
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
  handleImageChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="md:col-span-2">
        Store Address
        <input
          className="input input-bordered w-full mt-1"
          value={formData.storeAddress || ""}
          onChange={(e) =>
            setFormData((p) => ({
              ...p,
              storeAddress: e.target.value,
            }))
          }
        />
      </label>

      {/* Region Select */}
      <div>
        <label>Region</label>
        <Select
          options={regions.map((r) => ({ value: r, label: r }))}
          value={selectedRegion}
          onChange={handleRegionChange}
          placeholder="Select Store Region"
          className="mt-1"
        />
      </div>

      {/* District Select */}
      <div>
        <label>District</label>
        <Select
          options={districts.map((d) => ({ value: d, label: d }))}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          isDisabled={!selectedRegion}
          placeholder="Select Store District"
          className="mt-1"
        />
      </div>

      {/* Thana Select */}
      <div>
        <label>Thana</label>
        <Select
          options={thanas.map((t) => ({ value: t, label: t }))}
          value={selectedThana}
          onChange={handleThanaChange}
          isDisabled={!selectedRegion || !selectedDistrict}
          placeholder="Select Store Thana"
          className="mt-1"
        />
      </div>

      {/* Categories Select */}
      <div>
        <label>Categories</label>
        <Select
          options={categories.map((c) => ({
            value: c.toLowerCase(),
            label: c,
          }))}
          value={selectedCategories}
          onChange={handleCategoryChange}
          className="mt-1"
          isMulti
          placeholder="Select Categories"
        />
      </div>

      <label>
        Store Name
        <input
          className="input input-bordered w-full mt-1"
          value={formData.storeName || ""}
          onChange={(e) =>
            setFormData((p) => ({
              ...p,
              storeName: e.target.value,
            }))
          }
        />
      </label>

      <label>
        Stripe Account ID
        <input
          className="input input-bordered w-full mt-1"
          value={formData.stripeAccountId || ""}
          onChange={(e) =>
            setFormData((p) => ({
              ...p,
              stripeAccountId: e.target.value,
            }))
          }
        />
      </label>

      {/* Logo */}
      <div>
        <p className="font-medium mb-2">Store Logo</p>
        <label htmlFor="logo">
          <LazyImage
            src={logoPreview}
            alt="logo"
            className="h-24 w-auto rounded mb-2"
          />
        </label>
        <button
          onClick={() => document.getElementById("logo").click()}
          className="btn btn-sm bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white"
        >
          Change Logo
        </button>
        <input
          id="logo"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e, "logo")}
        />
      </div>

      {/* Cover */}
      <div>
        <p className="font-medium mb-2">Cover Image</p>
        <label htmlFor="cover">
          <LazyImage
            src={coverPreview}
            alt="cover"
            className="h-28 w-full rounded mb-2"
          />
        </label>
        <button
          onClick={() => document.getElementById("cover").click()}
          className="btn btn-sm bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white"
        >
          Change Cover Image
        </button>
        <input
          id="cover"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e, "cover")}
        />
      </div>
    </div>
  );
};

export default SellerStoreInfoEditForm;