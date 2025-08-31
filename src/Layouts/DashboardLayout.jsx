import { Link, NavLink, Outlet } from "react-router";
import logo from "/logo.png";
import useAuth from "../Hooks/useAuth";
import { TbLayoutDashboard } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import useUserRole from "../Hooks/useUserRole";

const DashboardLayout = () => {
  const { user } = useAuth();
  const { roleLoading, role } = useUserRole();

  // ✅ Function to close drawer on small devices
  const handleLinkClick = () => {
    const drawerCheckbox = document.getElementById("my-drawer-2");
    if (drawerCheckbox && window.innerWidth < 1024) {
      drawerCheckbox.checked = false;
      drawerCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
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
          <div className="mt-12 mb-16">
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
              className="flex items-center gap-1 mb-4"
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
              <NavLink
                className="rounded-md"
                to="/dashboard"
                end
                onClick={handleLinkClick}
              >
                <TbLayoutDashboard size={19} /> Dashboard
              </NavLink>
            </li>
            <li className="my-1 font-semibold">
              <NavLink
                className="rounded-md"
                to="/dashboard/manageProfile"
                onClick={handleLinkClick}
              >
                <FiUser size={17} /> Manage Profile
              </NavLink>
            </li>
          </ul>

          <div className="flex absolute border-t border-gray-200 bottom-0 bg-base-200 py-2 px-4 w-56 lg:w-60 gap-2 items-center">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="h-12 w-12 border-primary border-[1.5px] object-cover rounded-full"
            />
            <div>
              <p className="font-bold text-xs">{user?.displayName}</p>
              <p className="text-xs">
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