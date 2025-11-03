import { Controller } from "react-hook-form";
import Select from "react-select";
import { MdLocationOn, MdDeliveryDining } from "react-icons/md";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";
import InfoBox from "./InfoBox";

export const ServiceAreaSection = ({
  errors,
  control,
  regions,
  districts,
  thanas,
  selectedRegion,
  selectedDistrict,
}) => (
  <div className="space-y-6">
    <SectionHeader icon={MdLocationOn} title="Service Area" color="green" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

    <InfoBox
      icon={MdDeliveryDining}
      title="Service Area Information"
      description="Select the region, district, and thana where you'll be providing delivery services. This helps us assign orders efficiently."
      bgColor="blue"
    />
  </div>
);

export default ServiceAreaSection;