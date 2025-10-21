import { Link, NavLink } from "react-router";
import logo from "/logo.png";
import { RxCross2 } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { RiMenu2Line } from "react-icons/ri";
import useAuth from "../../Hooks/useAuth";
import { FaRegBell } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { FiUser, FiPlusCircle } from "react-icons/fi";
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
import CartIcon from "../Shared/CartIcon";
import useUserRole from "../../Hooks/useUserRole";

const Navbar = () => {
  const { user, userEmail, logOutUser } = useAuth();
  const { roleLoading, role } = useUserRole();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const navLinks = (
    <>
      <NavLink
        onClick={() => setIsOpen(false)}
        className="px-3 py-0.5 text-xs lg:text-sm rounded-full font-bold hover:text-primary hover:bg-primary/10"
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        onClick={() => setIsOpen(false)}
        className="px-3 py-0.5 text-xs lg:text-sm rounded-full font-bold hover:text-primary hover:bg-primary/10"
        to="/about"
      >
        About
      </NavLink>
      <NavLink
        onClick={() => setIsOpen(false)}
        className="px-3 py-0.5 text-xs lg:text-sm rounded-full font-bold hover:text-primary hover:bg-primary/10"
        to="/products"
        end
      >
        Products
      </NavLink>
      <NavLink
        onClick={() => setIsOpen(false)}
        className="px-3 py-0.5 text-xs lg:text-sm rounded-full font-bold hover:text-primary hover:bg-primary/10"
        to="/offers"
      >
        Offers
      </NavLink>
    </>
  );

  // Role-based menu items
  const getMenuItems = () => {
    if (!role) return [];

    const menuItems = {
      customer: [
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
      ],
    };

    return menuItems[role] || [];
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    if (isOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isProfileOpen]);

  const handleLogout = () => {
    logOutUser();
    setIsProfileOpen(false);
  };

  return (
    <div className="backdrop-blur-2xl p-0 shadow-sm">
      <div ref={menuRef} className="navbar px-4 max-w-[1500px] mx-auto">
        <div className="navbar-start">
          <div className="md:hidden mr-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-ghost"
            >
              {isOpen ? <RxCross2 size={20} /> : <RiMenu2Line size={20} />}
            </button>
          </div>

          <Link to="/" className="flex items-center gap-1">
            <img
              src={logo}
              alt="ShopSphere Logo"
              className="h-10 md:h-12 w-auto"
            />
            <span className="text-[#392B12] font-bold md:text-xl whitespace-nowrap">
              ShopSphere
            </span>
          </Link>
        </div>

        <div className="hidden navbar-center md:flex items-center gap-1">
          {navLinks}
        </div>

        <div className="flex navbar-end items-center gap-6 relative">
          <div className="flex gap-6 items-center">
            {/* Desktop Cart Icon */}
            {(!user || (!roleLoading && role === "customer")) && (
              <CartIcon className="hidden sm:block" />
            )}

            {/* Notification Bell */}
            {user && (
              <div className="indicator cursor-pointer">
                <FaRegBell size={23} />
                <span className="text-xs bg-error text-white flex justify-center items-center rounded-full h-4.5 w-4.5 indicator-item">
                  3
                </span>
              </div>
            )}
          </div>

          {/* Auth Section */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <img
                src={user.photoURL}
                alt="Profile"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="rounded-full object-cover w-12 h-12 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
              />

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-b-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.displayName || "User"}
                    </p>
                    <p
                      className="text-xs text-gray-600 truncate"
                      title={userEmail}
                    >
                      {userEmail}
                    </p>
                    {role && (
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 text-xs font-medium bg-primary text-white rounded-full capitalize">
                        {role}
                      </span>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2 max-h-96 overflow-y-auto hide-scrollbar">
                    {getMenuItems().map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <span className="text-gray-600">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Logout Button */}
                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center cursor-pointer gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <MdLogout size={18} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="btn bg-primary text-white border-2 border-primary hover:bg-transparent hover:text-primary">
                  Login
                </button>
              </Link>
              <Link to="/register" className="hidden md:inline -ml-4">
                <button className="btn bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute top-full w-32 left-4 z-10 md:hidden bg-base-100 rounded-b-md p-2 place-items-center shadow">
            <ul className="menu space-y-2 text-center">
              {navLinks}

              {!user && (
                <Link to="/register">
                  <button className="btn bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white">
                    Register
                  </button>
                </Link>
              )}

              {/* Mobile Cart Icon */}
              {(!user || (!roleLoading && role === "customer")) && (
                <div className="sm:hidden mt-4">
                  <CartIcon size={20} />
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
