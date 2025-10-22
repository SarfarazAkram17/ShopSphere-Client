import { Link } from "react-router";
import { PiShoppingCartBold } from "react-icons/pi";
import useAuth from "../../../Hooks/useAuth";
import { useCartCount } from "../../../Hooks/useCartCount";

const CartIcon = ({ size = 23, className = "" }) => {
  const { user } = useAuth();
  const { cartCount } = useCartCount();

  return (
    <Link to="/cart" className={`indicator cursor-pointer ${className}`}>
      <PiShoppingCartBold size={size} />
      {user && cartCount > 0 && (
        <span className="text-xs bg-error text-white flex justify-center items-center rounded-full h-4.5 w-4.5 indicator-item font-semibold">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;