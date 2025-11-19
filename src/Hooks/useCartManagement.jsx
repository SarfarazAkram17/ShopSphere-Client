import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  clearShopCart,
  getShopCart,
  getShopCartRemainingTime,
  isShopCartValid,
  removeShopCartItem,
} from "../lib/localStorage";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export const useCartManagement = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { userEmail } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrderData = async () => {
      const shopCartData = await getShopCart(userEmail);

      if (
        !shopCartData ||
        shopCartData.length === 0 ||
        !isShopCartValid(userEmail)
      ) {
        navigate(-1);
        return;
      }

      try {
        const response = await axiosSecure.post(
          `/cart/checkout-items?email=${userEmail}`,
          { items: shopCartData }
        );

        const checkoutItems = response.data.items || [];
        const validItems = checkoutItems.filter((item) => item.product);

        if (validItems.length === 0) {
          toast.error("No valid products found");
          clearShopCart(userEmail);
          navigate(-1);
          return;
        }

        if (validItems.length < shopCartData.length) {
          toast.warning("Some products are no longer available");
        }

        setCartItems(validItems);
        setRemainingTime(getShopCartRemainingTime(userEmail));
        setIsLoading(false);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load order data"
        );
        navigate(-1);
      }
    };

    loadOrderData();

    const timer = setInterval(() => {
      const remaining = getShopCartRemainingTime(userEmail);

      if (remaining <= 0) {
        clearShopCart(userEmail);
        toast.error("Session expired. Please try again.");
        navigate(-1);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [userEmail, axiosSecure, navigate]);

  const handleRemoveItem = async (item) => {
   Swal.fire({
      title: "Are you sure?",
      text: "This product will be removed from your order.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const removed = removeShopCartItem(
            {
              productId: item.productId,
              color: item.color,
              size: item.size,
            },
            userEmail
          );

          if (!removed) {
            toast.error("Failed to remove item from session");
            return;
          }

          const updatedItems = cartItems.filter(
            (cartItem) =>
              !(
                cartItem.productId === item.productId &&
                cartItem.color === item.color &&
                cartItem.size === item.size
              )
          );

          setCartItems(updatedItems);
          toast.success("Item removed from order");

          if (updatedItems.length === 0) {
            clearShopCart(userEmail);
            toast.info("All items removed. Redirecting...");
            navigate(-1);
          }
        } catch (error) {
          toast.error(error.message || "Failed to remove item");
        }
      }
    });
  };

  return {
    cartItems,
    setCartItems,
    remainingTime,
    isLoading,
    handleRemoveItem,
  };
};