import { FiUser, FiPlusCircle, FiLock } from "react-icons/fi";
import { TbLayoutDashboard, TbPackages } from "react-icons/tb";
import { PiShoppingCartBold } from "react-icons/pi";
import {
  FaCheckCircle,
  FaMotorcycle,
  FaStoreAlt,
  FaTasks,
  FaUserClock,
  FaUsers,
  FaUsersCog,
  FaUserTie,
} from "react-icons/fa";
import { LuCodesandbox } from "react-icons/lu";
import { MdStorefront } from "react-icons/md";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { FaAddressBook } from "react-icons/fa6";

export const getMenuItemsByRole = (role, provider) => {
  const roleMenuItems = {
    customer: [
      {
        icon: <TbLayoutDashboard size={18} />,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: <FaAddressBook size={18} />,
        label: "Address Book",
        path: "/dashboard/addressBook",
      },
      {
        icon: <FiUser size={16} />,
        label: "Profile",
        path: "/dashboard/profile",
      },
      {
        icon: <LuCodesandbox size={18} />,
        label: "My Orders",
        path: "/dashboard/myOrders",
      },
      {
        icon: <MdStorefront size={18} />,
        label: "Become a Seller",
        path: "/dashboard/becomeASeller",
      },
      {
        icon: <FaMotorcycle size={18} />,
        label: "Become a Rider",
        path: "/dashboard/becomeARider",
      },
      provider === "password" && {
        icon: <FiLock size={20} />,
        label: "Change Password",
        path: "/dashboard/changePassword",
      },
    ],
    admin: [
      {
        icon: <TbLayoutDashboard size={18} />,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: <FiUser size={16} />,
        label: "Profile",
        path: "/dashboard/profile",
      },
      {
        icon: <TbPackages size={18} />,
        label: "All Products",
        path: "/dashboard/allProducts",
      },
      {
        icon: <PiShoppingCartBold size={18} />,
        label: "All Orders",
        path: "/dashboard/allOrders",
      },
      {
        icon: <GiPayMoney size={18} />,
        label: "Payout Requests",
        path: "/dashboard/payoutRequests",
      },
      {
        icon: <FaUsers size={18} />,
        label: "All Users",
        path: "/dashboard/allUsers",
      },
      {
        icon: <FaUserTie size={18} />,
        label: "Manage Sellers",
        path: "/dashboard/manageSellers",
      },
      {
        icon: <FaUsersCog size={18} />,
        label: "Manage Riders",
        path: "/dashboard/manageRiders",
      },
      {
        icon: <FaStoreAlt size={18} />,
        label: "Pending Sellers",
        path: "/dashboard/pendingSellers",
      },
      {
        icon: <FaUserClock size={18} />,
        label: "Pending Riders",
        path: "/dashboard/pendingRiders",
      },
      {
        icon: <FaMotorcycle size={18} />,
        label: "Assign Rider",
        path: "/dashboard/assignRider",
      },
      {
        icon: <LuCodesandbox size={18} />,
        label: "Update Order Status",
        path: "/dashboard/updateOrderStatus",
      },
      provider === "password" && {
        icon: <FiLock size={20} />,
        label: "Change Password",
        path: "/dashboard/changePassword",
      },
    ],
    seller: [
      {
        icon: <TbLayoutDashboard size={18} />,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: <FiUser size={16} />,
        label: "Profile",
        path: "/dashboard/profile",
      },
      {
        icon: <MdStorefront size={18} />,
        label: "My Store",
        path: "/dashboard/myStore",
      },
      {
        icon: <FiPlusCircle size={18} />,
        label: "Add Product",
        path: "/dashboard/addProduct",
      },
      {
        icon: <TbPackages size={18} />,
        label: "Manage Products",
        path: "/dashboard/manageProducts",
      },
      {
        icon: <LuCodesandbox size={18} />,
        label: "Orders",
        path: "/dashboard/orders",
      },
      {
        icon: <GiReceiveMoney size={18} />,
        label: "Request Payout",
        path: "/dashboard/seller/requestPayout",
      },
      provider === "password" && {
        icon: <FiLock size={20} />,
        label: "Change Password",
        path: "/dashboard/changePassword",
      },
    ],
    rider: [
      {
        icon: <TbLayoutDashboard size={18} />,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: <FiUser size={16} />,
        label: "Profile",
        path: "/dashboard/profile",
      },
      {
        icon: <FaTasks size={18} />,
        label: "Pending Deliveries",
        path: "/dashboard/pendingDeliveries",
      },
      {
        icon: <FaCheckCircle size={18} />,
        label: "Completed Deliveries",
        path: "/dashboard/completedDeliveries",
      },
      {
        icon: <GiReceiveMoney size={18} />,
        label: "Request Payout",
        path: "/dashboard/rider/requestPayout",
      },
      provider === "password" && {
        icon: <FiLock size={20} />,
        label: "Change Password",
        path: "/dashboard/changePassword",
      },
    ],
  };

  return (roleMenuItems[role] || []).filter(Boolean);
};