import { toast } from "react-toastify";

export const useCheckoutHandlers = ({
  formData,
  userEmail,
  tempShippingAddress,
  tempBillingAddress,
  billingAddress,
  addMutation,
  setDefaultShippingMutation,
  setDefaultBillingMutation,
  setShowInvoiceDrawer,
}) => {
  const handleAddInlineAddress = () => {
    const requiredFields = [
      "name",
      "phone",
      "region",
      "district",
      "thana",
      "address",
    ];
    const hasAllFields = requiredFields.every((field) => formData[field]);

    if (!hasAllFields) {
      return toast.warn("Fill all the required fields");
    }

    addMutation.mutate(formData);
  };

  const handleSaveShippingAddress = () => {
    if (!tempShippingAddress) {
      return toast.warn("Please select an address");
    }

    setDefaultShippingMutation.mutate(tempShippingAddress);
  };

  const handleSaveBillingAddress = () => {
    if (!tempBillingAddress) {
      return toast.warn("Please select a billing address");
    }

    setDefaultBillingMutation.mutate(tempBillingAddress);
  };

  const handleSaveInvoiceInfo = () => {
    if (!userEmail || !billingAddress) {
      return toast.warn(
        !userEmail
          ? "Please enter email address"
          : "Please select a billing address"
      );
    }

    toast.success("Invoice information updated successfully");
    setShowInvoiceDrawer(false);
  };

  return {
    handleAddInlineAddress,
    handleSaveShippingAddress,
    handleSaveBillingAddress,
    handleSaveInvoiceInfo,
  };
};