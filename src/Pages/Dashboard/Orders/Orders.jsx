import {
  FiSearch,
  FiFilter,
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBox,
  FiTruck,
} from "react-icons/fi";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import Select from "react-select";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";
import LazyImage from "../../../Components/LazyImage/LazyImage";
import MiniLoader from "../../../Components/Loader/MiniLoader";
import { formatDate } from "../../../lib/formatDate";

const Orders = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState({
    value: "all",
    label: "All Orders",
  });
  const { userEmail } = useAuth();
  const [stats, setStats] = useState(null);
  const [cancelModalData, setCancelModalData] = useState(null);
  const [cancellationReason, setCancellationReason] = useState(null);
  const [customReason, setCustomReason] = useState("");

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "prepared", label: "Prepared" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const cancellationReasons = [
    { value: "out_of_stock", label: "Product out of stock" },
    { value: "pricing_error", label: "Pricing error" },
    { value: "cannot_fulfill", label: "Cannot fulfill order" },
    { value: "product_discontinued", label: "Product discontinued" },
    { value: "supplier_issue", label: "Supplier/inventory issue" },
    { value: "quality_concern", label: "Quality concern with product" },
    { value: "fraudulent_order", label: "Suspected fraudulent order" },
    { value: "other", label: "Other reason" },
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
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
      "&:active": {
        backgroundColor: "#3b82f6",
      },
    }),
  };

  // Fetch seller orders
  const { isPending, data, refetch } = useQuery({
    queryKey: ["seller-orders", page, searchTerm, statusFilter.value],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/orders/seller/orders?email=${userEmail}`,
        {
          params: {
            page,
            limit: 10,
            searchTerm,
            status:
              statusFilter.value !== "all" ? statusFilter.value : undefined,
          },
        }
      );
      setStats(res.data?.stats);
      return res.data;
    },
    keepPreviousData: true,
  });

  // Update order status mutation (Confirm or Prepare)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, storeId, status }) => {
      const res = await axiosSecure.patch(
        `/orders/${orderId}/store-status?email=${userEmail}`,
        {
          storeId,
          status,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      refetch();
      toast.success("Order status updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async ({ orderId, items, reason }) => {
      const res = await axiosSecure.post(
        `/orders/${orderId}/cancel?email=${userEmail}`,
        {
          items,
          reason,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      refetch();
      toast.success("Order cancelled successfully");
      setCancelModalData(null);
      setCancellationReason(null);
      setCustomReason("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });

  const orders = data?.orders || [];
  const total = data?.total || 0;

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <FiCheckCircle size={16} className="text-green-500" />;
      case "shipped":
        return <FiTruck size={16} className="text-blue-500" />;
      case "prepared":
        return <FiBox size={16} className="text-purple-500" />;
      case "confirmed":
        return <FiPackage size={16} className="text-indigo-500" />;
      case "pending":
        return <FiClock size={16} className="text-yellow-500" />;
      case "cancelled":
        return <FiXCircle size={16} className="text-red-500" />;
      default:
        return <FiPackage size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "prepared":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "confirmed":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStatusChange = (orderId, storeId, targetStatus) => {
    updateStatusMutation.mutate({ orderId, storeId, status: targetStatus });
  };

  const handleCancelItem = (order, store, item, itemIndex) => {
    setCancelModalData({
      orderId: order._id,
      storeId: store.storeId,
      items: [
        {
          itemIndex,
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        },
      ],
      productName: item.productName,
      isFullOrder: false,
    });
  };

  const handleCancelAllItems = (order, store) => {
    const activeItems = store.items
      .map((item, index) => ({
        itemIndex: index,
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      }))
      .filter((_, index) => store.items[index].status !== "cancelled");

    setCancelModalData({
      orderId: order._id,
      storeId: store.storeId,
      items: activeItems,
      productName: "All Products",
      isFullOrder: true,
    });
  };

  const confirmCancellation = () => {
    if (!cancellationReason) {
      toast.error("Please select a cancellation reason");
      return;
    }

    if (cancellationReason.value === "other" && !customReason.trim()) {
      toast.error("Please provide a custom reason");
      return;
    }

    const reason =
      cancellationReason.value === "other"
        ? customReason.trim()
        : cancellationReason.label;

    const cancelData = {
      orderId: cancelModalData.orderId,
      items: [
        {
          storeId: cancelModalData.storeId,
          items: cancelModalData.items,
        },
      ],
      reason: reason,
    };

    cancelOrderMutation.mutate(cancelData);
  };

  const getActionButtons = (order, store) => {
    const status = store.storeOrderStatus;

    if (status === "prepared" || status === "cancelled") {
      return null;
    }

    const activeItems = store.items.filter(
      (item) => item.status !== "cancelled"
    );

    if (activeItems.length === 0) {
      return null;
    }

    if (status === "pending") {
      return (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              handleStatusChange(order._id, store.storeId, "confirmed")
            }
            disabled={updateStatusMutation.isPending}
            className="btn btn-info text-white disabled:text-black/50 text-sm rounded-lg"
          >
            {updateStatusMutation.isPending ? (
              <>
                <MiniLoader /> Updating...
              </>
            ) : (
              "Confirm Order"
            )}
          </button>
          <button
            onClick={() => handleCancelAllItems(order, store)}
            disabled={cancelOrderMutation.isPending}
            className="btn btn-error text-white disabled:text-black/50 text-sm rounded-lg"
          >
            Cancel All
          </button>
        </div>
      );
    }

    if (status === "confirmed") {
      return (
        <button
          onClick={() =>
            handleStatusChange(order._id, store.storeId, "prepared")
          }
          disabled={updateStatusMutation.isPending}
          className="btn btn-neutral text-white disabled:text-black/50 text-sm rounded-lg"
        >
          {updateStatusMutation.isPending ? (
            <>
              <MiniLoader /> Updating...
            </>
          ) : (
            "Mark as Prepared"
          )}
        </button>
      );
    }

    return null;
  };

  // Get active items (non-cancelled)
  const getActiveItems = (store) => {
    return store.items.filter((item) => item.status !== "cancelled");
  };

  // Get cancelled items
  const getCancelledItems = (store) => {
    return store.items.filter((item) => item.status === "cancelled");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Store Orders</h1>
        <p className="text-gray-700 font-medium">
          Manage your store orders and update their status
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by order ID, product name, or customer details..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 md:w-70">
            <FiFilter size={25} className="text-gray-400 flex-shrink-0" />
            <Select
              value={statusFilter}
              onChange={(selected) => {
                setStatusFilter(selected);
                setPage(1);
              }}
              options={statusOptions}
              styles={customSelectStyles}
              className="flex-1"
              classNamePrefix="select"
              isSearchable={true}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mt-4 pt-4 border-t">
          {[
            "all",
            "pending",
            "confirmed",
            "prepared",
            "shipped",
            "delivered",
            "cancelled",
          ].map((status) => (
            <div key={status} className="text-center">
              {!stats ? (
                <div className="flex justify-center">
                  <div className="relative w-12 h-10 bg-gray-200 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {stats[status]}
                </p>
              )}
              <p className="text-sm text-gray-600 capitalize mt-1">{status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isPending ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Order Header Skeleton */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-2 flex-1">
                {/* Order ID */}
                <div className="relative w-48 h-4 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Date */}
                <div className="relative w-56 h-4 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Payment Status */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="relative w-16 h-6 bg-base-300 rounded-full overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <div className="relative w-28 h-4 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {/* Status Badge */}
                <div className="relative w-32 h-10 bg-base-300 rounded-full overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Action Button */}
                <div className="relative w-28 h-9 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Customer Details Skeleton */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-5 bg-blue-600 rounded"></span>
                <div className="relative w-32 h-5 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="relative w-full h-4 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
                <div className="relative w-full h-4 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
                <div className="md:col-span-2 relative w-full h-4 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </div>
            </div>

            {/* Products Skeleton */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-5 bg-green-600 rounded"></span>
                <div className="relative w-28 h-5 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </div>

              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-base-300 rounded-md overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>

                    <div className="flex-1 space-y-2">
                      {/* Product Name */}
                      <div className="relative w-3/4 h-5 bg-base-300 rounded overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-wrap gap-3">
                        <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                        </div>
                        <div className="relative w-16 h-4 bg-base-300 rounded overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                        </div>
                        <div className="relative w-12 h-4 bg-base-300 rounded overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col gap-2">
                      {/* Price */}
                      <div className="relative w-24 h-6 bg-base-300 rounded overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      </div>
                      <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Skeleton */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 bg-indigo-600 rounded"></span>
                <div className="relative w-36 h-5 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="relative w-32 h-4 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="relative w-40 h-4 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>

                <div className="h-px bg-base-300"></div>

                <div className="flex justify-between pt-2">
                  <div className="relative w-32 h-6 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <div className="relative w-28 h-7 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiPackage className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600">
            You haven't received any orders yet. Orders will appear here when
            customers purchase your products.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const store = order.stores[0];
            if (!store) return null;

            const activeItems = getActiveItems(store);
            const cancelledItems = getCancelledItems(store);
            const showCancelledSection = cancelledItems.length > 0;

            return (
              <div
                key={`${order._id}-${store.storeId}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">
                          Order ID:{" "}
                          <span className="font-semibold text-gray-900">
                            {order._id}
                          </span>
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">Payment:</span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">
                          {order.paymentMethod === "cash_on_delivery"
                            ? "Cash on Delivery"
                            : "Card Payment"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                          store.storeOrderStatus
                        )}`}
                      >
                        {getStatusIcon(store.storeOrderStatus)}
                        <span className="capitalize">
                          {store.storeOrderStatus}
                        </span>
                      </span>
                      {getActionButtons(order, store)}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Customer Details */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-blue-600 rounded"></span>
                      Customer Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>{" "}
                        <span className="text-gray-900">
                          {order.shippingAddress.name}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Phone:
                        </span>{" "}
                        <span className="text-gray-900">
                          {order.shippingAddress.phone}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">
                          Address:
                        </span>{" "}
                        <span className="text-gray-900">
                          {order.shippingAddress.building &&
                            `${order.shippingAddress.building}, `}
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.thana},{" "}
                          {order.shippingAddress.district},{" "}
                          {order.shippingAddress.region}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Products */}
                  {activeItems.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-green-600 rounded"></span>
                        Products ({activeItems.length})
                      </h3>
                      <div className="space-y-3">
                        {activeItems.map((item, idx) => {
                          const originalIndex = store.items.findIndex(
                            (storeItem) =>
                              storeItem.productId === item.productId &&
                              storeItem.color === item.color &&
                              storeItem.size === item.size
                          );

                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <LazyImage
                                src={item.productImage}
                                alt={item.productName}
                                className="w-20 h-20 rounded-md border-2 border-gray-200"
                              />
                              <div className="flex-1">
                                <h4
                                  title={item.productName}
                                  className="font-medium text-gray-900 mb-1 truncate"
                                >
                                  {item.productName}
                                </h4>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                  {item.color && (
                                    <span className="flex items-center gap-1">
                                      <span
                                        className="w-3 h-3 rounded-full border"
                                        style={{ backgroundColor: item.color }}
                                      ></span>
                                      <span className="capitalize">
                                        {item.color}
                                      </span>
                                    </span>
                                  )}
                                  {item.size && (
                                    <span>
                                      {item.color && "•"} Size:{" "}
                                      {item.size.toUpperCase()}
                                    </span>
                                  )}
                                  <span>
                                    {(item.color || item.size) && "•"} Qty:{" "}
                                    {item.quantity}
                                  </span>
                                  {item.discount > 0 && (
                                    <span className="text-green-600 font-medium">
                                      {item.discount}% OFF
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex flex-col gap-2">
                                <div>
                                  <p className="font-bold text-gray-900 text-lg mb-1">
                                    ৳{item.subtotal.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ৳{item.unitPrice.toFixed(2)} ×{" "}
                                    {item.quantity}
                                  </p>
                                </div>
                                {store.storeOrderStatus === "pending" && (
                                  <button
                                    onClick={() =>
                                      handleCancelItem(
                                        order,
                                        store,
                                        item,
                                        originalIndex
                                      )
                                    }
                                    disabled={cancelOrderMutation.isPending}
                                    className="btn btn-error btn-xs text-white px-3.5 text-xs disabled:text-black/50"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cancelled Products */}
                  {showCancelledSection && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                        <FiAlertCircle className="text-red-500" />
                        Cancelled Items ({cancelledItems.length})
                      </h3>
                      <div className="space-y-3">
                        {cancelledItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border-2 border-red-200 opacity-75"
                          >
                            <LazyImage
                              src={item.productImage}
                              alt={item.productName}
                              className="w-20 h-20 rounded-md border-2 border-red-300 grayscale"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1 line-through">
                                {item.productName}
                              </h4>
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                                {item.color && <span>Color: {item.color}</span>}
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
                              {item.cancellationReason && (
                                <p className="text-xs text-red-600 italic mb-1">
                                  Reason: {item.cancellationReason}
                                </p>
                              )}
                              {item.cancelledBy && (
                                <p className="text-xs text-gray-500 capitalize">
                                  Cancelled by: {item.cancelledBy}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-red-600 text-lg line-through">
                                ৳{item.subtotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-indigo-600 rounded"></span>
                      Financial Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          Subtotal ({activeItems.length} items):
                        </span>
                        <span className="font-semibold text-gray-900">
                          ৳{store.storeTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          Platform Commission ({store.platformCommission}%):
                        </span>
                        <span className="font-semibold text-red-600">
                          -৳{store.platformCommissionAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-[1.5px] bg-gray-400"></div>
                      <div className="flex justify-between pt-2">
                        <span className="font-bold text-gray-900 text-lg">
                          Your Earnings:
                        </span>
                        <span className="font-bold text-green-600 text-xl">
                          ৳{store.sellerAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          <div className="flex justify-end mt-10">
            <Pagination
              count={Math.ceil(total / 10)}
              page={page}
              variant="outlined"
              shape="rounded"
              color="primary"
              showFirstButton
              showLastButton
              onChange={(e, value) => setPage(value)}
            />
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalData && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiAlertCircle className="text-red-500" size={25} />
              <h3 className="text-xl font-bold text-gray-900">
                Cancel{" "}
                {cancelModalData.isFullOrder ? "All Products" : "Product"}
              </h3>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel{" "}
              <span className="font-semibold">
                {cancelModalData.productName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mb-4">
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

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCancelModalData(null);
                  setCancellationReason(null);
                  setCustomReason("");
                }}
                disabled={cancelOrderMutation.isPending}
                className="flex-1 btn disabled:text-black/50"
              >
                Keep Order
              </button>
              <button
                onClick={confirmCancellation}
                disabled={
                  cancelOrderMutation.isPending ||
                  !cancellationReason ||
                  (cancellationReason?.value === "other" &&
                    !customReason.trim())
                }
                className="flex-1 btn btn-error text-white disabled:text-black/50"
              >
                {cancelOrderMutation.isPending ? (
                  <>
                    <MiniLoader /> Cancelling...
                  </>
                ) : (
                  "Cancel Item(s)"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;