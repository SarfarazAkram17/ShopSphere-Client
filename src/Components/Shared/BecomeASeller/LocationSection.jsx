import { Controller } from "react-hook-form";
import Select from "react-select";
import { MdLocationOn } from "react-icons/md";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";

export const LocationSection = ({
  register,
  errors,
  control,
  regions,
  districts,
  thanas,
  selectedRegion,
  selectedDistrict,
}) => (
  <div className="space-y-6">
    <SectionHeader
      icon={MdLocationOn}
      title="Store Location Details"
      color="green"
    />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-3">
        <FormField
          label="Store Address"
          icon={MdLocationOn}
          error={errors.storeAddress}
          required
        >
          <input
            type="text"
            placeholder="e.g: Gulistan, Dhaka-1213"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            {...register("storeAddress", {
              required: "Store address is required",
            })}
          />
        </FormField>
      </div>

      <FormField
        label="Region"
        icon={MdLocationOn}
        error={errors.region}
        required
      >
        <Controller
          name="region"
          control={control}
          rules={{ required: "Region is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={regions.map((r) => ({ value: r, label: r }))}
              isClearable
              placeholder="Select Region"
              className="text-sm w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#e5e7eb",
                  "&:hover": { borderColor: "#22c55e" },
                  boxShadow: "none",
                  minHeight: "45px",
                }),
              }}
            />
          )}
        />
      </FormField>

      <FormField
        label="District"
        icon={MdLocationOn}
        error={errors.district}
        required
      >
        <Controller
          name="district"
          control={control}
          rules={{ required: "District is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={districts.map((d) => ({ value: d, label: d }))}
              isClearable
              isDisabled={!selectedRegion}
              placeholder="Select District"
              className="text-sm w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#e5e7eb",
                  "&:hover": { borderColor: "#22c55e" },
                  boxShadow: "none",
                  minHeight: "45px",
                }),
              }}
            />
          )}
        />
      </FormField>

      <FormField
        label="Thana"
        icon={MdLocationOn}
        error={errors.thana}
        required
      >
        <Controller
          name="thana"
          control={control}
          rules={{ required: "Thana is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={thanas.map((t) => ({ value: t, label: t }))}
              isClearable
              isDisabled={!selectedRegion || !selectedDistrict}
              placeholder="Select Thana"
              className="text-sm w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#e5e7eb",
                  "&:hover": { borderColor: "#22c55e" },
                  boxShadow: "none",
                  minHeight: "45px",
                }),
              }}
            />
          )}
        />
      </FormField>
    </div>
  </div>
);

export default LocationSection;