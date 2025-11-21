import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Loader/Loader";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const { isPending, data: myOrders } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/my?email=${userEmail}`);
      return res.data;
    },
  });

  if(isPending) return <Loader />

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "shipped":
        return <FiTruck className="text-blue-500" />;
      case "confirmed":
        return <FiPackage className="text-purple-500" />;
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-orange-100 text-orange-700";
      case "refunded":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, store, or product..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
          {["all", "pending", "confirmed", "shipped", "delivered"].map(
            (status) => (
              <div key={status} className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {status === "all"
                    ? myOrders.length
                    : myOrders.filter(
                        (o) => o.orderStatus.toLowerCase() === status
                      ).length}
                </p>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Orders List */}
      {myOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order ID</p>
                      <p className="font-mono text-sm font-semibold text-gray-900">
                        #{order._id.toUpperCase()}
                      </p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Time</p>
                      <p className="text-sm text-gray-700">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      <span className="capitalize">{order.orderStatus}</span>
                    </span>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-4">
                {/* Stores and Items */}
                {order.stores.map((store, storeIndex) => (
                  <div
                    key={storeIndex}
                    className={`${storeIndex > 0 ? "mt-4 pt-4 border-t" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiPackage className="text-blue-500" />
                        {store.storeName}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          store.storeOrderStatus
                        )}`}
                      >
                        {store.storeOrderStatus}
                      </span>
                    </div>

                    {/* Items Grid */}
                    <div className="space-y-3">
                      {store.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-20 h-20 object-contain rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate mb-1">
                              {item.productName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
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
                                <span>• Size: {item.size.toUpperCase()}</span>
                              )}
                              <span>• Qty: {item.quantity}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">
                                {formatCurrency(item.unitPrice)} ×{" "}
                                {item.quantity}
                              </span>
                              {item.discount > 0 && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  {item.discount}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gray-900">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Store Summary */}
                    <div className="mt-3 pt-3 border-t flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Store Subtotal (incl. delivery ৳{store.deliveryCharge})
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(store.storeTotal)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Order Footer */}
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipping Address */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <FiMapPin className="text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-blue-900 mb-1">
                            Shipping Address
                          </p>
                          <p className="text-sm text-gray-700 font-medium">
                            {order.shippingAddress.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.address},{" "}
                            {order.shippingAddress.thana},{" "}
                            {order.shippingAddress.district}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <FiCreditCard className="text-green-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-green-900 mb-1">
                            Payment Details
                          </p>
                          <p className="text-sm text-gray-700 font-medium capitalize mb-1">
                            {order.paymentMethod.replace("_", " ")}
                          </p>
                          {order.transactionId && (
                            <p className="text-xs text-gray-600 font-mono">
                              TXN: {order.transactionId}
                            </p>
                          )}
                          {order.cashPaymentFee && (
                            <p className="text-xs text-gray-600 mt-1">
                              Cash Payment Fee: ৳{order.cashPaymentFee}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.orderStatus === "delivered" && (
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                        Leave Review
                      </button>
                    )}
                    {order.orderStatus === "pending" && (
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;