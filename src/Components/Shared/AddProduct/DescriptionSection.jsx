import { MdDescription } from "react-icons/md";
import { FormSection } from "./FormSection";
import { TextareaField } from "./TextareaField";

export const DescriptionSection = ({ register, errors }) => {
  return (
    <FormSection
      icon={MdDescription}
      title="Product Description"
      iconColor="text-indigo-600"
    >
      <TextareaField
        icon={MdDescription}
        label="Description"
        required
        placeholder="Describe your product in detail..."
        register={register("description", { required: true })}
        error={errors.description && "Product description is required"}
      />
    </FormSection>
  );
};