import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaShoppingCart,
  // FaHeart,
  FaClock,
  FaCheckCircle,
  FaBox,
  FaTruck,
  // FaStar,
  FaWallet,
} from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { PiTildeBold } from "react-icons/pi";
import { FiXCircle } from "react-icons/fi";

const CustomerDashboard = () => {
  const [spendingYear, setSpendingYear] = useState("2024");

  // Customer stats
  const stats = [
    {
      title: "Total Orders",
      value: "142",
      change: 18.5,
      icon: FaShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Pending",
      value: "3",
      change: -25.0,
      icon: FaClock,
      color: "bg-yellow-500",
    },
    {
      title: "Confirmed",
      value: "12",
      change: 50.0,
      icon: FaCheckCircle,
      color: "bg-blue-500",
    },
    {
      title: "Prepared",
      value: "8",
      change: 14.3,
      icon: FaBox,
      color: "bg-purple-500",
    },
    {
      title: "Shipped",
      value: "4",
      change: 33.3,
      icon: FaTruck,
      color: "bg-cyan-500",
    },
    {
      title: "Delivered",
      value: "112",
      change: 20.4,
      icon: FaCheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Cancelled",
      value: "3",
      change: 0,
      icon: FiXCircle,
      color: "bg-red-500",
    },
    {
      title: "Total Spent",
      value: "$8,456",
      change: 12.3,
      icon: FaWallet,
      color: "bg-green-500",
    },
    {
      title: "Active Orders",
      value: "4",
      change: 33.3,
      icon: FaTruck,
      color: "bg-orange-500",
    },
    {
      title: "Pending Orders",
      value: "3",
      change: 0,
      icon: FaClock,
      color: "bg-yellow-500",
    },
    {
      title: "Completed Orders",
      value: "135",
      change: 15.8,
      icon: FaCheckCircle,
      color: "bg-purple-500",
    },
    {
      title: "Average Order Value",
      value: "$59.55",
      change: -3.2,
      icon: FaWallet,
      color: "bg-pink-500",
    },
  ];

  // Monthly spending data
  const spendingData2024 = [
    { month: "Jan", spending: 620, orders: 8 },
    { month: "Feb", spending: 780, orders: 12 },
    { month: "Mar", spending: 540, orders: 9 },
    { month: "Apr", spending: 890, orders: 15 },
    { month: "May", spending: 720, orders: 11 },
    { month: "Jun", spending: 650, orders: 10 },
    { month: "Jul", spending: 980, orders: 18 },
    { month: "Aug", spending: 750, orders: 13 },
    { month: "Sep", spending: 840, orders: 14 },
    { month: "Oct", spending: 920, orders: 16 },
    { month: "Nov", spending: 680, orders: 11 },
    { month: "Dec", spending: 1086, orders: 19 },
  ];

  const spendingData2023 = [
    { month: "Jan", spending: 480, orders: 6 },
    { month: "Feb", spending: 620, orders: 9 },
    { month: "Mar", spending: 420, orders: 7 },
    { month: "Apr", spending: 680, orders: 11 },
    { month: "May", spending: 560, orders: 8 },
    { month: "Jun", spending: 510, orders: 7 },
    { month: "Jul", spending: 750, orders: 13 },
    { month: "Aug", spending: 590, orders: 9 },
    { month: "Sep", spending: 640, orders: 10 },
    { month: "Oct", spending: 720, orders: 12 },
    { month: "Nov", spending: 530, orders: 8 },
    { month: "Dec", spending: 820, orders: 14 },
  ];

  // Category spending distribution
  const categorySpending = [
    { name: "Electronics", value: 3200, color: "#3b82f6" },
    { name: "Fashion", value: 2100, color: "#ec4899" },
    { name: "Home & Kitchen", value: 1650, color: "#10b981" },
    { name: "Sports", value: 890, color: "#f59e0b" },
    { name: "Books", value: 616, color: "#8b5cf6" },
  ];

  // Recent orders
  // const recentOrders = [
  //   {
  //     id: "ORD-2024-1543",
  //     date: "2024-12-15",
  //     items: 3,
  //     total: 245.99,
  //     status: "Delivered",
  //     statusColor: "bg-green-100 text-green-700",
  //   },
  //   {
  //     id: "ORD-2024-1542",
  //     date: "2024-12-12",
  //     items: 1,
  //     total: 89.99,
  //     status: "In Transit",
  //     statusColor: "bg-blue-100 text-blue-700",
  //   },
  //   {
  //     id: "ORD-2024-1541",
  //     date: "2024-12-10",
  //     items: 2,
  //     total: 156.5,
  //     status: "In Transit",
  //     statusColor: "bg-blue-100 text-blue-700",
  //   },
  //   {
  //     id: "ORD-2024-1540",
  //     date: "2024-12-08",
  //     items: 5,
  //     total: 342.75,
  //     status: "Processing",
  //     statusColor: "bg-yellow-100 text-yellow-700",
  //   },
  //   {
  //     id: "ORD-2024-1539",
  //     date: "2024-12-05",
  //     items: 1,
  //     total: 78.99,
  //     status: "Delivered",
  //     statusColor: "bg-green-100 text-green-700",
  //   },
  // ];

  // Order status breakdown
  const orderStatusData = [
    { status: "Delivered", count: 135, color: "#10b981" },
    { status: "In Transit", count: 14, color: "#3b82f6" },
    { status: "Processing", count: 23, color: "#f59e0b" },
  ];

  const getChangeStyle = (change) => {
    if (change < 0) {
      return {
        bgColor: "bg-red-100/75",
        textColor: "text-red-600",
        icon: FaArrowTrendDown,
      };
    } else if (change > 0) {
      return {
        bgColor: "bg-green-100/80",
        textColor: "text-green-600",
        icon: FaArrowTrendUp,
      };
    } else {
      return {
        bgColor: "bg-blue-100/75",
        textColor: "text-blue-600",
        icon: PiTildeBold,
      };
    }
  };

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    const changeStyle = getChangeStyle(stat.change);
    const ChangeIcon = changeStyle.icon;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`${stat.color} p-3 rounded-lg`}>
            <Icon className="text-white text-2xl" />
          </div>
          <div
            className={`${changeStyle.bgColor} ${changeStyle.textColor} px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold`}
          >
            <ChangeIcon size={17} />
            {Math.abs(stat.change)}%
          </div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          My Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, Sarah! Here's your shopping overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Spending */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Monthly Spending
            </h2>
            <select
              value={spendingYear}
              onChange={(e) => setSpendingYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={
                spendingYear === "2024" ? spendingData2024 : spendingData2023
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Spending ($)"
                dot={{ fill: "#3b82f6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Spending */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Spending by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categorySpending}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categorySpending.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Order Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Orders">
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Monthly Order Count
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={
                spendingYear === "2024" ? spendingData2024 : spendingData2023
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8b5cf6" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Wishlist Section - COMMENTED OUT */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> */}
      {/* Recent Orders */}
      {/* <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{order.items} items</span>
                  <span className="font-bold text-gray-800">
                    ${order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> */}

      {/* Order Status Tracking */}
      {/* <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Order Status</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {orderStatusCounts.map((status, index) => (
              <div
                key={index}
                className={`${status.bgColor} rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer`}
              >
                <p className={`text-3xl font-bold ${status.textColor} mb-1`}>
                  {status.count}
                </p>
                <p className={`text-sm font-medium ${status.textColor}`}>
                  {status.label}
                </p>
              </div>
            ))}
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default CustomerDashboard;