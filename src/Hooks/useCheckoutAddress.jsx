import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAddressMutations } from "./useAddressMutations";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import useUserRole from "./useUserRole";

export const useCheckoutAddress = (resetForm) => {
  const axiosSecure = useAxiosSecure();
  const { user, userEmail } = useAuth();
  const { role, roleLoading } = useUserRole();
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [tempShippingAddress, setTempShippingAddress] = useState(null);
  const [tempBillingAddress, setTempBillingAddress] = useState(null);
  const [showInlineAddressForm, setShowInlineAddressForm] = useState(false);

  // Drawer states
  const [showShippingDrawer, setShowShippingDrawer] = useState(false);
  const [showInvoiceDrawer, setShowInvoiceDrawer] = useState(false);
  const [showBillingDrawer, setShowBillingDrawer] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isClosingShipping, setIsClosingShipping] = useState(false);
  const [isClosingInvoice, setIsClosingInvoice] = useState(false);
  const [isClosingBilling, setIsClosingBilling] = useState(false);

  const {
    data: addresses,
    isLoading: addressesLoading,
    refetch,
  } = useQuery({
    queryKey: ["addresses", userEmail],
    queryFn: async () => {
      const response = await axiosSecure.get(`/address?email=${userEmail}`);

      const defaultShippingAddress = response.data.find(
        (add) => add.isDefaultShipping
      );
      const defaultBillingAddress = response.data.find(
        (add) => add.isDefaultBilling
      );

      setShippingAddress(defaultShippingAddress || null);
      setBillingAddress(defaultBillingAddress || null);
      setTempShippingAddress(defaultShippingAddress?._id || null);
      setTempBillingAddress(defaultBillingAddress?._id || null);

      if (!response.data || response.data.length === 0) {
        setShowInlineAddressForm(true);
      }

      return response.data || [];
    },
    enabled: !!user && !!userEmail && !roleLoading && role === "customer",
  });

  const { addMutation, setDefaultShippingMutation, setDefaultBillingMutation } =
    useAddressMutations(axiosSecure, userEmail, refetch, {
      onAddSuccess: () => {
        setShowAddAddressModal(false);
        setShowInlineAddressForm(false);
        resetForm();
        toast.success("Address added successfully");
      },
      onDefaultShippingSuccess: () => {
        setIsClosingShipping(true);
        setTimeout(() => {
          setShowShippingDrawer(false);
          setIsClosingShipping(false);
        }, 300);
        toast.success("Shipping address updated successfully");
      },
      onDefaultBillingSuccess: () => {
        setIsClosingBilling(true);
        setTimeout(() => {
          setShowBillingDrawer(false);
          setIsClosingBilling(false);
        }, 300);
        toast.success("Billing address updated successfully");
      },
    });

  const closeDrawer = (type) => {
    switch (type) {
      case "shipping":
        setIsClosingShipping(true);
        setTimeout(() => {
          setShowShippingDrawer(false);
          setIsClosingShipping(false);
        }, 300);
        break;
      case "billing":
        setIsClosingBilling(true);
        setTimeout(() => {
          setShowBillingDrawer(false);
          setIsClosingBilling(false);
        }, 300);
        break;
      case "invoice":
        setIsClosingInvoice(true);
        setTimeout(() => {
          setShowInvoiceDrawer(false);
          setIsClosingInvoice(false);
        }, 300);
        break;
      default:
        break;
    }
  };

  const cancelEditShippingAddress = () => {
    const currentDefault = addresses?.find((add) => add.isDefaultShipping);
    setTempShippingAddress(currentDefault?._id || null);
    closeDrawer("shipping");
  };

  const cancelEditBillingAddress = () => {
    const currentDefault = addresses?.find((add) => add.isDefaultBilling);
    setTempBillingAddress(currentDefault?._id || null);
    closeDrawer("billing");
  };

  const cancelEditInvoiceInfo = () => {
    closeDrawer("invoice");
  };

  return {
    shippingAddress,
    billingAddress,
    tempShippingAddress,
    tempBillingAddress,
    showInlineAddressForm,
    showShippingDrawer,
    showInvoiceDrawer,
    showBillingDrawer,
    showAddAddressModal,
    isClosingShipping,
    isClosingInvoice,
    isClosingBilling,
    addresses,
    addressesLoading,
    addMutation,
    setDefaultShippingMutation,
    setDefaultBillingMutation,
    setTempShippingAddress,
    setTempBillingAddress,
    setShowShippingDrawer,
    setShowInvoiceDrawer,
    setShowBillingDrawer,
    setShowAddAddressModal,
    cancelEditShippingAddress,
    cancelEditBillingAddress,
    cancelEditInvoiceInfo,
  };
};