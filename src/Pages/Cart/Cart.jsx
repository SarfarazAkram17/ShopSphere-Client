import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useCartCount } from "../../Hooks/useCartCount";
import Loader from "../../Components/Loader/Loader";
import CartHeader from "../../Components/Shared/Cart/CartHeader";
import StoreGroup from "../../Components/Shared/Cart/StoreGroup";
import OrderSummary from "../../Components/Shared/Cart/OrderSummary";
import EmptyCart from "../../Components/Shared/Cart/EmptyCart";

const Cart = () => {
  const navigate = useNavigate();
  const { user, userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { refetch: cartCountRefetch } = useCartCount();
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch cart with product details
  const {
    data: cartData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cart", userEmail],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/cart/details?email=${userEmail}`
      );
      return response.data.cart || [];
    },
    enabled: !!user,
  });

  const cart = cartData || [];

  // Group cart items by store
  const groupedByStore = cart.reduce((acc, item) => {
    const storeName = item.product?.storeName || "Unknown Store";
    if (!acc[storeName]) {
      acc[storeName] = [];
    }
    acc[storeName].push(item);
    return acc;
  }, {});

  // Select all items
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cart.map((item, idx) => idx));
    } else {
      setSelectedItems([]);
    }
  };

  // Toggle individual item selection
  const toggleItemSelection = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  // Handle store checkbox change
  const handleStoreCheckboxChange = (items, checked) => {
    if (checked) {
      const storeIndices = items.map((item) => cart.indexOf(item));
      setSelectedItems([...new Set([...selectedItems, ...storeIndices])]);
    } else {
      const storeIndices = items.map((item) => cart.indexOf(item));
      setSelectedItems(
        selectedItems.filter((idx) => !storeIndices.includes(idx))
      );
    }
  };

  // Update quantity
  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axiosSecure.put(`/cart/update?email=${userEmail}`, {
        productId: item.productId,
        quantity: newQuantity,
        color: item.color,
        size: item.size,
      });
      refetch();
      cartCountRefetch();
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete product!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const params = new URLSearchParams();
          if (item.color) params.append("color", item.color);
          if (item.size) params.append("size", item.size);
          params.append("email", userEmail);

          await axiosSecure.delete(
            `/cart/remove/${item.productId}${
              params.toString() ? "?" + params.toString() : ""
            }`
          );

          refetch();
          cartCountRefetch();
          toast.success("Item removed from cart");
        } catch (error) {
          toast.error(error.message || "Failed to remove item");
        }
      }
    });
  };

  // Delete selected items
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      toast.info("Please select item(s) to delete");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "This product(s) will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete product(s)!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const itemsToRemove = selectedItems.map((idx) => cart[idx]);

          await axiosSecure.post(`/cart/remove-items?email=${userEmail}`, {
            itemsToRemove: itemsToRemove.map((item) => ({
              productId: item.productId,
              color: item.color,
              size: item.size,
            })),
          });

          refetch();
          cartCountRefetch();
          toast.success("Selected items removed");
          setSelectedItems([]);
        } catch (error) {
          toast.error(error.message || "Failed to remove items");
        }
      }
    });
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return selectedItems.reduce((total, idx) => {
      const item = cart[idx];
      if (!item?.product) return total;

      const price =
        item.product.discount > 0
          ? item.product.price -
            (item.product.price * item.product.discount) / 100
          : item.product.price;

      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = subtotal > 0 ? 270 : 0;
  const total = subtotal + shippingFee;

  // Calculate total quantity
  const totalQuantity = selectedItems.reduce(
    (total, idx) => total + (cart[idx]?.quantity || 0),
    0
  );

  // Proceed to checkout
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.info("Please select items to checkout");
      return;
    }
    navigate("/placeOrder");
  };

  if (isLoading) return <Loader />;

  if (cart.length === 0) {
    return <EmptyCart onContinueShopping={() => navigate("/products")} />;
  }

  return (
    <section className="bg-gray-100 min-h-screen w-full">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <CartHeader
              cartLength={cart.length}
              selectedLength={selectedItems.length}
              onSelectAll={handleSelectAll}
              onDeleteSelected={handleDeleteSelected}
            />

            {/* Cart Items Grouped by Store */}
            {Object.entries(groupedByStore).map(([storeName, items], i) => (
              <StoreGroup
                key={i}
                storeName={storeName}
                items={items}
                cart={cart}
                selectedItems={selectedItems}
                onStoreCheckboxChange={(e) =>
                  handleStoreCheckboxChange(items, e.target.checked)
                }
                onItemSelection={toggleItemSelection}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <OrderSummary
              selectedCount={selectedItems.length}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              totalQuantity={totalQuantity}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
