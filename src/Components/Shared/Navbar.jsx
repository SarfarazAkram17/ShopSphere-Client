import { Link, NavLink } from "react-router";
import logo from "/logo.png";
import { RxCross2 } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { RiMenu2Line } from "react-icons/ri";
import useAuth from "../../Hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();

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
    <div className="bg-base-100 p-0 shadow-sm">
      <div ref={menuRef} className="navbar px-2 max-w-7xl mx-auto">
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
              className="h-8 md:h-10 w-auto"
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
          <div className="absolute top-32 w-32 left-4 z-10 md:hidden bg-base-100 rounded-box p-2 place-items-center shadow">
            <ul className="menu space-y-2 text-center">
              {navLinks}
              {!user && (
                <Link to="/register">
                  <button className="btn bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white">
                    Register
                  </button>
                </Link>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;