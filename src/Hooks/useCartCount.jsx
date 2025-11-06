import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import useUserRole from "./useUserRole";

export const useCartCount = () => {
  const { user, userEmail } = useAuth();
  const { role, roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const {
    data: cart,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cartCount", userEmail],
    queryFn: async () => {
      const response = await axiosSecure.get(`/cart?email=${userEmail}`);
      return response.data.cart || [];
    },

    enabled: !roleLoading && role === "customer" && !!user && !!userEmail,
    refetchInterval: 10000, // Auto-refetch every 10 seconds
    staleTime: 5000,
  });

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  return {
    cartCount: cartCount || 0,
    cartData: cart,
    isLoading,
    refetch,
  };
};