import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaStore,
  FaBiking,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [revenueYear, setRevenueYear] = useState("2024");
  const [payoutYear, setPayoutYear] = useState("2024");

  // Stats data with growth rates
  const stats = [
    {
      title: "Total Earnings",
      value: "$2,847,563",
      change: 12.5,
      icon: FaDollarSign,
      color: "bg-purple-500",
    },
    {
      title: "Total Revenue",
      value: "$3,245,890",
      change: 15.3,
      icon: FaDollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Seller Payouts",
      value: "$1,892,450",
      change: -2.1,
      icon: FaDollarSign,
      color: "bg-green-500",
    },
    {
      title: "Rider Payouts",
      value: "$245,680",
      change: 8.7,
      icon: FaDollarSign,
      color: "bg-yellow-500",
    },
    {
      title: "Total Sellers",
      value: "1,247",
      change: 5.2,
      icon: FaStore,
      color: "bg-indigo-500",
    },
    {
      title: "Total Riders",
      value: "3,854",
      change: 0.5,
      icon: FaBiking,
      color: "bg-orange-500",
    },
    {
      title: "Total Customers",
      value: "45,892",
      change: 18.4,
      icon: FaUsers,
      color: "bg-pink-500",
    },
    {
      title: "Total Orders",
      value: "28,456",
      change: 10.8,
      icon: FaShoppingCart,
      color: "bg-teal-500",
    },
    {
      title: "Products Listed",
      value: "12,847",
      change: -0.8,
      icon: FaBox,
      color: "bg-red-500",
    },
  ];

  // Monthly revenue data
  const revenueData2024 = [
    { month: "Jan", revenue: 245000, orders: 2340 },
    { month: "Feb", revenue: 268000, orders: 2580 },
    { month: "Mar", revenue: 290000, orders: 2820 },
    { month: "Apr", revenue: 312000, orders: 3050 },
    { month: "May", revenue: 285000, orders: 2750 },
    { month: "Jun", revenue: 298000, orders: 2890 },
    { month: "Jul", revenue: 335000, orders: 3210 },
    { month: "Aug", revenue: 318000, orders: 3080 },
    { month: "Sep", revenue: 342000, orders: 3340 },
    { month: "Oct", revenue: 365000, orders: 3580 },
    { month: "Nov", revenue: 298000, orders: 2920 },
    { month: "Dec", revenue: 289000, orders: 2886 },
  ];

  const revenueData2023 = [
    { month: "Jan", revenue: 198000, orders: 1980 },
    { month: "Feb", revenue: 215000, orders: 2150 },
    { month: "Mar", revenue: 232000, orders: 2320 },
    { month: "Apr", revenue: 248000, orders: 2480 },
    { month: "May", revenue: 225000, orders: 2250 },
    { month: "Jun", revenue: 238000, orders: 2380 },
    { month: "Jul", revenue: 268000, orders: 2680 },
    { month: "Aug", revenue: 252000, orders: 2520 },
    { month: "Sep", revenue: 272000, orders: 2720 },
    { month: "Oct", revenue: 295000, orders: 2950 },
    { month: "Nov", revenue: 238000, orders: 2380 },
    { month: "Dec", revenue: 230000, orders: 2300 },
  ];

  // Payout data
  const payoutData2024 = [
    { month: "Jan", sellers: 145000, riders: 18500 },
    { month: "Feb", sellers: 158000, riders: 20200 },
    { month: "Mar", sellers: 172000, riders: 21800 },
    { month: "Apr", sellers: 185000, riders: 23400 },
    { month: "May", sellers: 168000, riders: 21500 },
    { month: "Jun", sellers: 176000, riders: 22300 },
    { month: "Jul", sellers: 198000, riders: 25100 },
    { month: "Aug", sellers: 188000, riders: 23800 },
    { month: "Sep", sellers: 202000, riders: 25600 },
    { month: "Oct", sellers: 216000, riders: 27400 },
    { month: "Nov", riders: 22100, sellers: 176000 },
    { month: "Dec", riders: 21500, sellers: 171000 },
  ];

  const payoutData2023 = [
    { month: "Jan", sellers: 118000, riders: 15200 },
    { month: "Feb", sellers: 128000, riders: 16400 },
    { month: "Mar", sellers: 139000, riders: 17800 },
    { month: "Apr", sellers: 149000, riders: 19100 },
    { month: "May", sellers: 135000, riders: 17300 },
    { month: "Jun", sellers: 142000, riders: 18200 },
    { month: "Jul", sellers: 160000, riders: 20500 },
    { month: "Aug", sellers: 151000, riders: 19400 },
    { month: "Sep", sellers: 163000, riders: 20900 },
    { month: "Oct", sellers: 174000, riders: 22300 },
    { month: "Nov", sellers: 142000, riders: 18200 },
    { month: "Dec", sellers: 138000, riders: 17700 },
  ];

  // User distribution
  const userDistribution = [
    { name: "Customers", value: 45892, color: "#8b5cf6" },
    { name: "Sellers", value: 1247, color: "#3b82f6" },
    { name: "Riders", value: 3854, color: "#10b981" },
  ];

  // Top products
  const topProducts = [
    { name: "Wireless Earbuds Pro", sales: 3542, revenue: 354200 },
    { name: "Smart Watch Series 5", sales: 2845, revenue: 568900 },
    { name: "Laptop Stand Aluminum", sales: 2634, revenue: 131700 },
    { name: "USB-C Hub 7-in-1", sales: 2398, revenue: 119900 },
    { name: "Mechanical Keyboard RGB", sales: 2156, revenue: 258720 },
  ];

  // Top sellers
  const topSellers = [
    { name: "TechZone Electronics", sales: 15420, revenue: 1542000 },
    { name: "Fashion Hub Store", sales: 12350, revenue: 987600 },
    { name: "Home Essentials Co", sales: 10280, revenue: 823400 },
    { name: "Sports & Fitness Plus", sales: 8945, revenue: 715600 },
    { name: "Beauty Paradise", sales: 7823, revenue: 625840 },
  ];

  // Top customers
  const topCustomers = [
    { name: "John Smith", orders: 248, spent: 45680 },
    { name: "Sarah Johnson", orders: 195, spent: 38920 },
    { name: "Michael Brown", orders: 167, spent: 35440 },
    { name: "Emily Davis", orders: 142, spent: 31250 },
    { name: "David Wilson", orders: 128, spent: 28760 },
  ];

  const getChangeStyle = (change) => {
    if (change <= -1) {
      return {
        bgColor: "bg-red-50",
        textColor: "text-red-600",
        icon: FaArrowDown,
      };
    } else if (change >= 1) {
      return {
        bgColor: "bg-green-50",
        textColor: "text-green-600",
        icon: FaArrowUp,
      };
    } else {
      return {
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        icon: FaMinus,
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
            <ChangeIcon className="text-xs" />
            {Math.abs(stat.change)}%
          </div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
      </div>
    );
  };

  return (
    <div className="px-4 pt-12 pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          ShopSphere Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Monthly Revenue & Orders
            </h2>
            <select
              value={revenueYear}
              onChange={(e) => setRevenueYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={revenueYear === "2024" ? revenueData2024 : revenueData2023}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            User Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Payouts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Monthly Payouts</h2>
            <select
              value={payoutYear}
              onChange={(e) => setPayoutYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={payoutYear === "2024" ? payoutData2024 : payoutData2023}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sellers"
                stroke="#10b981"
                strokeWidth={2}
                name="Seller Payouts ($)"
              />
              <Line
                type="monotone"
                dataKey="riders"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Rider Payouts ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Top Selling Products
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8b5cf6" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Top Sellers by Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Top Customers by Spending
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCustomers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="spent" fill="#ec4899" name="Amount Spent ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;