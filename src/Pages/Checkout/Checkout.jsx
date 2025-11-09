import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaXmark } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Select from "react-select";
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
import { useAddressForm } from "../../Hooks/useAddressForm";
import AddressModal from "../../Components/Shared/AddressBook/AddressModal";
import { useAddressMutations } from "../../Hooks/useAddressMutations";
import MiniLoader from "../../Components/Loader/MiniLoader";

const Checkout = () => {
  const {
    formData,
    selectedRegion,
    selectedDistrict,
    selectedThana,
    districts,
    thanas,
    regions,
    setFormData,
    handleRegionChange,
    handleDistrictChange,
    handleThanaChange,
    resetForm,
  } = useAddressForm();

  const navigate = useNavigate();
  const { user, userEmail } = useAuth();
  const { roleLoading, role } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const [cartItems, setCartItems] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Address management
  const [shippingAddress, setShippingAddress] = useState(null);
  const [tempShippingAddress, setTempShippingAddress] = useState(null);
  const [showInlineAddressForm, setShowInlineAddressForm] = useState(false);

  // Drawer states
  const [showShippingDrawer, setShowShippingDrawer] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // Fetch addresses from API
  const {
    data: addresses,
    isLoading: addressesLoading,
    refetch,
  } = useQuery({
    queryKey: ["addresses", userEmail],
    queryFn: async () => {
      const response = await axiosSecure.get(`/address?email=${userEmail}`);

      const defaultShippingAddress = response.data.find(
        (add) => add.isDefaultShipping
      );
      setShippingAddress(defaultShippingAddress || null);
      setTempShippingAddress(defaultShippingAddress?._id || null);

      // Show inline form if no addresses exist
      if (!response.data || response.data.length === 0) {
        setShowInlineAddressForm(true);
      }

      return response.data || [];
    },

    enabled: !!user && !!userEmail && !roleLoading && role === "customer",
  });

  // Add address mutation
  const { addMutation, setDefaultShippingMutation } = useAddressMutations(
    axiosSecure,
    userEmail,
    refetch,
    {
      onAddSuccess: () => {
        setShowAddAddressModal(false);
        setShowInlineAddressForm(false);
        resetForm();
        toast.success("Address added successfully");
      },
      onDefaultShippingSuccess: () => {
        setShowShippingDrawer(false);
        toast.success("Shipping address updated successfully");
      },
    }
  );

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

  // have to fix
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

  const handleAddInlineAddress = () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.region ||
      !formData.district ||
      !formData.thana ||
      !formData.address
    ) {
      return toast.warn("Fill all the required fields");
    }

    addMutation.mutate(formData);
  };

  const handleSaveShippingAddress = () => {
    if (!tempShippingAddress) {
      toast.warn("Please select an address");
      return;
    }

    setDefaultShippingMutation.mutate(tempShippingAddress);
  };

  const cancelEditShippingAddress = () => {
    const currentDefault = addresses?.find((add) => add.isDefaultShipping);
    setTempShippingAddress(currentDefault?._id || null);
    setShowShippingDrawer(false);
  };

  const groupedByStore = cartItems.reduce((acc, item) => {
    const storeId = item.product?.storeId || "unknown";
    const storeName = item.product?.storeName || "Unknown Store";
    const storeInfo = item.product?.storeInfo;

    if (!acc[storeId]) {
      acc[storeId] = {
        storeName,
        storeInfo,
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
            {/* Shipping Address or Inline Form */}
            {shippingAddress && !showInlineAddressForm ? (
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

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{shippingAddress.name}</p>
                    <span className="text-sm">{shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${
                        shippingAddress.label === "HOME"
                          ? "bg-orange-500"
                          : "bg-primary"
                      } text-white text-xs px-2 py-0.5 rounded-full`}
                    >
                      {shippingAddress.label}
                    </span>
                    <p className="text-sm text-gray-600">
                      {shippingAddress.address}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-6">
                  Delivery Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter your first and last name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <Select
                      options={regions.map((r) => ({ value: r, label: r }))}
                      value={selectedRegion}
                      onChange={handleRegionChange}
                      placeholder="Please choose your region"
                      className="text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#d1d5db",
                          "&:hover": { borderColor: "#14b8a6" },
                        }),
                      }}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Please enter your phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* City/District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Select
                      options={districts.map((d) => ({ value: d, label: d }))}
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      placeholder="Please choose your city"
                      isDisabled={!selectedRegion}
                      className="text-sm"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: "#d1d5db",
                          backgroundColor: state.isDisabled
                            ? "#f3f4f6"
                            : "white",
                          "&:hover": {
                            borderColor: state.isDisabled
                              ? "#d1d5db"
                              : "#14b8a6",
                          },
                        }),
                      }}
                    />
                  </div>

                  {/* Building/House */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Building / House No / Floor / Street
                    </label>
                    <input
                      type="text"
                      value={formData.building}
                      onChange={(e) =>
                        setFormData({ ...formData, building: e.target.value })
                      }
                      placeholder="Please enter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Area/Thana */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area
                    </label>
                    <Select
                      options={thanas.map((t) => ({ value: t, label: t }))}
                      value={selectedThana}
                      onChange={handleThanaChange}
                      placeholder="Please choose your area"
                      isDisabled={!selectedRegion || !selectedDistrict}
                      className="text-sm"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: "#d1d5db",
                          backgroundColor: state.isDisabled
                            ? "#f3f4f6"
                            : "white",
                          "&:hover": {
                            borderColor: state.isDisabled
                              ? "#d1d5db"
                              : "#14b8a6",
                          },
                        }),
                      }}
                    />
                  </div>

                  {/* Colony/Locality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colony / Suburb / Locality / Landmark
                    </label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) =>
                        setFormData({ ...formData, locality: e.target.value })
                      }
                      placeholder="Please enter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Full Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="For Example: House# 123, Street# 123, ABC Road"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Address Type Selector */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select a label for effective delivery:
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setFormData({ ...formData, label: "HOME" })
                      }
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.label === "HOME"
                          ? "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <AiOutlineHome
                        size={24}
                        className={
                          formData.label === "HOME"
                            ? "text-orange-600"
                            : "text-gray-400"
                        }
                      />
                      HOME
                    </button>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, label: "OFFICE" })
                      }
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 transition-all cursor-pointer ${
                        formData.label === "OFFICE"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <BsBriefcase
                        size={24}
                        className={
                          formData.label === "OFFICE"
                            ? "text-teal-600"
                            : "text-gray-400"
                        }
                      />
                      OFFICE
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAddInlineAddress}
                    disabled={addMutation.isPending}
                    className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <MiniLoader /> SAVING...
                      </span>
                    ) : (
                      "SAVE"
                    )}
                  </button>
                </div>
              </div>
            )}

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

                    {shippingAddress && (
                      <div className="border border-primary rounded-lg p-4 mb-4 w-fit">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <div>
                            <p className="font-medium">
                              ৳{" "}
                              {shippingAddress.district ===
                              storeData.storeInfo?.district
                                ? 80
                                : 150}
                            </p>
                            <p className="text-sm text-gray-600">
                              Standard Delivery
                            </p>
                            <p className="text-sm text-gray-600">
                              Guaranteed by 28 Oct-1 Nov
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

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
                              src={item.product?.image}
                              alt={item.product?.name || "Product"}
                              className="w-24 h-24 object-contain rounded"
                            />
                            <div className="flex-1">
                              <h3 className="text-sm font-medium mb-1">
                                {item.product?.name}
                              </h3>
                              <p className="text-xs text-gray-500 mb-2 flex gap-1.5 items-center flex-wrap">
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
                onClick={() => toast.info("Proceed to payment")}
                disabled={!shippingAddress}
                className="w-full btn btn-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Pay
              </button>
              {!shippingAddress && (
                <p className="text-xs text-red-500 text-center -mt-2">
                  Please add shipping address to proceed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Drawer */}
      {showShippingDrawer && (
        <>
          <div
            className="fixed inset-0 bg-black/10 bg-opacity-50 z-40 animate-fade-in"
            onClick={cancelEditShippingAddress}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-full sm:max-w-sm bg-white shadow-2xl z-50 overflow-y-auto hide-scrollbar animate-slide-in-right">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <button
                  onClick={cancelEditShippingAddress}
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <FaXmark size={24} />
                </button>
              </div>

              <button
                onClick={() => {
                  setShowAddAddressModal(true);
                }}
                className="w-full mb-4 btn btn-secondary btn-outline hover:text-white"
              >
                Add new address
              </button>

              <div className="space-y-4">
                {addresses?.length > 0 ? (
                  addresses.map((addr) => (
                    <div
                      key={addr._id || addr.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        tempShippingAddress === addr._id
                          ? "border-primary bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setTempShippingAddress(addr._id)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={tempShippingAddress === addr._id}
                          onChange={() => setTempShippingAddress(addr._id)}
                          className="radio radio-primary radio-sm mt-1"
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No addresses found</p>
                    <p className="text-sm mt-2">
                      Add a new address to continue
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cancelEditShippingAddress}
                  className="flex-1 btn"
                  disabled={setDefaultShippingMutation.isPending}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveShippingAddress}
                  disabled={
                    setDefaultShippingMutation.isPending || !tempShippingAddress
                  }
                  className="flex-1 btn text-white btn-primary disabled:text-black/50"
                >
                  {setDefaultShippingMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <MiniLoader /> Saving...
                    </span>
                  ) : (
                    "SAVE"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <AddressModal
          isEdit={false}
          formData={formData}
          setFormData={setFormData}
          selectedRegion={selectedRegion}
          selectedDistrict={selectedDistrict}
          selectedThana={selectedThana}
          regions={regions}
          districts={districts}
          thanas={thanas}
          onRegionChange={handleRegionChange}
          onDistrictChange={handleDistrictChange}
          onThanaChange={handleThanaChange}
          onSubmit={handleAddInlineAddress}
          onClose={() => setShowAddAddressModal(false)}
          isSubmitting={addMutation.isPending}
        />
      )}
    </div>
  );
};

export default Checkout;