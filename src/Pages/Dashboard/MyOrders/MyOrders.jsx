import { FiSearch, FiFilter } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import Select from "react-select";
import OrderCardSkeleton from "../../../Components/Shared/MyOrders/OrderCardSkeleton";
import OrderCard from "../../../Components/Shared/MyOrders/OrderCard";
import EmptyState from "../../../Components/Shared/MyOrders/EmptyState";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState({
    value: "all",
    label: "All Orders",
  });
  const [stats, setStats] = useState(null);

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
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

  const { isPending, data } = useQuery({
    queryKey: ["my-orders", page, searchTerm, statusFilter.value],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/my`, {
        params: {
          email: userEmail,
          page,
          limit: 10,
          searchTerm,
          status: statusFilter.value !== "all" ? statusFilter.value : undefined,
        },
      });
      setStats(res.data?.stats);
      return res.data;
    },

    keepPreviousData: true,
  });

  const myOrders = data?.myOrders;
  const total = data?.total;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">My Orders</h1>
        <p className="text-gray-700 font-medium">Track and manage your orders</p>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID, store name, product name, customer name or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter with React-Select */}
          <div className="flex items-center gap-2 md:w-70">
            <FiFilter size={25} className="text-gray-400 flex-shrink-0" />
            <Select
              value={statusFilter}
              onChange={(selected) => {
                setPage(1), setStatusFilter(selected);
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-4 pt-4 border-t">
          {[
            "all",
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
          ].map((status) => (
            <div key={status} className="text-center">
              {!stats ? (
                <div className="flex justify-center">
                  <div className="relative w-12 h-10 bg-base-300 rounded overflow-hidden">
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
        <OrderCardSkeleton />
      ) : myOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}

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
    </div>
  );
};

export default MyOrders;