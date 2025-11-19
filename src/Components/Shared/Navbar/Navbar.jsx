import { Link } from "react-router";
import logo from "/logo.png";
import { RxCross2 } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { RiMenu2Line } from "react-icons/ri";
import useAuth from "../../../Hooks/useAuth";
// import { FaRegBell } from "react-icons/fa6";
import CartIcon from "../Cart/CartIcon";
import NavLinks from "./NavLinks";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";
import useUserRole from "../../../Hooks/useUserRole";

const Navbar = () => {
  const { user } = useAuth();
  const { roleLoading, role } = useUserRole();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // Close menus when clicking outside
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

  return (
    <div className="bg-base-200 p-0 shadow-sm">
      <div ref={menuRef} className="navbar px-4 max-w-[1500px] mx-auto">
        {/* Logo Section */}
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

        {/* Desktop Navigation Links */}
        <div className="hidden navbar-center md:flex items-center gap-1">
          <NavLinks onLinkClick={() => setIsOpen(false)} />
        </div>

        {/* Right Section */}
        <div className="flex navbar-end items-center gap-6 relative">
          <div className="flex gap-6 items-center">
            {/* Cart Icon */}
            {(!user || (!roleLoading && role === "customer")) && (
              <CartIcon className="hidden sm:block" />
            )}

            {/* Notification Bell */}
            {/* {user && (
              <div className="indicator cursor-pointer">
                <FaRegBell size={23} />
                <span className="text-xs bg-error text-white flex justify-center items-center rounded-full h-4.5 w-4.5 indicator-item">
                  3
                </span>
              </div>
            )} */}
          </div>

          {/* Profile Dropdown or Auth Buttons */}
          {user ? (
            <ProfileDropdown
              profileRef={profileRef}
              isProfileOpen={isProfileOpen}
              setIsProfileOpen={setIsProfileOpen}
            />
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

        {/* Mobile Menu */}
        {isOpen && (
          <MobileMenu
            user={user}
            role={role}
            roleLoading={roleLoading}
            onLinkClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
