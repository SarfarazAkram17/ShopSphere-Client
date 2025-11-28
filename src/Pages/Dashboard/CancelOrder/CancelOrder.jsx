import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiArrowLeft, FiAlertCircle, FiXCircle } from "react-icons/fi";
import Select from "react-select";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { toast } from "react-toastify";
import MiniLoader from "../../../Components/Loader/MiniLoader";
import Loader from "../../../Components/Loader/Loader";

const CancelOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const queryClient = useQueryClient();

  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [cancellationReason, setCancellationReason] = useState(null);
  const [customReason, setCustomReason] = useState("");

  const cancellationReasons = [
    { value: "changed_mind", label: "Changed my mind" },
    { value: "found_better_price", label: "Found better price elsewhere" },
    { value: "ordered_by_mistake", label: "Ordered by mistake" },
    {
      value: "delivery_time_too_long",
      label: "Delivery time is too long",
    },
    { value: "product_not_needed", label: "Product no longer needed" },
    {
      value: "incorrect_item",
      label: "Ordered incorrect item/size/color",
    },
    { value: "financial_constraints", label: "Financial constraints" },
    { value: "other", label: "Other reason" },
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "44px",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#dbeafe"
        : "white",
      color: state.isSelected ? "white" : "#1f2937",
    }),
  };

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
      toast.success("Order cancelled successfully!");
      queryClient.invalidateQueries(["my-orders"]);
      queryClient.invalidateQueries(["order-details", orderId, userEmail]);
      navigate("/dashboard/myOrders");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });

  // Generate unique key for each item (including variants)
  const generateItemKey = (storeId, item, itemIndex) => {
    // Use itemIndex to differentiate same product with different variants
    return `${storeId}_${item.productId}_${itemIndex}`;
  };

  // Toggle product selection
  const toggleProductSelection = (key, isCancelled) => {
    // Don't allow selection of already cancelled items
    if (isCancelled) return;

    const newSelection = new Set(selectedProducts);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    setSelectedProducts(newSelection);
  };

  // Select all products from a store (only non-cancelled items)
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

  // Calculate refund
  const calculateRefund = () => {
    if (!order) return { itemsRefund: 0, deliveryRefund: 0, totalRefund: 0 };

    let itemsRefund = 0;
    let deliveryRefund = 0;

    order.stores.forEach((store) => {
      if (store.storeOrderStatus !== "pending") return;

      // Get selected items from this store
      const selectedStoreItems = store.items.filter((item, idx) => {
        const key = generateItemKey(store.storeId, item, idx);
        return (
          selectedProducts.has(key) &&
          (!item.status || item.status !== "cancelled")
        );
      });

      // Calculate items refund
      const storeItemsTotal = selectedStoreItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      itemsRefund += storeItemsTotal;

      // Check if all active items from this store are selected
      const activeItems = store.items.filter(
        (item) => !item.status || item.status !== "cancelled"
      );

      const allActiveSelected = activeItems.every((item) => {
        // Find the correct index in the original items array
        const originalIdx = store.items.findIndex(
          (i, originalIdx) =>
            i === item && originalIdx === store.items.indexOf(item)
        );
        const key = generateItemKey(store.storeId, item, originalIdx);
        return selectedProducts.has(key);
      });

      if (allActiveSelected && activeItems.length > 0) {
        deliveryRefund += store.deliveryCharge;
      }
    });

    // Add cash payment fee if entire order is cancelled
    let cashFeeRefund = 0;
    const allPendingProductsSelected = order.stores
      .filter((store) => store.storeOrderStatus === "pending")
      .every((store) => {
        const activeItems = store.items.filter(
          (item) => !item.status || item.status !== "cancelled"
        );

        return (
          activeItems.length > 0 &&
          activeItems.every((item) => {
            const originalIdx = store.items.findIndex(
              (i, originalIdx) =>
                i === item && originalIdx === store.items.indexOf(item)
            );
            const key = generateItemKey(store.storeId, item, originalIdx);
            return selectedProducts.has(key);
          })
        );
      });

    if (allPendingProductsSelected && order.cashPaymentFee) {
      cashFeeRefund = order.cashPaymentFee;
    }

    return {
      itemsRefund,
      deliveryRefund,
      cashFeeRefund,
      totalRefund: itemsRefund + deliveryRefund + cashFeeRefund,
    };
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

    // Prepare cancellation data
    const itemsToCancel = [];
    order.stores.forEach((store) => {
      const storeItems = [];

      store.items.forEach((item, idx) => {
        const key = generateItemKey(store.storeId, item, idx);
        const isCancelled = item.status === "cancelled";

        if (!isCancelled && selectedProducts.has(key)) {
          storeItems.push({
            itemIndex: idx, // Send index to identify exact variant
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

  const refundDetails = calculateRefund();

  // Check if order has any active items to cancel
  const hasActiveItems = order?.stores.some(
    (store) =>
      store.storeOrderStatus === "pending" &&
      store.items.some((item) => !item.status || item.status !== "cancelled")
  );

  const canCancelOrder =
    order?.orderStatus === "pending" &&
    order?.paymentStatus === "unpaid" &&
    hasActiveItems;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isPending) return <Loader />;

  if (!canCancelOrder) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FiXCircle className="mx-auto text-red-500 text-5xl mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">
            Cannot Cancel Order
          </h2>
          <p className="text-red-700 mb-4">
            This order cannot be cancelled because it has been{" "}
            {order?.orderStatus} or payment is already completed, or all items
            are already cancelled.
          </p>
          <button
            onClick={() => navigate("/dashboard/myOrders")}
            className="btn btn-error text-white px-8"
          >
            Back to Orders
          </button>
        </div>
      </div>
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
          {order.stores.map((store, storeIndex) => {
            const isPending = store.storeOrderStatus === "pending";

            // Filter active and cancelled items
            const activeItems = store.items.filter(
              (item) => !item.status || item.status !== "cancelled"
            );
            const cancelledItems = store.items.filter(
              (item) => item.status === "cancelled"
            );

            // Check if all active items are selected
            const allActiveSelected =
              isPending &&
              activeItems.length > 0 &&
              activeItems.every((item) => {
                const originalIdx = store.items.indexOf(item);
                const key = generateItemKey(store.storeId, item, originalIdx);
                return selectedProducts.has(key);
              });

            // Don't show store if all items are cancelled and store is not pending
            if (
              store.items.length === 0 ||
              (cancelledItems.length === store.items.length && !isPending)
            ) {
              return null;
            }

            return (
              <div
                key={storeIndex}
                className={`bg-white rounded-lg shadow-md p-4 ${
                  !isPending ? "opacity-60" : ""
                }`}
              >
                {/* Store Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <div className="flex items-center gap-3">
                    {isPending && activeItems.length > 0 && (
                      <input
                        type="checkbox"
                        checked={allActiveSelected}
                        onChange={() => toggleStoreSelection(store)}
                        className="checkbox checkbox-primary rounded text-white"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {store.storeName}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        Status: {store.storeOrderStatus}
                      </p>
                      {cancelledItems.length > 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          {cancelledItems.length} item(s) already cancelled
                        </p>
                      )}
                    </div>
                  </div>
                  {!isPending && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      Cannot Cancel
                    </span>
                  )}
                </div>

                {/* Products */}
                <div className="space-y-3">
                  {store.items.map((item, itemIndex) => {
                    const isCancelled = item.status === "cancelled";
                    const itemKey = generateItemKey(
                      store.storeId,
                      item,
                      itemIndex
                    );
                    const isSelected = selectedProducts.has(itemKey);

                    return (
                      <div
                        key={itemIndex}
                        className={`flex gap-3 p-3 rounded-lg border-2 transition-all relative ${
                          isCancelled
                            ? "border-red-300 bg-red-50 opacity-70"
                            : isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50"
                        } ${
                          !isPending || isCancelled
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() =>
                          isPending &&
                          toggleProductSelection(itemKey, isCancelled)
                        }
                      >
                        {/* Cancelled Badge */}
                        {isCancelled && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              <FiXCircle className="text-xs" />
                              Cancelled
                            </span>
                          </div>
                        )}

                        {isPending && !isCancelled && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              toggleProductSelection(itemKey, isCancelled)
                            }
                            className="checkbox checkbox-primary rounded text-white mt-1"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}

                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className={`w-20 h-20 object-contain rounded-lg ${
                            isCancelled ? "grayscale opacity-50" : ""
                          }`}
                        />
                        <div className="flex-1">
                          <h4
                            className={`font-medium mb-1 ${
                              isCancelled
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {item.productName}
                          </h4>
                          <div
                            className={`flex items-center gap-2 text-sm mb-2 ${
                              isCancelled ? "text-gray-600" : "text-gray-800"
                            }`}
                          >
                            {item.color && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: item.color }}
                                ></span>
                                <span className="capitalize">{item.color}</span>
                              </span>
                            )}
                            {item.size && (
                              <span>
                                {item.color && "•"} Size: {item.size}
                              </span>
                            )}
                            <span>
                              {(item.color || item.size) && "•"} Qty:{" "}
                              {item.quantity}
                            </span>
                          </div>
                          <p
                            className={`text-sm font-semibold ${
                              isCancelled
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            ৳{item.subtotal.toFixed(2)}
                          </p>
                          {isCancelled && item.cancelledAt && (
                            <p className="text-xs text-red-600 mt-2">
                              Cancelled on {formatDate(item.cancelledAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active Items Summary */}
                {activeItems.length > 0 && cancelledItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      {activeItems.length} active item(s) can be cancelled
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Cancellation Reason */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Cancellation Reason <span className="text-red-500">*</span>
            </label>
            <Select
              value={cancellationReason}
              onChange={setCancellationReason}
              options={cancellationReasons}
              styles={customSelectStyles}
              placeholder="Select a reason..."
              className="mb-3"
            />

            {cancellationReason?.value === "other" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please explain your reason..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="5"
              />
            )}
          </div>
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h3 className="font-bold text-gray-900 text-lg mb-4">
              Cancellation Summary
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Selected Products:</span>
                <span className="font-semibold text-gray-900">
                  {selectedProducts.size}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items Refund:</span>
                <span className="font-semibold text-gray-900">
                  ৳{refundDetails.itemsRefund.toFixed(2)}
                </span>
              </div>
              {refundDetails.deliveryRefund > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Refund:</span>
                  <span className="font-semibold text-gray-900">
                    ৳{refundDetails.deliveryRefund.toFixed(2)}
                  </span>
                </div>
              )}
              {refundDetails.cashFeeRefund > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cash Fee Refund:</span>
                  <span className="font-semibold text-gray-900">
                    ৳{refundDetails.cashFeeRefund.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t mb-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Refund:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ৳{refundDetails.totalRefund.toFixed(2)}
                </span>
              </div>
            </div>

            {selectedProducts.size > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-900">
                    Selected items will be cancelled and marked in your order.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleCancelOrder}
              disabled={
                selectedProducts.size === 0 ||
                !cancellationReason ||
                cancelMutation.isPending
              }
              className="w-full btn btn-error text-white disabled:text-black/50"
            >
              {cancelMutation.isPending ? (
                <>
                  <MiniLoader /> Processing...
                </>
              ) : (
                "Cancel Selected Items"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrder;