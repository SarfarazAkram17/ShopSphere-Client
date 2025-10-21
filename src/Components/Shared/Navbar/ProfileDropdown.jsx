import { Link } from "react-router";
import { MdLogout } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import useUserRole from "../../../Hooks/useUserRole";
import { getMenuItemsByRole } from "../../../lib/roleMenuItems";

const ProfileDropdown = ({ profileRef, isProfileOpen, setIsProfileOpen }) => {
  const { user, userEmail, logOutUser } = useAuth();
  const { role } = useUserRole();

  const menuItems = getMenuItemsByRole(role);

  const handleLogout = () => {
    logOutUser();
    setIsProfileOpen(false);
  };

  return (
    <div className="relative" ref={profileRef}>
      <img
        src={user.photoURL}
        alt="Profile"
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="rounded-full object-cover w-12 h-12 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
      />

      {/* Dropdown Menu */}
      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-b-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {user.displayName || "User"}
            </p>
            <p className="text-xs text-gray-600 truncate" title={userEmail}>
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
            {menuItems.map((item, index) => (
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
  );
};

export default ProfileDropdown;