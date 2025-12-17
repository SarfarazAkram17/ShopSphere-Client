import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Select from "react-select";
import EmptyState from "../../../Components/Shared/AllOrders/EmptyState";
import OrderTableSkeleton from "../../../Components/Shared/AllOrders/OrderTableSkeleton";
import OrderTable from "../../../Components/Shared/AllOrders/OrderTable";
import OrderDetailsModal from "../../../Components/Shared/AllOrders/OrderDetailsModal";

const AllOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState({
    value: "all",
    label: "All Status",
  });
  const [paymentFilter, setPaymentFilter] = useState({
    value: "all",
    label: "All Payments",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState(null);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "prepared", label: "Prepared" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentOptions = [
    { value: "all", label: "All Payments" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
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

  // Fetch all orders
  const { isPending, data } = useQuery({
    queryKey: [
      "all-orders",
      page,
      rowsPerPage,
      searchTerm,
      statusFilter.value,
      paymentFilter.value,
    ],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/all`, {
        params: {
          email: userEmail,
          page,
          limit: rowsPerPage,
          searchTerm,
          status: statusFilter.value !== "all" ? statusFilter.value : undefined,
          paymentStatus:
            paymentFilter.value !== "all" ? paymentFilter.value : undefined,
        },
      });
      setStats(res.data?.stats);
      return res.data;
    },
    keepPreviousData: true,
  });

  const orders = data?.allOrders || [];
  const total = data?.total || 0;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "prepared":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "confirmed":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPaymentColor = (status) => {
    return status === "paid"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : "bg-orange-100 text-orange-800 border-orange-300";
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate items and stores count for each order
  const getOrderMetrics = (order) => {
    const itemsCount = order.stores.reduce((acc, store) => {
      return acc + store.items.length;
    }, 0);
    const storesCount = order.stores.length;
    return { itemsCount, storesCount };
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-primary mb-2">All Orders</h1>
        <p className="text-gray-700 font-medium">
          Monitor and manage all orders across the platform
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                placeholder="Search by order ID, product name, store name, customer name, email or phone..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Status Filter */}
          <div>
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

          {/* Payment Status Filter */}
          <div>
            <Select
              value={paymentFilter}
              onChange={(selected) => {
                setPaymentFilter(selected);
                setPage(0);
              }}
              options={paymentOptions}
              styles={customSelectStyles}
              className="flex-1"
              classNamePrefix="select"
              isSearchable={true}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4 mt-6">
          {[
            { key: "all", label: "All", color: "bg-stone-200/70" },
            { key: "pending", label: "Pending", color: "bg-yellow-100" },
            { key: "confirmed", label: "Confirmed", color: "bg-indigo-100" },
            { key: "prepared", label: "Prepared", color: "bg-purple-100" },
            { key: "shipped", label: "Shipped", color: "bg-blue-100" },
            { key: "delivered", label: "Delivered", color: "bg-green-100" },
            { key: "cancelled", label: "Cancelled", color: "bg-red-100" },
            { key: "paid", label: "Paid", color: "bg-emerald-100" },
            { key: "unpaid", label: "Unpaid", color: "bg-orange-100" },
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

      {/* Orders Table Card */}
      {isPending ? (
        <OrderTableSkeleton />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <OrderTable
          orders={orders}
          getOrderMetrics={getOrderMetrics}
          page={page}
          rowsPerPage={rowsPerPage}
          formatCurrency={formatCurrency}
          setSelectedOrder={setSelectedOrder}
          total={total}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          getStatusColor={getStatusColor}
          getPaymentColor={getPaymentColor}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <OrderDetailsModal
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            formatCurrency={formatCurrency}
            getOrderMetrics={getOrderMetrics}
            getStatusColor={getStatusColor}
            getPaymentColor={getPaymentColor}
          />
        </div>
      )}
    </div>
  );
};

export default AllOrders;