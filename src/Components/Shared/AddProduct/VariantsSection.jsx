import { MdPalette, MdStraighten } from "react-icons/md";
import { FormSection } from "./FormSection";
import { InputField } from "./InputField";

export const VariantsSection = ({ register }) => {
  return (
    <FormSection
      icon={MdPalette}
      title="Product Variants"
      iconColor="text-purple-600"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <InputField
          icon={MdPalette}
          label="Colors (Optional)"
          placeholder="Red, Blue, Green"
          register={register("color")}
          helperText="Separate multiple colors with commas"
        />

        <InputField
          icon={MdStraighten}
          label="Sizes (Optional)"
          placeholder="S, M, L, XL"
          register={register("size")}
          helperText="Separate multiple sizes with commas"
        />
      </div>
    </FormSection>
  );
};