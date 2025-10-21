import { Link, NavLink } from "react-router";
import logo from "/logo.png";
import { RxCross2 } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { RiMenu2Line } from "react-icons/ri";
import useAuth from "../../Hooks/useAuth";
import { FaRegBell } from "react-icons/fa6";
import CartIcon from "../Shared/CartIcon";
import useUserRole from "../../Hooks/useUserRole";

const Navbar = () => {
  const { user } = useAuth();
  const { roleLoading, role } = useUserRole();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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

  // 🔹 Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
            <div>
              <Link to="/dashboard">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="rounded-full object-cover w-12 mr-2 h-12 cursor-pointer"
                />
              </Link>
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
