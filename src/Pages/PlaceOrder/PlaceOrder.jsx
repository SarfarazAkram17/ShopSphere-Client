import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  getShopCart,
  clearShopCart,
  getShopCartRemainingTime,
  isShopCartValid,
} from "../../lib/localStorage";
// import useAuth from "../../Hooks/useAuth";
// import useUserRole from "../../Hooks/useUserRole";

const PlaceOrder = () => {
  // const {user} = useAuth()
  // const {roleLoading, role} = useUserRole()
  const navigate = useNavigate();
  const [shopCartItems, setShopCartItems] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if shop cart is valid
    const items = getShopCart();

    if (!items || items.length === 0 || !isShopCartValid()) {
      toast.error("No items found or session expired!");
      clearShopCart();
      navigate(-1);
      return;
    }

    setShopCartItems(items);
    setRemainingTime(getShopCartRemainingTime());
    setIsLoading(false);

    // Set up timer to update remaining time every second
    const timer = setInterval(() => {
      const remaining = getShopCartRemainingTime();

      if (remaining <= 0) {
        clearShopCart();
        toast.error("Session expired! Please try again.");
        navigate(-1);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [navigate]);

  // Handle back button / browser navigation
  useEffect(() => {
    let shouldClearOnUnmount = true;

    const handlePopState = () => {
      // User clicked back button
      clearShopCart();
      shouldClearOnUnmount = false; // Prevent double clearing
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      // Only clear if user navigated away WITHOUT placing order or canceling
      // Don't clear if they used cancel button or completed order (those handle clearing themselves)
      if (shouldClearOnUnmount && shopCartItems.length > 0) {
        clearShopCart();
      }
    };
  }, [shopCartItems]);

  // Format remaining time (mm:ss)
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // if (!roleLoading && role !== "customer") {
  //   toast.info("You are not allowded to add product on cart");
  //   return;
  // }

  if (isLoading) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4 text-gray-600">Loading your order...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-8">
      {/* Session Timer Warning */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-4xl">⏱️</span>
          <div>
            <p className="text-yellow-800 font-semibold">
              Session expires in: {formatTime(remainingTime)}
            </p>
            <p className="text-yellow-700 text-sm">
              Complete your order within the time limit
            </p>
          </div>
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Debug Info:</p>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(shopCartItems, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default PlaceOrder;
