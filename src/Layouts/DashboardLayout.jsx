import { Link, NavLink, Outlet } from "react-router";
import logo from "/logo.png";
import useAuth from "../Hooks/useAuth";
import { TbLayoutDashboard, TbPackages } from "react-icons/tb";
import { FiPlusCircle, FiUser } from "react-icons/fi";
import { MdLogout, MdStorefront } from "react-icons/md";
import useUserRole from "../Hooks/useUserRole";
import { toast } from "react-toastify";
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
import { AiFillMessage } from "react-icons/ai";
import { TiMessages } from "react-icons/ti";

const SidebarItem = ({ to, onClick, children }) => {
  if (to) {
    return (
      <NavLink
        to={to}
        end
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-md px-2 py-2 transition-colors w-full text-left ${
            isActive
              ? "bg-primary/20 text-primary font-bold"
              : "hover:bg-base-300"
          }`
        }
      >
        {children}
      </NavLink>
    );
  }
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-base-300 transition-colors w-full text-left"
    >
      {children}
    </button>
  );
};

const DashboardLayout = () => {
  const { user, logOutUser } = useAuth();
  const { roleLoading, role } = useUserRole();

  const handleLinkClick = () => {
    const drawerCheckbox = document.getElementById("my-drawer-2");
    if (drawerCheckbox && window.innerWidth < 1024) {
      drawerCheckbox.checked = false;
      drawerCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const handleLogout = () => {
    logOutUser()
      .then(() => {
        toast.warn("You Logout from ShopSphere");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="max-w-[1500px] mx-auto">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        {/* Main Content Area */}
        <div className="drawer-content flex flex-col overflow-y-auto">
          {/* Mobile Navbar */}
          <div className="navbar bg-base-300 w-full lg:hidden">
            <div className="flex-none">
              <label
                htmlFor="my-drawer-2"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1 mx-2"
              onClick={handleLinkClick}
            >
              <img
                src={logo}
                alt="ShopSphere Logo"
                className="h-8 lg:h-10 w-auto"
              />
              <span className="text-[#392B12] font-bold text-lg">
                ShopSphere
              </span>
            </Link>
          </div>

          {/* Page Content */}
          <div className="pt-12 pb-16">
            <Outlet />
          </div>
        </div>

        {/* Sidebar */}
        <div className="drawer-side z-30 lg:fixed lg:top-0 lg:left-0 lg:h-screen">
          <label
            htmlFor="my-drawer-2"
            className="drawer-overlay lg:hidden"
          ></label>

          {/* ✅ Keep sidebar scrollable and single-column */}
          <ul className="menu bg-base-200 text-base-content pb-20 w-56 lg:w-60 p-4 h-full overflow-y-auto flex flex-col flex-nowrap hide-scrollbar">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-1 mb-2"
              onClick={handleLinkClick}
            >
              <img
                src={logo}
                alt="ShopSphere Logo"
                className="h-8 lg:h-10 w-auto"
              />
              <span className="text-[#392B12] font-bold text-lg">
                ShopSphere
              </span>
            </Link>

            {/* Navigation Links */}
            <li className="my-1 font-semibold">
              <SidebarItem to="/dashboard" onClick={handleLinkClick}>
                <TbLayoutDashboard size={20} /> Dashboard
              </SidebarItem>
            </li>
            <li className="my-1 font-semibold">
              <SidebarItem
                to="/dashboard/manageProfile"
                onClick={handleLinkClick}
              >
                <FiUser size={20} /> Manage Profile
              </SidebarItem>
            </li>
            {!roleLoading && role === "admin" && (
              <>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/allProducts"
                    onClick={handleLinkClick}
                  >
                    <TbPackages size={20} /> All Products
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/allUsers"
                    onClick={handleLinkClick}
                  >
                    <FaUsers size={20} /> All Users
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/manageSellers"
                    onClick={handleLinkClick}
                  >
                    <FaUserTie size={20} /> Manage Sellers
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/manageRiders"
                    onClick={handleLinkClick}
                  >
                    <FaUsersCog size={20} /> Manage Riders
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/pendingSellers"
                    onClick={handleLinkClick}
                  >
                    <FaStoreAlt size={20} /> Pending Sellers
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/pendingRiders"
                    onClick={handleLinkClick}
                  >
                    <FaUserClock size={20} /> Pending Riders
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/assignRider"
                    onClick={handleLinkClick}
                  >
                    <FaMotorcycle size={20} /> Assign Rider
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/updateOrderStatus"
                    onClick={handleLinkClick}
                  >
                    <LuCodesandbox size={20} /> Update Order Status
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/liveChat"
                    onClick={handleLinkClick}
                  >
                    <TiMessages size={20} /> Live Chat
                  </SidebarItem>
                </li>
              </>
            )}
            {!roleLoading && role === "customer" && (
              <>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/myOrders"
                    onClick={handleLinkClick}
                  >
                    <LuCodesandbox size={20} /> My Orders
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/becomeASeller"
                    onClick={handleLinkClick}
                  >
                    <MdStorefront size={20} /> Become a Seller
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/becomeARider"
                    onClick={handleLinkClick}
                  >
                    <FaMotorcycle size={20} /> Become a Rider
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem to="/dashboard/chat" onClick={handleLinkClick}>
                    <AiFillMessage size={20} /> Chat
                  </SidebarItem>
                </li>
              </>
            )}
            {!roleLoading && role === "seller" && (
              <>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/myStore"
                    onClick={handleLinkClick}
                  >
                    <MdStorefront size={20} /> My Store
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/addProduct"
                    onClick={handleLinkClick}
                  >
                    <FiPlusCircle size={20} /> Add Product
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/manageProducts"
                    onClick={handleLinkClick}
                  >
                    <TbPackages size={20} /> Manage Products
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem to="/dashboard/orders" onClick={handleLinkClick}>
                    <LuCodesandbox size={20} /> Orders
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/chatCustomer"
                    onClick={handleLinkClick}
                  >
                    <TiMessages size={20} /> Chat Customer
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/chatSupport"
                    onClick={handleLinkClick}
                  >
                    <AiFillMessage size={20} /> Chat Support
                  </SidebarItem>
                </li>
              </>
            )}
            {!roleLoading && role === "rider" && (
              <>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/pendingDeliveries"
                    onClick={handleLinkClick}
                  >
                    <FaTasks size={20} /> Pending Deliveries
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/completedDeliveries"
                    onClick={handleLinkClick}
                  >
                    <FaCheckCircle size={20} /> Completed Deliveries
                  </SidebarItem>
                </li>
                <li className="my-1 font-semibold rounded-md">
                  <SidebarItem
                    to="/dashboard/chatSupport"
                    onClick={handleLinkClick}
                  >
                    <AiFillMessage size={20} /> Chat Support
                  </SidebarItem>
                </li>
              </>
            )}

            <li className="my-1 font-semibold rounded-md">
              <SidebarItem onClick={handleLogout}>
                <MdLogout size={20} /> Logout
              </SidebarItem>
            </li>
          </ul>

          <div className="flex absolute border-t-[1.5px] border-gray-300 bottom-0 bg-base-200 py-2 px-4 w-56 lg:w-60 gap-2 items-center">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="h-12 w-12 border-primary border-[1.5px] object-cover rounded-full"
            />
            <div>
              <p className="font-bold text-xs">{user?.displayName}</p>
              <p className="text-xs capitalize">
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
    </div>
  );
};

export default DashboardLayout;
