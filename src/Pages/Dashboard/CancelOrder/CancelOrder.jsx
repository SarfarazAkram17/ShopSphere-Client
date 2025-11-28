import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiArrowLeft } from "react-icons/fi";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { toast } from "react-toastify";
import Loader from "../../../Components/Loader/Loader";
import { calculateRefund, generateItemKey } from "../../../lib/cancelOrder";
import CancellationError from "../../../Components/Shared/CancelOrder/CancellationError";
import StoreCard from "../../../Components/Shared/CancelOrder/StoreCard";
import CancellationReasonSelector from "../../../Components/Shared/CancelOrder/CancellationReasonSelector";
import CancellationSummary from "../../../Components/Shared/CancelOrder/CancellationSummary";

const CancelOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const queryClient = useQueryClient();

  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [cancellationReason, setCancellationReason] = useState(null);
  const [customReason, setCustomReason] = useState("");

  // Fetch order details
  const { isPending, data: order } = useQuery({
    queryKey: ["order-details", orderId, userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/orders/${orderId}?email=${userEmail}`
      );
      return res.data;
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async (cancelData) => {
      const res = await axiosSecure.post(
        `/orders/${orderId}/cancel?email=${userEmail}`,
        cancelData
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-orders"]);
      queryClient.invalidateQueries(["order-details", orderId, userEmail]);
      toast.success("Order cancelled successfully!");
      navigate("/dashboard/myOrders");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });

  // Toggle product selection
  const toggleProductSelection = (key, isCancelled) => {
    if (isCancelled) return;

    const newSelection = new Set(selectedProducts);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    setSelectedProducts(newSelection);
  };

  // Select all products from a store
  const toggleStoreSelection = (store) => {
    const activeItemKeys = store.items
      .map((item, idx) => ({
        key: generateItemKey(store.storeId, item, idx),
        isCancelled: item.status === "cancelled",
      }))
      .filter((item) => !item.isCancelled)
      .map((item) => item.key);

    const allSelected = activeItemKeys.every((key) =>
      selectedProducts.has(key)
    );

    const newSelection = new Set(selectedProducts);
    if (allSelected) {
      activeItemKeys.forEach((key) => newSelection.delete(key));
    } else {
      activeItemKeys.forEach((key) => newSelection.add(key));
    }
    setSelectedProducts(newSelection);
  };

  // Handle cancellation
  const handleCancelOrder = () => {
    if (selectedProducts.size === 0) {
      toast.error("Please select at least one product to cancel");
      return;
    }

    if (!cancellationReason) {
      toast.error("Please select a cancellation reason");
      return;
    }

    if (cancellationReason.value === "other" && !customReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    const itemsToCancel = [];
    order.stores.forEach((store) => {
      const storeItems = [];

      store.items.forEach((item, idx) => {
        const key = generateItemKey(store.storeId, item, idx);
        const isCancelled = item.status === "cancelled";

        if (!isCancelled && selectedProducts.has(key)) {
          storeItems.push({
            itemIndex: idx,
            productId: item.productId,
            quantity: item.quantity,
            color: item.color || null,
            size: item.size || null,
          });
        }
      });

      if (storeItems.length > 0) {
        itemsToCancel.push({
          storeId: store.storeId,
          items: storeItems,
        });
      }
    });

    const cancelData = {
      items: itemsToCancel,
      reason:
        cancellationReason.value === "other"
          ? customReason
          : cancellationReason.label,
    };

    cancelMutation.mutate(cancelData);
  };

  const refundDetails = calculateRefund(order, selectedProducts);

  const hasActiveItems = order?.stores.some(
    (store) =>
      store.storeOrderStatus === "pending" &&
      store.items.some((item) => !item.status || item.status !== "cancelled")
  );

  const canCancelOrder =
    order?.orderStatus === "pending" &&
    order?.paymentStatus === "unpaid" &&
    hasActiveItems;

  if (isPending) return <Loader />;

  if (!canCancelOrder) {
    return (
      <CancellationError
        order={order}
        onBackClick={() => navigate("/dashboard/myOrders")}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard/myOrders")}
          className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 mb-4 cursor-pointer"
        >
          <FiArrowLeft size={18} />
          <span>Back to Orders</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cancel Order Items
        </h1>
        <p className="text-gray-700">
          Order ID: <span className="font-mono font-semibold">{orderId}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {order.stores.map((store, storeIndex) => (
            <StoreCard
              key={storeIndex}
              store={store}
              selectedProducts={selectedProducts}
              onToggleProduct={toggleProductSelection}
              onToggleStore={toggleStoreSelection}
            />
          ))}

          <CancellationReasonSelector
            cancellationReason={cancellationReason}
            onReasonChange={setCancellationReason}
            customReason={customReason}
            onCustomReasonChange={setCustomReason}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CancellationSummary
            selectedCount={selectedProducts.size}
            refundDetails={refundDetails}
            onCancel={handleCancelOrder}
            isLoading={cancelMutation.isPending}
            cancellationReason={cancellationReason}
          />
        </div>
      </div>
    </div>
  );
};

export default CancelOrder;