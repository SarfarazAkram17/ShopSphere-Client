import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBox,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import LazyImage from "../../LazyImage/LazyImage";
import { formatDate } from "../../../lib/formatDate";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

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

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Check if order has any pending items to cancel
  const hasPendingItems = order.stores.some(
    (store) =>
      store.storeOrderStatus === "pending" &&
      store.items.some((item) => !item.status || item.status !== "cancelled")
  );

  const canCancelOrder =
    order.orderStatus === "pending" &&
    order.paymentStatus === "unpaid" &&
    hasPendingItems;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {/* Order Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div>
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="font-mono text-sm font-semibold text-gray-900">
                {order._id.toUpperCase()}
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
              {store.items.map((item, itemIndex) => {
                const isCancelled = item.status === "cancelled";

                return (
                  <div
                    key={itemIndex}
                    className={`flex gap-3 p-3 rounded-lg transition-colors relative ${
                      isCancelled
                        ? "bg-red-50 border-2 border-red-200 opacity-80"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {/* Cancelled Badge */}
                    {isCancelled && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          <FiXCircle className="text-sm" />
                          Cancelled
                        </span>
                      </div>
                    )}

                    <LazyImage
                      src={item.productImage}
                      alt={item.productName}
                      className={`w-20 h-20 rounded-lg flex-shrink-0 ${
                        isCancelled ? "grayscale" : ""
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        title={item.productName}
                        className={`font-medium truncate mb-1 ${
                          isCancelled
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {item.productName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
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
                            {item.color && "•"} Size: {item.size.toUpperCase()}
                          </span>
                        )}
                        <span>
                          {(item.color || item.size) && "•"} Qty:{" "}
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm ${
                            isCancelled ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {formatCurrency(item.unitPrice)} × {item.quantity}
                        </span>
                        {item.discount > 0 && !isCancelled && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>
                      {isCancelled && item.cancelledAt && (
                        <p className="text-xs text-red-600 mt-2">
                          Cancelled on {formatDate(item.cancelledAt)}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`font-bold ${
                          isCancelled
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Store Summary */}
            <div className="mt-3 pt-3 border-t flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Store Subtotal{" "}
                {store.storeOrderStatus !== "cancelled" && (
                  <>(incl. delivery ৳{store.deliveryCharge})</>
                )}
              </span>
              <span
                className={`font-semibold ${
                  store.storeOrderStatus === "cancelled"
                    ? "text-gray-400 line-through"
                    : "text-gray-900"
                }`}
              >
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
                    {order.paymentMethod.replace("_", " ").replace("_", " ")}
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

          {/* Cancellation History */}
          {order.cancellationHistory &&
            order.cancellationHistory.length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <FiXCircle />
                  Cancellation History
                </h4>
                {order.cancellationHistory.map((history, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-gray-700 mb-2 last:mb-0"
                  >
                    <p className="font-medium">
                      {formatDate(history.cancelledAt)} - {history.items.length}{" "}
                      item(s) cancelled
                    </p>
                    <p className="text-gray-600">Reason: {history.reason}</p>
                    <p className="text-red-700 font-semibold">
                      Refund: {formatCurrency(history.refundAmount)}
                    </p>
                  </div>
                ))}
              </div>
            )}

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {order.orderStatus === "delivered" && (
              <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Leave Review
              </button>
            )}
            {canCancelOrder && (
              <button
                onClick={() => navigate(`/dashboard/cancelOrder/${order._id}`)}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 cursor-pointer rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;