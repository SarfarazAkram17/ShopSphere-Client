import { useState } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiEye,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";

const MyOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const ordersPerPage = 5;

  // Dummy data based on your structure
  const allOrders = [
    {
      _id: "6915d2057d706c581f9edf8a",
      customerEmail: "cubingtechbysarfaraz07@gmail.com",
      orderStatus: "confirmed",
      paymentStatus: "paid",
      shippingAddress: {
        name: "Sarfaraz Akram",
        phone: "01973254091",
        address: "Near to Al-Faruque Academy",
        building: "Koya Bansbari",
        thana: "Saidpur",
        district: "Nilphamari",
        region: "Rangpur",
      },
      stores: [
        {
          storeName: "VoltZone",
          storeOrderStatus: "confirmed",
          items: [
            {
              productName: "NovaSound Wireless Noise-Cancelling Headphones",
              productImage:
                "https://res.cloudinary.com/dcmp1sd2v/image/upload/v1759262376/ktln1czjvjasoob9t9hy.jpg",
              color: "brown",
              quantity: 3,
              unitPrice: 19999,
              subtotal: 59997,
            },
          ],
          deliveryCharge: 150,
          storeTotal: 59997,
        },
      ],
      totalAmount: 60147,
      paymentMethod: "card",
      transactionId: "TXN123456789",
      createdAt: "2025-11-13T12:41:41.467Z",
    },
    {
      _id: "6915b70e353e6ebfbdf53fa3",
      customerEmail: "cubingtechbysarfaraz07@gmail.com",
      orderStatus: "pending",
      paymentStatus: "unpaid",
      shippingAddress: {
        name: "Sarfaraz Akram",
        phone: "01973254091",
        address: "Near to Al-Faruque Academy",
        building: "Koya Bansbari",
        thana: "Saidpur",
        district: "Nilphamari",
        region: "Rangpur",
      },
      stores: [
        {
          storeName: "VoltZone",
          storeOrderStatus: "pending",
          items: [
            {
              productName: "Acromax T55 Fine Wrist Series 6 Smartwatch",
              productImage:
                "https://res.cloudinary.com/dcmp1sd2v/image/upload/v1759263271/kh8deso2shlsvi5zj5ls.webp",
              color: "green",
              quantity: 2,
              unitPrice: 24999,
              discount: 25,
              discountedPrice: 18749.25,
              subtotal: 37498.5,
            },
            {
              productName: 'PixelView 55" 4K Ultra HD Smart TV',
              productImage:
                "https://res.cloudinary.com/dcmp1sd2v/image/upload/v1759262922/ok5uyhu1xejzicman3mx.jpg",
              quantity: 2,
              unitPrice: 64999,
              subtotal: 129998,
            },
          ],
          deliveryCharge: 150,
          storeTotal: 227493.5,
        },
        {
          storeName: "Tanstack",
          storeOrderStatus: "pending",
          items: [
            {
              productName: "Velvet Matte Lipstick",
              productImage:
                "https://res.cloudinary.com/dcmp1sd2v/image/upload/v1763029802/za6hmkbwhmkmt0xxutsn.png",
              color: "red",
              quantity: 2,
              unitPrice: 1299,
              discount: 12,
              discountedPrice: 1143.12,
              subtotal: 2286.24,
            },
          ],
          deliveryCharge: 150,
          storeTotal: 19412.29,
        },
      ],
      totalAmount: 604043.79,
      paymentMethod: "cash_on_delivery",
      createdAt: "2025-11-13T10:46:38.475Z",
      cashPaymentFee: 20,
    },
    {
      _id: "6915c3057d706c581f9edf7b",
      customerEmail: "cubingtechbysarfaraz07@gmail.com",
      orderStatus: "shipped",
      paymentStatus: "paid",
      shippingAddress: {
        name: "Sarfaraz Akram",
        phone: "01973254091",
        address: "Level-4, 34, Awal Centre, Banani",
        thana: "Dhanmondi",
        district: "Dhaka",
        region: "Dhaka",
      },
      stores: [
        {
          storeName: "Json Web Token",
          storeOrderStatus: "shipped",
          items: [
            {
              productName: "Kookaburra English Willow Bat",
              productImage:
                "https://res.cloudinary.com/dcmp1sd2v/image/upload/v1759183649/eyu0wkvapqrlzdotqxek.jpg",
              color: "blue",
              quantity: 2,
              unitPrice: 34000,
              discount: 14,
              discountedPrice: 29240,
              subtotal: 58480,
            },
          ],
          deliveryCharge: 150,
          storeTotal: 58630,
        },
      ],
      totalAmount: 58780,
      paymentMethod: "card",
      transactionId: "TXN987654321",
      createdAt: "2025-11-12T08:30:15.234Z",
    },
    {
      _id: "6915a1057d706c581f9edf6c",
      customerEmail: "cubingtechbysarfaraz07@gmail.com",
      orderStatus: "delivered",
      paymentStatus: "paid",
      shippingAddress: {
        name: "Sarfaraz Akram",
        phone: "01973254091",
        address: "Near to Al-Faruque Academy",
        thana: "Saidpur",
        district: "Nilphamari",
        region: "Rangpur",
      },
      stores: [
        {
          storeName: "Tanstack",
          storeOrderStatus: "delivered",
          items: [
            {
              productName: "UrbanFlex Oversized Hoodie",
              productImage:
                "https://res.cloudinary.com/dcmp1sd2v/image/upload/v1759257944/zhfdo8txxzx6kcdshdc0.webp",
              color: "neon green",
              size: "small",
              quantity: 3,
              unitPrice: 4000,
              discount: 4,
              discountedPrice: 3840,
              subtotal: 11520,
            },
          ],
          deliveryCharge: 150,
          storeTotal: 11670,
        },
      ],
      totalAmount: 11670,
      paymentMethod: "cash_on_delivery",
      createdAt: "2025-11-10T14:22:30.123Z",
    },
    {
      _id: "6915f5057d706c581f9edf9d",
      customerEmail: "cubingtechbysarfaraz07@gmail.com",
      orderStatus: "cancelled",
      paymentStatus: "refunded",
      shippingAddress: {
        name: "Sarfaraz Akram",
        phone: "01973254091",
        address: "Near to Al-Faruque Academy",
        thana: "Saidpur",
        district: "Nilphamari",
        region: "Rangpur",
      },
      stores: [
        {
          storeName: "VoltZone",
          storeOrderStatus: "cancelled",
          items: [
            {
              productName: "NovaSound Wireless Noise-Cancelling Headphones",
              productImage:
                "https://res.cloudinary.com/dcmp1sd2v/image/upload/v1759262375/mgwuheayiubqrlwitovc.jpg",
              color: "paste",
              quantity: 1,
              unitPrice: 19999,
              subtotal: 19999,
            },
          ],
          deliveryCharge: 150,
          storeTotal: 20149,
        },
      ],
      totalAmount: 20149,
      paymentMethod: "card",
      transactionId: "TXN456789123",
      createdAt: "2025-11-09T09:15:45.678Z",
    },
  ];

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
    });
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Filter orders
  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ||
      order.orderStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.stores.some(
        (store) =>
          store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.items.some((item) =>
            item.productName.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
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
                      ? allOrders.length
                      : allOrders.filter(
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
        {currentOrders.length === 0 ? (
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
            {currentOrders.map((order) => (
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
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Order Date</p>
                        <p className="text-sm text-gray-700">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Total Amount
                        </p>
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
                      className={`${
                        storeIndex > 0 ? "mt-4 pt-4 border-t" : ""
                      }`}
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
                              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
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
                          Store Subtotal (incl. delivery ৳{store.deliveryCharge}
                          )
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
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                        <FiEye />
                        View Details
                      </button>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
  );
};

export default MyOrders;