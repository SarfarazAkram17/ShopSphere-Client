import { Controller } from "react-hook-form";
import Select from "react-select";
import { MdStore, MdCategory, MdImage } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";
import ImageUploadField from "./ImageUploadField";

export const StoreInfoSection = ({
  register,
  errors,
  control,
  categories,
  logoPreview,
  coverPreview,
  handleLogoChange,
  handleCoverChange,
}) => (
  <div className="space-y-6">
    <SectionHeader icon={FaStore} title="Store Information" color="purple" />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Store Name"
        icon={MdStore}
        error={errors.storeName}
        required
      >
        <input
          type="text"
          placeholder="Enter your store name"
          className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          {...register("storeName", { required: "Store name is required" })}
        />
      </FormField>

      <FormField
        label="Product Categories"
        icon={MdCategory}
        error={errors.categories}
        required
      >
        <Controller
          name="categories"
          control={control}
          rules={{ required: "Select at least one category" }}
          render={({ field }) => (
            <Select
              {...field}
              options={categories.map((c) => ({
                value: c.toLowerCase(),
                label: c,
              }))}
              isMulti
              placeholder="Select product categories you'll sell"
              className="text-sm w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#e5e7eb",
                  "&:hover": { borderColor: "#a855f7" },
                  boxShadow: "none",
                  minHeight: "45px",
                }),
              }}
            />
          )}
        />
      </FormField>

      <ImageUploadField
        label="Store Logo"
        icon={MdImage}
        preview={logoPreview}
        onChange={handleLogoChange}
      />

      <ImageUploadField
        label="Cover Image"
        icon={MdImage}
        preview={coverPreview}
        onChange={handleCoverChange}
        previewClassName="w-full h-32"
      />
    </div>
  </div>
);

export default StoreInfoSection;