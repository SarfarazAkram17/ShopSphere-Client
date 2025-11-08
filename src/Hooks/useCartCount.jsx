import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import useUserRole from "./useUserRole";

export const useCartCount = () => {
  const { user, userEmail } = useAuth();
  const { role, roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const {
    data = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cartCount", userEmail],
    queryFn: async () => {
      const response = await axiosSecure.get(`/cart?email=${userEmail}`);
      const cart = response.data.cart || [];
      const cartCount = cart.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      return { cart, cartCount };
    },

    enabled: !roleLoading && role === "customer" && !!user && !!userEmail,
    refetchInterval: 10000, // Auto-refetch every 10 seconds
    staleTime: 5000,
  });

  const cart = data.cart || [];
  const cartCount = data.cartCount || 0;

  return {
    cartCount: cartCount,
    cartData: cart,
    isLoading,
    refetch,
  };
};