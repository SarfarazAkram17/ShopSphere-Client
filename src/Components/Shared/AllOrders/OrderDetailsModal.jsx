import { formatDate } from "../../../lib/formatDate";
import LazyImage from "../../LazyImage/LazyImage";
import { FiPackage } from "react-icons/fi";

const OrderDetailsModal = ({
  selectedOrder,
  setSelectedOrder,
  formatCurrency,
  getOrderMetrics,
  getStatusColor,
  getPaymentColor,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
      <div className="sticky top-0 bg-base-200 border-b px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
          <p className="text-sm text-gray-600 mt-1">{selectedOrder._id}</p>
        </div>
        <button
          onClick={() => setSelectedOrder(null)}
          className="text-black hover:text-red-600 text-2xl cursor-pointer font-black"
        >
          ✕
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Customer Name</p>
            <p className="text-sm font-semibold text-gray-900">
              {selectedOrder.shippingAddress.name}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Total Amount</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(selectedOrder.totalAmount)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Order Status</p>
            <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusColor(
                selectedOrder.orderStatus
              )}`}
            >
              {selectedOrder.orderStatus}
            </span>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Payment Status</p>
            <span
              className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${getPaymentColor(
                selectedOrder.paymentStatus
              )}`}
            >
              {selectedOrder.paymentStatus}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="font-semibold text-gray-900 mb-3">
            Additional Information
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Email:</span>{" "}
              {selectedOrder.customerEmail}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {selectedOrder.shippingAddress.phone}
            </p>
            <p>
              <span className="font-medium">Payment Method:</span>{" "}
              <span className="capitalize">
                {selectedOrder.paymentMethod.replace(/_/g, " ")}
              </span>
            </p>
            <p>
              <span className="font-medium">Items Count:</span>{" "}
              {getOrderMetrics(selectedOrder).itemsCount}
            </p>
            <p>
              <span className="font-medium">Stores:</span>{" "}
              {getOrderMetrics(selectedOrder).storesCount}
            </p>
            <p>
              <span className="font-medium">Order Date:</span>{" "}
              {formatDate(selectedOrder.createdAt)}
            </p>
            <p>
              <span className="font-medium">Shipping Address:</span>{" "}
              {selectedOrder.shippingAddress.address},{" "}
              {selectedOrder.shippingAddress.thana},{" "}
              {selectedOrder.shippingAddress.district},{" "}
              {selectedOrder.shippingAddress.region}
            </p>
          </div>
        </div>

        {/* Ordered Products by Store */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b">
            <h4 className="text-sm font-semibold text-gray-900">
              Ordered Products
            </h4>
          </div>
          <div className="p-4 space-y-6">
            {selectedOrder.stores.map((store, storeIndex) => (
              <div
                key={storeIndex}
                className={storeIndex > 0 ? "pt-6 border-t" : ""}
              >
                {/* Store Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiPackage className="text-blue-600" size={18} />
                    <h5 className="font-semibold text-gray-900">
                      {store.storeName}
                    </h5>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize border ${getStatusColor(
                      store.storeOrderStatus
                    )}`}
                  >
                    {store.storeOrderStatus}
                  </span>
                </div>

                {/* Products List */}
                <div className="space-y-3">
                  {store.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`flex gap-3 p-3 rounded-lg transition-colors ${
                        item.status === "cancelled"
                          ? "bg-red-50 border border-red-200 opacity-75"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {/* Product Image */}
                      <LazyImage
                        src={item.productImage}
                        alt={item.productName}
                        className={`w-16 h-16 rounded-md flex-shrink-0 ${
                          item.status === "cancelled" ? "grayscale" : ""
                        }`}
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h6
                          className={`text-sm font-medium mb-1 ${
                            item.status === "cancelled"
                              ? "text-gray-500 line-through"
                              : "text-gray-900"
                          }`}
                          title={item.productName}
                        >
                          {item.productName.length > 50
                            ? item.productName.substring(0, 50) + "..."
                            : item.productName}
                        </h6>

                        {/* Product Attributes */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-1">
                          {item.color && (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color }}
                              ></span>
                              <span className="capitalize">{item.color}</span>
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
                          {item.discount > 0 && !item.status && (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              {item.discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Unit Price */}
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.unitPrice)} × {item.quantity}
                        </p>

                        {/* Cancellation Info */}
                        {item.status === "cancelled" && (
                          <div className="mt-2 text-xs">
                            {item.cancellationReason && (
                              <p className="text-red-600 italic">
                                Reason: {item.cancellationReason}
                              </p>
                            )}
                            {item.cancelledBy && (
                              <p className="text-gray-500 capitalize mt-0.5">
                                Cancelled by: {item.cancelledBy}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Product Price */}
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-sm font-bold ${
                            item.status === "cancelled"
                              ? "text-red-600 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Store Summary */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
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
                      {formatCurrency(store.storeTotal + store.deliveryCharge)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;