import { formatDate } from "../../../lib/formatDate";
import LazyImage from "../../LazyImage/LazyImage";
import {
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBox,
  FiTruck,
} from "react-icons/fi";
import MiniLoader from "../../Loader/MiniLoader";

const OrderCard = ({
  order,
  store,
  updateStatusMutation,
  setCancelModalData,
  cancelOrderMutation,
  activeItems,
  showCancelledSection,
  cancelledItems,
}) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {/* Order Header */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">
                Order ID:{" "}
                <span className="font-semibold text-gray-900">{order._id}</span>
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
              <span className="capitalize">{store.storeOrderStatus}</span>
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
              <span className="font-medium text-gray-700">Phone:</span>{" "}
              <span className="text-gray-900">
                {order.shippingAddress.phone}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700">Address:</span>{" "}
              <span className="text-gray-900">
                {order.shippingAddress.building &&
                  `${order.shippingAddress.building}, `}
                {order.shippingAddress.address}, {order.shippingAddress.thana},{" "}
                {order.shippingAddress.district}, {order.shippingAddress.region}
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
                          ৳{item.unitPrice.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      {store.storeOrderStatus === "pending" && (
                        <button
                          onClick={() =>
                            handleCancelItem(order, store, item, originalIndex)
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
                        {(item.color || item.size) && "•"} Qty: {item.quantity}
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
};

export default OrderCard;