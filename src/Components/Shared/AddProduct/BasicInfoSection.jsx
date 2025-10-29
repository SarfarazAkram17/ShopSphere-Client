import { FiPackage } from "react-icons/fi";
import { MdDescription } from "react-icons/md";
import { FormSection } from "./FormSection";
import { InputField } from "./InputField";
import { CategorySelect } from "./CategorySelect";

export const BasicInfoSection = ({ register, control, errors, categories }) => {
  return (
    <FormSection
      icon={FiPackage}
      title="Basic Information"
      iconColor="text-blue-600"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <InputField
          icon={MdDescription}
          label="Product Name"
          required
          placeholder="Enter product name"
          register={register("name", { required: true })}
          error={errors.name && "Product name is required"}
        />

        <CategorySelect
          control={control}
          categories={categories}
          error={errors.categories?.message}
        />
      </div>
    </FormSection>
  );
};