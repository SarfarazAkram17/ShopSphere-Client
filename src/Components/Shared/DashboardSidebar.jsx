import { useEffect, useRef } from "react";
import useUserRole from "../../Hooks/useUserRole";
import { FiPlusCircle, FiUser } from "react-icons/fi";
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
// import { TiMessages } from "react-icons/ti";
import { MdLogout, MdStorefront } from "react-icons/md";
// import { AiFillMessage } from "react-icons/ai";
import { Link, NavLink } from "react-router";
import useAuth from "../../Hooks/useAuth";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";

export default function DashboardSidebar({ isOpen, setIsOpen }) {
  const { user, logOutUser } = useAuth();
  const { roleLoading, role } = useUserRole();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [setIsOpen]);

  // ✅ Close sidebar if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 1024
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <TbLayoutDashboard size={20} />,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <FiUser size={20} />,
    },
    ...(!roleLoading && role === "admin"
      ? [
          {
            name: "All Products",
            path: "/dashboard/allProducts",
            icon: <TbPackages size={20} />,
          },
          {
            name: "All Orders",
            path: "/dashboard/allOrders",
            icon: <PiShoppingCartBold size={20} />,
          },
          {
            name: "Payout Requests",
            path: "/dashboard/payoutRequests",
            icon: <GiPayMoney size={20} />,
          },
          {
            name: "All Users",
            path: "/dashboard/allUsers",
            icon: <FaUsers size={20} />,
          },
          {
            name: "Manage Sellers",
            path: "/dashboard/manageSellers",
            icon: <FaUserTie size={20} />,
          },
          {
            name: "Manage Riders",
            path: "/dashboard/manageRiders",
            icon: <FaUsersCog size={20} />,
          },
          {
            name: "Pending Sellers",
            path: "/dashboard/pendingSellers",
            icon: <FaStoreAlt size={20} />,
          },
          {
            name: "Pending Riders",
            path: "/dashboard/pendingRiders",
            icon: <FaUserClock size={20} />,
          },
          {
            name: "Assign Rider",
            path: "/dashboard/assignRider",
            icon: <FaMotorcycle size={20} />,
          },
          {
            name: "Update Order Status",
            path: "/dashboard/updateOrderStatus",
            icon: <LuCodesandbox size={20} />,
          },
          // {
          //   name: "Live Chat",
          //   path: "/dashboard/liveChat",
          //   icon: <TiMessages size={20} />,
          // },
        ]
      : []),
    ...(!roleLoading && role === "customer"
      ? [
          {
            name: "My Orders",
            path: "/dashboard/myOrders",
            icon: <LuCodesandbox size={20} />,
          },
          {
            name: "Become a Seller",
            path: "/dashboard/becomeASeller",
            icon: <MdStorefront size={20} />,
          },
          {
            name: "Become a Rider",
            path: "/dashboard/becomeARider",
            icon: <FaMotorcycle size={20} />,
          },
          // {
          //   name: "Chat",
          //   path: "/dashboard/chat",
          //   icon: <AiFillMessage size={20} />,
          // },
        ]
      : []),
    ...(!roleLoading && role === "seller"
      ? [
          {
            name: "My Store",
            path: "/dashboard/myStore",
            icon: <MdStorefront size={20} />,
          },
          {
            name: "Add Product",
            path: "/dashboard/addProduct",
            icon: <FiPlusCircle size={20} />,
          },
          {
            name: "Manage Products",
            path: "/dashboard/manageProducts",
            icon: <TbPackages size={20} />,
          },
          {
            name: "Orders",
            path: "/dashboard/orders",
            icon: <LuCodesandbox size={20} />,
          },
          {
            name: "Request Payout",
            path: "/dashboard/seller/requestPayout",
            icon: <GiReceiveMoney size={20} />,
          },
          // {
          //   name: "Chat Customer",
          //   path: "/dashboard/chatCustomer",
          //   icon: <TiMessages size={20} />,
          // },
          // {
          //   name: "Chat Support",
          //   path: "/dashboard/chatSupport",
          //   icon: <AiFillMessage size={20} />,
          // },
        ]
      : []),
    ...(!roleLoading && role === "rider"
      ? [
          {
            name: "Pending Deliveries",
            path: "/dashboard/pendingDeliveries",
            icon: <FaTasks size={20} />,
          },
          {
            name: "Completed Deliveries",
            path: "/dashboard/completedDeliveries",
            icon: <FaCheckCircle size={20} />,
          },
          {
            name: "Request Payout",
            path: "/dashboard/rider/requestPayout",
            icon: <GiReceiveMoney size={20} />,
          },
          // {
          //   name: "Chat Support",
          //   path: "/dashboard/chatSupport",
          //   icon: <AiFillMessage size={20} />,
          // },
        ]
      : []),
  ];

  return (
    <section>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full w-60 bg-gray-100 shadow-md z-40
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:flex lg:flex-col
        `}
      >
        {/* Sidebar layout wrapper */}
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 pb-0 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="ShopSphere Logo"
                className="h-8 lg:h-10 w-auto"
              />
              <span className="text-[#392B12] font-bold text-lg">
                ShopSphere
              </span>
            </Link>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">
            {routes.map((route) => (
              <NavLink
                onClick={() => setIsOpen(false)}
                key={route.name}
                to={route.path}
                end
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors duration-200 hover:bg-gray-300"
              >
                {route.icon}
                <span className="font-medium">{route.name}</span>
              </NavLink>
            ))}

            <div
              onClick={() => logOutUser()}
              className="px-4 py-2 rounded-md flex gap-2 mt-3 text-sm font-medium hover:bg-red-500 hover:text-white/85 items-center cursor-pointer"
            >
              <MdLogout size={20} /> Logout
            </div>
          </nav>

          {/* User info */}
          <div className="shrink-0 border-t-[1.5px] border-gray-300 bg-gray-100 py-2 px-4 flex gap-2 items-center">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="h-12 w-12 border-primary border-[1.5px] object-cover rounded-full"
            />
            <div>
              <p className="font-bold text-xs">{user?.displayName}</p>
              <p className="text-xs capitalize">
                {" "}
                {roleLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  role
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}