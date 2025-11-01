import { MdAccountBalance } from "react-icons/md";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";

export const PaymentSection = ({ register, errors }) => (
  <div className="space-y-6">
    <SectionHeader
      icon={MdAccountBalance}
      title="Payment Information"
      color="orange"
    />

    <FormField
      label="Stripe Account ID"
      icon={MdAccountBalance}
      error={errors.stripeAccountId}
      required
    >
      <input
        type="text"
        placeholder="Enter your Stripe Account ID"
        className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        {...register("stripeAccountId", {
          required: "Stripe Account ID is required",
        })}
      />
      <p className="text-xs text-gray-500 mt-2">
        Connect your Stripe account to receive delivery payments securely
      </p>
    </FormField>
  </div>
);

export default PaymentSection;