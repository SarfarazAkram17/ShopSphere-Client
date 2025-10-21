import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  getShopCart,
  clearShopCart,
  getShopCartRemainingTime,
  isShopCartValid,
} from "../../lib/localStorage";
import useAuth from "../../Hooks/useAuth";
// import useAxios from "../../Hooks/useAxios";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { user, userEmail } = useAuth();
  // const axiosInstance = useAxios();
  const [shopCartItems, setShopCartItems] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    const items = getShopCart(userEmail);

    if (!items || items.length === 0 || !isShopCartValid(userEmail)) {
      toast.error("No items found or session expired!");
      clearShopCart(userEmail);
      navigate(-1);
      return;
    }

    setShopCartItems(items);
    setRemainingTime(getShopCartRemainingTime(userEmail));
    setIsLoading(false);

    const timer = setInterval(() => {
      const remaining = getShopCartRemainingTime(userEmail);

      if (remaining <= 0) {
        clearShopCart(userEmail);
        toast.error("Session expired! Please try again.");
        navigate(-1);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, user, userEmail]);

  useEffect(() => {
    if (!user) return;

    const userEmail = user.email;
    let shouldClearOnUnmount = true;

    const handlePopState = () => {
      clearShopCart(userEmail);
      shouldClearOnUnmount = false;
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      
      if (shouldClearOnUnmount && shopCartItems.length > 0) {
        clearShopCart(userEmail);
      }
    };
  }, [shopCartItems, user]);

  // const handlePlaceOrder = async () => {
  //   if (!user) return;

  //   try {
  //     setIsLoading(true);
  //     const userEmail = user.email;

  //     // Place order API call
  //     const response = await axiosInstance.post("/orders", {
  //       items: shopCartItems,
  //       // other order details like address, payment method, etc.
  //     });

  //     if (response.data.success) {
  //       // After successful order, remove items from cart (if they came from cart)
  //       // Since this is "Buy Now", we just clear the shop cart
  //       clearShopCart(userEmail);
        
  //       toast.success("Order placed successfully!");
  //       navigate("/order-confirmation");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to place order. Please try again.");
  //     console.error(error);
  //     setIsLoading(false);
  //   }
  // };

  // const handleCancel = () => {
  //   if (!user) return;
    
  //   const userEmail = user.email;
  //   clearShopCart(userEmail);
  //   toast.info("Order cancelled");
  //   navigate(-1);
  // };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-[1500px] mx-auto px-4">
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
      {/* Session Timer */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏱️</span>
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
