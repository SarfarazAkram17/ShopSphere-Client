import { MdAttachMoney, MdLocalOffer } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { FormSection } from "./FormSection";
import { InputField } from "./InputField";

export const PricingSection = ({ register, errors }) => {
  return (
    <FormSection
      icon={MdAttachMoney}
      title="Pricing & Inventory"
      iconColor="text-green-600"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <InputField
          icon={MdAttachMoney}
          label="Price (BDT)"
          required
          type="number"
          step="0.01"
          placeholder="0.00"
          register={register("price", {
            required: "Price is required.",
            min: { value: 1, message: "Price must be greater than 0." },
            max: {
              value: 1000000,
              message: "Price must be less than 1000000.",
            },
          })}
          error={errors.price?.message}
        />

        <InputField
          icon={MdLocalOffer}
          label="Discount (%)"
          required
          type="number"
          step="0.01"
          placeholder="0"
          defaultValue={0}
          register={register("discount", { min: 0, max: 100 })}
          helperText="Default 0%. Maximum 100%"
        />
      </div>

      <InputField
        icon={AiOutlineStock}
        label="Stock Quantity"
        required
        type="number"
        placeholder="Enter available quantity"
        register={register("stock", {
          required: "Stock quantity is required.",
          min: {
            value: 0,
            message: "Stock must be greater than or equal to 0.",
          },
        })}
        error={errors.stock?.message}
      />
    </FormSection>
  );
};