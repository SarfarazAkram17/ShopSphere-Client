import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiTrash2, FiMinus, FiPlus, FiHeart } from "react-icons/fi";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loader from "../../Components/Loader/Loader";
import { BsShop } from "react-icons/bs";
import { useCartCount } from "../../Hooks/useCartCount";

const Cart = () => {
  const navigate = useNavigate();
  const { user, userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedItems, setSelectedItems] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const { refetch: cartCountRefetch } = useCartCount();

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
      toast.error("Failed to update quantity");
      console.error(error);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (item) => {
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
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
      console.error(error);
    }
  };

  // Delete selected items
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      toast.info("Please select items to delete");
      return;
    }

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
      toast.success("Selected items removed");
      setSelectedItems([]);
    } catch (error) {
      toast.error("Failed to remove items");
      console.error(error);
    }
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

  // Apply voucher
  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      toast.info("Please enter a voucher code");
      return;
    }
    toast.info("Voucher feature coming soon!");
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.info("Please select items to checkout");
      return;
    }
    navigate("/placeOrder");
  };

  if (isLoading) return <Loader></Loader>;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <button
          onClick={() => navigate("/products")}
          className="btn btn-error text-white"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 h-full w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Header */}
            <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-between shadow-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox rounded-[2px] checkbox-primary"
                  checked={selectedItems.length === cart.length}
                  onChange={handleSelectAll}
                />
                <span className="font-medium">
                  SELECT ALL ({cart.length}{" "}
                  {cart.length === 1 ? "ITEM" : "ITEMS"})
                </span>
              </label>
              <button
                onClick={handleDeleteSelected}
                className="text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-2 font-medium"
              >
                <FiTrash2 size={18} />
                DELETE
              </button>
            </div>

            {/* Cart Items Grouped by Store */}
            {Object.entries(groupedByStore).map(([storeName, items], i) => (
              <div key={i} className="bg-white rounded-lg p-4 mb-4 shadow-xl">
                {/* Store Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <input
                    type="checkbox"
                    className="checkbox rounded-[2px] checkbox-sm checkbox-primary"
                    checked={items.every((item) =>
                      selectedItems.includes(cart.indexOf(item))
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const storeIndices = items.map((item) =>
                          cart.indexOf(item)
                        );
                        setSelectedItems([
                          ...new Set([...selectedItems, ...storeIndices]),
                        ]);
                      } else {
                        const storeIndices = items.map((item) =>
                          cart.indexOf(item)
                        );
                        setSelectedItems(
                          selectedItems.filter(
                            (idx) => !storeIndices.includes(idx)
                          )
                        );
                      }
                    }}
                  />
                  <span className="font-semibold flex gap-1.5 items-center">
                    <BsShop size={17} /> {storeName}
                  </span>
                </div>

                {/* Store Items */}
                <div className="space-y-4">
                  {items.map((item) => {
                    const globalIndex = cart.indexOf(item);
                    const product = item.product;

                    if (!product) return null;

                    const discountedPrice =
                      product.discount > 0
                        ? product.price -
                          (product.price * product.discount) / 100
                        : product.price;

                    return (
                      <div
                        key={globalIndex}
                        className="flex gap-4 items-center"
                      >
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          className="checkbox rounded-[2px] checkbox-primary mt-4"
                          checked={selectedItems.includes(globalIndex)}
                          onChange={() => toggleItemSelection(globalIndex)}
                        />

                        {/* Product Image */}
                        <div className="w-22 h-22 flex-shrink-0">
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-medium text-sm mb-1 line-clamp-2">
                            {product.name}
                          </h3>

                          {/* Color and Size */}
                          {(item.color || item.size) && (
                            <div className="flex gap-3 text-xs text-gray-600 mb-2">
                              {item.color && (
                                <span>
                                  Color:{" "}
                                  <span className="capitalize">
                                    {item.color}
                                  </span>
                                </span>
                              )}
                              {item.size && (
                                <span>
                                  Size:{" "}
                                  <span className="uppercase">{item.size}</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-orange-500 font-bold">
                                ৳ {discountedPrice.toFixed(0)}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through">
                                  ৳ {product.price.toFixed(0)}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex items-center border border-gray-400 rounded">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity === 1}
                                  className="px-2 py-1 disabled:opacity-40 cursor-pointer"
                                >
                                  <FiMinus size={14} />
                                </button>
                                <span className="px-5 py-1 text-lg font-semibold border-x border-gray-500">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={item.quantity >= product.stock}
                                  className="px-2 py-1 disabled:opacity-40 cursor-pointer"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>

                              {/* Actions */}
                              <div className="flex justify-center gap-3 items-center">
                                <button
                                  onClick={() => handleRemoveItem(item)}
                                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                                >
                                  <FiTrash2 size={19} />
                                </button>
                                <button className="text-gray-400 hover:text-pink-500 cursor-pointer">
                                  <FiHeart size={20} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Stock Warning */}
                          {product.stock < 5 && product.stock > 0 && (
                            <p className="text-xs text-red-600 mt-1">
                              Only {product.stock} left in stock
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg p-6 shadow-xl sticky top-18">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              {/* Subtotal */}
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  Subtotal ({selectedItems.length} items)
                </span>
                <span className="font-semibold">৳ {subtotal.toFixed(0)}</span>
              </div>

              {/* Shipping Fee */}
              <div className="flex justify-between mb-4 pb-4 border-b">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="font-semibold">৳ {shippingFee}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-orange-500">
                  ৳ {total.toFixed(0)}
                </span>
              </div>

              {/* Voucher Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Voucher Code"
                    className="input input-bordered flex-1 input-sm"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="btn btn-secondary text-white btn-sm"
                  >
                    APPLY
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="btn btn-primary w-full text-white font-bold disabled:opacity-50 disabled:text-black/60"
              >
                PROCEED TO CHECKOUT ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;