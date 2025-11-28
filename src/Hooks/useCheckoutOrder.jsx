import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { clearShopCart } from "../lib/localStorage";
import { prepareOrderData } from "../lib/checkoutCalculations";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useCartCount } from "./useCartCount";

export const useCheckoutOrder = () => {
  const { userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { refetch: cartCountRefetch } = useCartCount();
  const navigate = useNavigate();
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await axiosSecure.post(
        `/orders?email=${userEmail}`,
        orderData
      );
      return response.data;
    },
    onSuccess: (data) => {
      setCreatedOrder(data);
      setShowPaymentSection(true);
      cartCountRefetch();
    },
  });

  const handleProceedToPay = async (
    shippingAddress,
    billingAddress,
    cartItems,
    groupedByStore,
    totals
  ) => {
    if (!shippingAddress || !billingAddress) {
      toast.error("Please add shipping and billing addresses");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = prepareOrderData(
      userEmail,
      shippingAddress,
      billingAddress,
      groupedByStore,
      totals
    );

    createOrderMutation.mutate(orderData);
  };

  const handleConfirmOrder = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessingPayment(true);

    try {
      await axiosSecure.patch(
        `/orders/${createdOrder.id}/confirm?email=${userEmail}`
      );

      clearShopCart(userEmail);
      navigate("/dashboard/myOrders");
      cartCountRefetch();

      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm order");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      toast.success("Payment successful! Redirecting to my orders page...");
      navigate("/dashboard/myOrders");
      setTimeout(() => {
        clearShopCart(userEmail);
        cartCountRefetch();
      }, 1000);
    } catch (error) {
      toast.error(
        error.message ||
          "Payment successful but there was an error. Please contact support."
      );
    }
  };

  return {
    showPaymentSection,
    createdOrder,
    selectedPaymentMethod,
    isProcessingPayment,
    isCreatingOrder: createOrderMutation.isPending,
    setSelectedPaymentMethod,
    handleProceedToPay,
    handleConfirmOrder,
    handlePaymentSuccess,
  };
};