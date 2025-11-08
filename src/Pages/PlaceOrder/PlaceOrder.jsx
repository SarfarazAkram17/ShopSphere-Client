import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaXmark } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineUser, AiOutlinePhone, AiOutlineClose } from "react-icons/ai";
import { BsBuilding } from "react-icons/bs";
import { BiMap } from "react-icons/bi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  clearShopCart,
  getShopCart,
  getShopCartRemainingTime,
  isShopCartValid,
  removeShopCartItem,
} from "../../lib/localStorage";
import Loader from "../../Components/Loader/Loader";
import useUserRole from "../../Hooks/useUserRole";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { user, userEmail } = useAuth();
  const { roleLoading, role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [cartItems, setCartItems] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Address management
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);

  // Drawer states
  const [showShippingDrawer, setShowShippingDrawer] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // Form states
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    region: "",
    district: "",
    thana: "",
    building: "",
    address: "",
    label: "HOME",
  });

  // Fetch addresses from API
  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses", userEmail],
    queryFn: async () => {
      const response = await axiosSecure.get(`/address?email=${userEmail}`);

      const defaultSelectedAddress = response.data.find((add) => add.selected);
      setSelectedShippingAddress(defaultSelectedAddress);
      return response.data || [];
    },

    enabled: !!user && !!userEmail && !roleLoading && role === "customer",
  });

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async (addressData) => {
      const response = await axiosSecure.post(
        `/address?email=${userEmail}`,
        addressData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses", userEmail]);
      toast.success("Address added successfully");
      setShowAddAddressModal(false);
      setNewAddress({
        name: "",
        phone: "",
        region: "",
        district: "",
        thana: "",
        building: "",
        address: "",
        label: "HOME",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add address");
    },
  });

  useEffect(() => {
    const loadOrderData = async () => {
      if (!user) {
        toast.error("Please login first!");
        navigate("/login");
        return;
      }

      const shopCartData = await getShopCart(userEmail);

      if (
        !shopCartData ||
        shopCartData.length === 0 ||
        !isShopCartValid(userEmail)
      ) {
        toast.info("No items to checkout. Redirecting...");
        navigate(-1);
        return;
      }

      try {
        // NEW: Use dedicated checkout endpoint
        const response = await axiosSecure.post(
          `/cart/checkout-items?email=${userEmail}`,
          { items: shopCartData }
        );

        const checkoutItems = response.data.items || [];

        // Filter out any items where product wasn't found
        const validItems = checkoutItems.filter((item) => item.product);

        if (validItems.length === 0) {
          toast.error("No valid products found");
          clearShopCart(userEmail);
          navigate(-1);
          return;
        }

        // If some items were invalid, show warning
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
        navigate("/products");
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, user, userEmail, axiosSecure]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateItemPrice = (item) => {
    if (!item?.product) return 0;
    const price =
      item.product.discount > 0
        ? item.product.price -
          (item.product.price * item.product.discount) / 100
        : item.product.price;
    return price;
  };

  const calculateTotal = () => {
    const itemsTotal = cartItems.reduce((sum, item) => {
      const price = calculateItemPrice(item);
      return sum + price * item.quantity;
    }, 0);

    const deliveryTotal = 150 * cartItems.length;
    return { itemsTotal, deliveryTotal, total: itemsTotal + deliveryTotal };
  };

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

  const handleAddAddress = () => {
    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.region ||
      !newAddress.district ||
      !newAddress.thana ||
      !newAddress.address
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    addAddressMutation.mutate(newAddress);
  };

  const handleSelectShipping = (address) => {
    setSelectedShippingAddress(address);
    setShowShippingDrawer(false);
  };

  const groupedByStore = cartItems.reduce((acc, item) => {
    const storeId = item.product?.storeId || "unknown";
    const storeName = item.product?.storeName || "Unknown Store";

    if (!acc[storeId]) {
      acc[storeId] = {
        storeName: storeName,
        items: [],
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {});

  const totals = calculateTotal();

  if (isLoading || addressesLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* Session Timer */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⏱️</span>
            <div>
              <p className="text-yellow-800 font-semibold text-lg">
                Session expires in: {formatTime(remainingTime)}
              </p>
              <p className="text-yellow-700 text-sm">
                Complete your order within the time limit
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Shipping & Billing</h2>
                <button
                  onClick={() => setShowShippingDrawer(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                >
                  EDIT
                </button>
              </div>

              {selectedShippingAddress && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {selectedShippingAddress.name}
                    </p>
                    <span className="text-sm">
                      {selectedShippingAddress.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${
                        selectedShippingAddress.label === "HOME"
                          ? "bg-orange-500"
                          : "bg-primary"
                      } text-white text-xs px-2 py-0.5 rounded-full`}
                    >
                      {selectedShippingAddress.label}
                    </span>
                    <p className="text-sm text-gray-600">
                      {selectedShippingAddress.address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Package Items by Store */}
            <div className="space-y-4">
              {Object.entries(groupedByStore).map(
                ([storeId, storeData], storeIndex) => (
                  <div
                    key={storeId}
                    className="bg-white rounded-lg shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Package {storeIndex + 1} of{" "}
                          {Object.keys(groupedByStore).length}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Shipped by{" "}
                        <span className="font-bold text-black/90">
                          {storeData.storeName}
                        </span>
                      </p>
                    </div>

                    <div className="border border-primary rounded-lg p-4 mb-4 w-fit">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <p className="font-medium">৳ 80</p>
                          <p className="text-sm text-gray-600">
                            Standard Delivery
                          </p>
                          <p className="text-sm text-gray-600">
                            Guaranteed by 28 Oct-1 Nov
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {storeData.items.map((item, itemIndex) => {
                        const price = calculateItemPrice(item);
                        const originalPrice = item.product?.price || 0;

                        return (
                          <div
                            key={`${item.productId}-${item.color}-${item.size}-${itemIndex}`}
                            className="flex gap-4 border-t pt-4 first:border-t-0 first:pt-0"
                          >
                            <img
                              src={item.product?.images?.[0]}
                              alt={item.product?.name || "Product"}
                              className="w-24 h-24 object-contain rounded"
                            />
                            <div className="flex-1">
                              <h3 className="text-sm font-medium mb-1">
                                {item.product?.name}
                              </h3>
                              <p className="text-xs text-gray-500 mb-2 flex gap-1.5 items-center">
                                {item.color && (
                                  <span className="capitalize">
                                    Color: {item.color} {item.size && ", "}
                                  </span>
                                )}
                                {item.size && (
                                  <span className="capitalize">
                                    Size: {item.size}
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-3">
                                <p className="text-orange-500 font-semibold">
                                  ৳ {price.toFixed(2)}
                                </p>
                                {item.product?.discount > 0 && (
                                  <>
                                    <p className="text-gray-400 line-through text-sm">
                                      ৳ {originalPrice}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      -{item.product.discount}%
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <button
                                onClick={() => handleRemoveItem(item)}
                                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                              >
                                <FaRegTrashAlt size={18} />
                              </button>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-xl p-6 sticky top-18 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Items Total ({cartItems.length} Items)
                    </span>
                    <span>৳ {totals.itemsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>৳ {totals.deliveryTotal}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-orange-500 font-bold text-xl">
                      ৳ {totals.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-60 text-right">
                    VAT included, where applicable
                  </p>
                </div>
              </div>

              <button
                onClick={() => toast.info("Buy again")}
                className="w-full btn btn-primary text-white"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Drawer */}
      {showShippingDrawer && (
        <>
          <div
            className="fixed inset-0 bg-black/10 bg-opacity-50 z-40 animate-fade-in"
            onClick={() => setShowShippingDrawer(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto hide-scrollbar animate-slide-in-right">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <button
                  onClick={() => setShowShippingDrawer(false)}
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <FaXmark size={24} />
                </button>
              </div>

              <button
                onClick={() => {
                  setShowAddAddressModal(true);
                }}
                className="w-full mb-4 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-600 rounded py-2 cursor-pointer"
              >
                Add new address
              </button>

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id || addr.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedShippingAddress?.id === addr.id ||
                      selectedShippingAddress?._id === addr._id
                        ? "border-primary bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectShipping(addr)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedShippingAddress?._id === addr._id}
                        onChange={() => handleSelectShipping(addr)}
                        className="mt-1 h-5 w-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{addr.name}</p>
                          <span className="text-sm text-gray-600">
                            {addr.phone}
                          </span>
                        </div>
                        <span
                          className={`${
                            addr.label === "HOME"
                              ? "bg-orange-500"
                              : "bg-primary"
                          } text-white text-xs px-2 py-0.5 rounded-full`}
                        >
                          {addr.label}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.address}
                        </p>
                        {addr.isDefaultShipping && (
                          <span className="text-xs text-blue-600 mt-1 inline-block">
                            Default Shipping Address
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowShippingDrawer(false)}
                  className="flex-1 btn"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => setShowShippingDrawer(false)}
                  className="flex-1 btn text-white btn-primary"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar animate-scale-in">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <HiOutlineLocationMarker className="w-7 h-7" />
                  Add New Address
                </h2>
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="bg-white/20 text-white p-2 rounded-xl hover:bg-white/30 transition-all cursor-pointer"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <AiOutlineUser size={16} className="text-teal-500" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first and last name"
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, name: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <AiOutlinePhone size={16} className="text-teal-500" />
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Please enter your phone number"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          phone: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BiMap size={16} className="text-teal-500" />
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newAddress.region}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          region: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select Region</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BiMap size={16} className="text-teal-500" />
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your district"
                      value={newAddress.district}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          district: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Thana */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BiMap size={16} className="text-teal-500" />
                      Thana <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your thana"
                      value={newAddress.thana}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          thana: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Building */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BsBuilding size={16} className="text-teal-500" />
                      Building / House No / Floor / Street
                    </label>
                    <input
                      type="text"
                      placeholder="Please enter"
                      value={newAddress.building}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          building: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Full Address */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <HiOutlineLocationMarker
                        size={16}
                        className="text-teal-500"
                      />
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="For Example: House# 123, Street# 123, ABC Road"
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          address: e.target.value,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Address Type Selector */}
                <div>
                  <label className="block text-sm font-semibold mb-4 text-gray-700">
                    Select a label for effective delivery:
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        setNewAddress({ ...newAddress, label: "OFFICE" })
                      }
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl border-2 transition-all font-semibold ${
                        newAddress.label === "OFFICE"
                          ? "border-teal-500 bg-teal-50 text-teal-700 shadow-md"
                          : "border-gray-300 hover:border-gray-400 text-gray-700"
                      }`}
                    >
                      <span className="text-2xl">🏢</span>
                      <span>OFFICE</span>
                    </button>
                    <button
                      onClick={() =>
                        setNewAddress({ ...newAddress, label: "HOME" })
                      }
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl border-2 transition-all font-semibold ${
                        newAddress.label === "HOME"
                          ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
                          : "border-gray-300 hover:border-gray-400 text-gray-700"
                      }`}
                    >
                      <span className="text-2xl">🏠</span>
                      <span>HOME</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 pt-6 border-t mt-8">
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  disabled={addAddressMutation.isPending}
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {addAddressMutation.isPending ? "Saving..." : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;