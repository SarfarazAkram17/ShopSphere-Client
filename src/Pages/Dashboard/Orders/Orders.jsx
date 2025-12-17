import { FiSearch, FiFilter, FiAlertCircle } from "react-icons/fi";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import Select from "react-select";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";
import MiniLoader from "../../../Components/Loader/MiniLoader";
import OrderCardSkeleton from "../../../Components/Shared/Orders/OrderCardSkeleton";
import EmptyState from "../../../Components/Shared/Orders/EmptyState";
import OrderCard from "../../../Components/Shared/Orders/OrderCard";

const Orders = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(0);
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
      <div className="mb-4">
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
                  setPage(0);
                }}
                placeholder="Search by order ID, product name, or customer name or phone..."
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
                setPage(0);
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6">
          {[
            { key: "all", label: "All", color: "bg-stone-200/70" },
            { key: "pending", label: "Pending", color: "bg-yellow-100" },
            { key: "confirmed", label: "Confirmed", color: "bg-indigo-100" },
            { key: "prepared", label: "Prepared", color: "bg-purple-100" },
            { key: "shipped", label: "Shipped", color: "bg-blue-100" },
            { key: "delivered", label: "Delivered", color: "bg-green-100" },
            { key: "cancelled", label: "Cancelled", color: "bg-red-100" },
          ].map((stat) => (
            <div
              key={stat.key}
              className={`${stat.color} rounded-lg p-4 text-center`}
            >
              {!stats ? (
                <div className="flex justify-center">
                  <div className="relative w-12 h-10 bg-gray-200 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {stats[stat.key]}
                </p>
              )}
              <p className="text-xs text-gray-700 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isPending ? (
        <OrderCardSkeleton />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const store = order.stores[0];
            if (!store) return null;

            const activeItems = getActiveItems(store);
            const cancelledItems = getCancelledItems(store);
            const showCancelledSection = cancelledItems.length > 0;

            return (
              <OrderCard
                key={`${order._id}-${store.storeId}`}
                order={order}
                store={store}
                updateStatusMutation={updateStatusMutation}
                setCancelModalData={setCancelModalData}
                cancelOrderMutation={cancelOrderMutation}
                activeItems={activeItems}
                showCancelledSection={showCancelledSection}
                cancelledItems={cancelledItems}
              />
            );
          })}

          {/* Pagination */}
          <div className="flex justify-end mt-10">
            <Pagination
              count={Math.ceil(total / 10)}
              page={page + 1}
              variant="outlined"
              shape="rounded"
              color="primary"
              showFirstButton
              showLastButton
              onChange={(e, value) => setPage(value - 1)}
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