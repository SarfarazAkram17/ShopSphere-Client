import { Link } from "react-router";
import NavLinks from "./NavLinks";
import CartIcon from "../CartIcon";

const MobileMenu = ({ user, role, roleLoading, onLinkClick }) => {
  return (
    <div className="absolute top-full w-32 left-4 z-10 md:hidden bg-base-100 rounded-b-md p-2 place-items-center shadow">
      <ul className="menu space-y-2 text-center">
        <NavLinks onLinkClick={onLinkClick} />

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
  );
};

export default MobileMenu;