import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaXmark } from "react-icons/fa6";
import { TbCurrencyTaka } from "react-icons/tb";
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
import { AiOutlineHome } from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import { useCartCount } from "../../Hooks/useCartCount";
import { MdOutlineCreditCard } from "react-icons/md";
import { StripeCardPayment } from "../../Components/Shared/Checkout/StripeCardPayment";

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
  const { refetch: cartCountRefetch } = useCartCount();
  // Payment section states
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // Address management
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [tempShippingAddress, setTempShippingAddress] = useState(null);
  const [tempBillingAddress, setTempBillingAddress] = useState(null);
  const [showInlineAddressForm, setShowInlineAddressForm] = useState(false);
  // Drawer/Modal states
  const [showShippingDrawer, setShowShippingDrawer] = useState(false);
  const [showInvoiceDrawer, setShowInvoiceDrawer] = useState(false);
  const [showBillingDrawer, setShowBillingDrawer] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isClosingShipping, setIsClosingShipping] = useState(false);
  const [isClosingInvoice, setIsClosingInvoice] = useState(false);
  const [isClosingBilling, setIsClosingBilling] = useState(false);

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
      const defaultBillingAddress = response.data.find(
        (add) => add.isDefaultBilling
      );

      setShippingAddress(defaultShippingAddress || null);
      setBillingAddress(defaultBillingAddress || null);
      setTempShippingAddress(defaultShippingAddress?._id || null);
      setTempBillingAddress(defaultBillingAddress?._id || null);

      if (!response.data || response.data.length === 0) {
        setShowInlineAddressForm(true);
      }

      return response.data || [];
    },
    enabled: !!user && !!userEmail && !roleLoading && role === "customer",
  });

  // Add address mutation
  const { addMutation, setDefaultShippingMutation, setDefaultBillingMutation } =
    useAddressMutations(axiosSecure, userEmail, refetch, {
      onAddSuccess: () => {
        setShowAddAddressModal(false);
        setShowInlineAddressForm(false);
        resetForm();
        toast.success("Address added successfully");
      },
      onDefaultShippingSuccess: () => {
        setIsClosingShipping(true);
        setTimeout(() => {
          setShowShippingDrawer(false);
          setIsClosingShipping(false);
        }, 300);
        toast.success("Shipping address updated successfully");
      },
      onDefaultBillingSuccess: () => {
        setIsClosingBilling(true);
        setTimeout(() => {
          setShowBillingDrawer(false);
          setIsClosingBilling(false);
        }, 300);
        toast.success("Billing address updated successfully");
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

  const handleSaveBillingAddress = () => {
    if (!tempBillingAddress) {
      toast.warn("Please select a billing address");
      return;
    }

    setDefaultBillingMutation.mutate(tempBillingAddress);
  };

  const handleSaveInvoiceInfo = () => {
    if (!userEmail) {
      toast.warn("Please enter email address");
      return;
    }

    if (!billingAddress) {
      toast.warn("Please select a billing address");
      return;
    }

    setIsClosingInvoice(true);
    setShowInvoiceDrawer(false);
    setIsClosingInvoice(false);
    toast.success("Invoice information updated successfully");
  };

  const cancelEditShippingAddress = () => {
    const currentDefault = addresses?.find((add) => add.isDefaultShipping);
    setTempShippingAddress(currentDefault?._id || null);
    setIsClosingShipping(true);
    setTimeout(() => {
      setShowShippingDrawer(false);
      setIsClosingShipping(false);
    }, 300);
  };

  const cancelEditBillingAddress = () => {
    const currentDefault = addresses?.find((add) => add.isDefaultBilling);
    setTempBillingAddress(currentDefault?._id || null);
    setIsClosingBilling(true);
    setTimeout(() => {
      setShowBillingDrawer(false);
      setIsClosingBilling(false);
    }, 300);
  };

  const cancelEditInvoiceInfo = () => {
    setIsClosingInvoice(true);
    setTimeout(() => {
      setShowInvoiceDrawer(false);
      setIsClosingInvoice(false);
    }, 300);
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

    const deliveryTotal = Object.entries(groupedByStore).reduce(
      // eslint-disable-next-line no-unused-vars
      (sum, [storeId, storeData]) => {
        const deliveryCharge =
          shippingAddress?.district === storeData.storeInfo?.district
            ? 80
            : 150;
        return sum + deliveryCharge;
      },
      0
    );

    return { itemsTotal, deliveryTotal, total: itemsTotal + deliveryTotal };
  };

  const totals = calculateTotal();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await axiosSecure.post(
        `/orders?email=${userEmail}`,
        orderData
      );
      return response.data;
    },
    onSuccess: (data) => {
      setCreatedOrder(data);
      setShowPaymentSection(true);
      cartCountRefetch();
    },
  });

  const handleProceedToPay = async () => {
    if (!shippingAddress || !billingAddress) {
      toast.error("Please add shipping and billing addresses");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const stores = Object.entries(groupedByStore).map(
      ([storeId, storeData]) => {
        const storeItems = storeData.items.map((item) => {
          const unitPrice = item.product.price;
          const discount = item.product.discount || 0;
          const discountedPrice =
            discount > 0 ? unitPrice - (unitPrice * discount) / 100 : unitPrice;
          const subtotal = discountedPrice * item.quantity;

          return {
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.image,
            color: item.color || null,
            size: item.size || null,
            quantity: item.quantity,
            unitPrice,
            discount,
            discountedPrice: Number(discountedPrice.toFixed(2)),
            subtotal: Number(subtotal.toFixed(2)),
          };
        });

        const storeTotal = storeItems.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );
        const deliveryCharge =
          shippingAddress.district === storeData.storeInfo?.district ? 80 : 150;
        const platformCommission = 10;
        const platformCommissionAmount =
          (storeTotal * platformCommission) / 100;
        const sellerAmount = storeTotal - platformCommissionAmount;
        const riderAmount =
          shippingAddress.district === storeData.storeInfo?.district ? 70 : 50;

        return {
          storeId,
          storeName: storeData.storeName,
          storeEmail: storeData.storeInfo?.storeEmail || "",
          storeOrderStatus: "pending",
          items: storeItems,
          deliveryCharge,
          storeTotal: Number(parseFloat(storeTotal).toFixed(2)),
          platformCommission,
          platformCommissionAmount: Number(platformCommissionAmount.toFixed(2)),
          sellerAmount: Number(sellerAmount.toFixed(2)),
          riderAmount,
        };
      }
    );

    const orderData = {
      customerEmail: userEmail,
      orderStatus: "pending",
      paymentStatus: "unpaid",
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        email: shippingAddress.email || userEmail,
        address: shippingAddress.address,
        building: shippingAddress.building || "",
        thana: shippingAddress.thana,
        district: shippingAddress.district,
        region: shippingAddress.region,
        label: shippingAddress.label,
      },
      billingAddress: {
        name: billingAddress.name,
        phone: billingAddress.phone,
        email: billingAddress.email || userEmail,
        address: billingAddress.address,
        building: billingAddress.building || "",
        thana: billingAddress.thana,
        district: billingAddress.district,
        region: billingAddress.region,
        label: billingAddress.label,
      },
      stores,
      itemsTotal: Number(totals.itemsTotal.toFixed(2)),
      totalDeliveryCharge: totals.deliveryTotal,
      totalAmount: Number((totals.total + 20).toFixed(2)),
      paymentMethod: "cash_on_delivery",
      cashPaymentFee: 20,
      transactionId: null,
    };

    createOrderMutation.mutate(orderData);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmOrder = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessingPayment(true);

    try {
      await axiosSecure.patch(
        `/orders/${createdOrder.id}/confirm?email=${userEmail}`
      );

      // Clear cart
      clearShopCart(userEmail);
      navigate("/dashboard/myOrders");
      cartCountRefetch();

      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm order");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      toast.success("Payment successful! Redirecting to my orders page...");
      setTimeout(() => {
        navigate("/dashboard/myOrders");
        clearShopCart(userEmail);
        cartCountRefetch();
      }, 1000);
    } catch (error) {
      toast.error(
        error.message ||
          "Payment successful but there was an error. Please contact support."
      );
    }
  };

  if (isLoading || addressesLoading) return <Loader />;

  // Payment Section Component
  if (showPaymentSection && createdOrder) {
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
                  Complete your payment within the time limit
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section - Payment Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Select Payment Method
                </h2>

                {/* Payment Method Options */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Credit/Debit Card */}
                  <button
                    onClick={() => handlePaymentMethodSelect("card")}
                    className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                      selectedPaymentMethod === "card"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-blue-200/70 rounded-lg flex items-center justify-center">
                        <MdOutlineCreditCard className="text-blue-700 h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm">
                          Credit/Debit Card
                        </p>
                        <p className="text-xs text-gray-500">
                          Visa, Mastercard, Amex etc.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    onClick={() => handlePaymentMethodSelect("cod")}
                    className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                      selectedPaymentMethod === "cod"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-green-200/70 rounded-lg flex items-center justify-center">
                        <TbCurrencyTaka className="w-8 h-8 text-green-700" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-gray-500">
                          Pay when you receive
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Card Payment Form */}
                {selectedPaymentMethod === "card" && (
                  <div className="border-t pt-6">
                    <StripeCardPayment
                      createdOrder={createdOrder}
                      totalAmount={totals.total}
                      userEmail={userEmail}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                )}

                {/* COD Instructions */}
                {selectedPaymentMethod === "cod" && (
                  <div className="border-t pt-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-amber-900">
                        Cash on Delivery Instructions:
                      </h4>
                      <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                        <li>
                          You may pay in cash to our rider upon receiving your
                          parcel at the doorstep
                        </li>
                        <li>
                          Before agreeing to receive the parcel, check if your
                          delivery status has been updated to 'Out for Delivery'
                        </li>
                        <li>
                          Before receiving, confirm that the airway bill shows
                          that the parcel is from ShopSphere
                        </li>
                        <li>
                          Before making payment to the rider, confirm that the
                          order number, sender information and tracking number
                          on the parcel
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Confirm Button */}
                {selectedPaymentMethod === "cod" && (
                  <div className="mt-6">
                    <button
                      onClick={handleConfirmOrder}
                      disabled={!selectedPaymentMethod || isProcessingPayment}
                      className="w-full btn btn-primary text-white disabled:text-black/50"
                    >
                      {isProcessingPayment ? (
                        <span className="flex items-center justify-center gap-2">
                          <MiniLoader /> Processing...
                        </span>
                      ) : (
                        "Confirm Order"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-xl p-6 sticky top-6">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal (
                      {cartItems.reduce(
                        (total, item) => total + (item.quantity || 0),
                        0
                      )}{" "}
                      items and shipping fee included)
                    </span>
                    <span className="font-semibold">
                      ৳ {totals.total.toFixed(2)}
                    </span>
                  </div>
                  {selectedPaymentMethod === "cod" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cash Payment Fee</span>
                      <span className="font-semibold">৳ 20</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg">Total Amount</span>
                    <span className="text-orange-500 font-bold text-2xl">
                      ৳{" "}
                      {(
                        totals.total +
                        (selectedPaymentMethod === "cod" ? 20 : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to ShopSphere's Terms and Conditions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
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
                      {shippingAddress.address}, {shippingAddress.thana},{" "}
                      {shippingAddress.district}, {shippingAddress.region}
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

                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <Select
                      options={regions.map((r) => ({ value: r, label: r }))}
                      value={selectedRegion}
                      onChange={handleRegionChange}
                      placeholder="Select Region"
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

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <Select
                      options={districts.map((d) => ({ value: d, label: d }))}
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      placeholder="Select District"
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

                  {/* Thana */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thana
                    </label>
                    <Select
                      options={thanas.map((t) => ({ value: t, label: t }))}
                      value={selectedThana}
                      onChange={handleThanaChange}
                      placeholder="Select Thana"
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
                    className="btn btn-primary text-white disabled:text-black/50 disabled:cursor-not-allowed"
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
                    <div className="flex justify-between items-center mb-4">
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
              {/* Promotion Section */}
              {/* <div>
                <h3 className="font-semibold mb-3">Promotion</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Store/ShopSphere Coupon Code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <button className="btn btn-sm btn-secondary text-white">
                    APPLY
                  </button>
                </div>
              </div> */}

              {/* Invoice and Contact Info */}
              <div className="my-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">
                    Invoice and Contact Info
                  </h3>
                  <button
                    onClick={() => setShowInvoiceDrawer(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    EDIT
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Items Total (
                      {cartItems.reduce(
                        (total, item) => total + (item.quantity || 0),
                        0
                      )}{" "}
                      Item
                      {cartItems.length > 1 ? "s" : ""})
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
                  <p className="text-xs text-gray-600 text-right">
                    VAT included, where applicable
                  </p>
                </div>
              </div>

              <button
                onClick={handleProceedToPay}
                disabled={!shippingAddress || !billingAddress}
                className="w-full btn btn-primary text-white disabled:text-black/50 disabled:cursor-not-allowed"
              >
                Proceed to Pay (
                {cartItems.reduce(
                  (total, item) => total + (item.quantity || 0),
                  0
                )}
                )
              </button>
              {(!shippingAddress || !billingAddress) && (
                <p className="text-xs text-red-500 text-center -mt-2">
                  {!shippingAddress && !billingAddress
                    ? "Please add shipping and billing address to proceed"
                    : !shippingAddress
                    ? "Please add shipping address to proceed"
                    : "Please add billing address to proceed"}
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
            className={`fixed inset-0 bg-black/10 bg-opacity-50 z-40 transition-opacity duration-300 ${
              isClosingShipping ? "opacity-0" : "opacity-100"
            }`}
            onClick={cancelEditShippingAddress}
          />
          <div
            className={`fixed right-0 top-0 h-full w-full max-w-[300px] sm:max-w-sm bg-white shadow-2xl z-50  animate-slide-in-right overflow-y-auto hide-scrollbar transition-transform duration-300 ease-in-out ${
              isClosingShipping ? "translate-x-full" : "translate-x-0"
            }`}
          >
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
                          <p className="text-xs text-gray-500 mt-1">
                            {addr.thana} - {addr.district} - {addr.region}
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
                  className="flex-1 btn disabled:text-black/50"
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

      {/* Invoice and Contact Info Drawer */}
      {showInvoiceDrawer && (
        <>
          <div
            className={`fixed inset-0 bg-black/10 bg-opacity-50 z-40 transition-opacity duration-300 ${
              isClosingInvoice ? "opacity-0" : "opacity-100"
            }`}
            onClick={cancelEditInvoiceInfo}
          />
          <div
            className={`fixed right-0 top-0 h-full w-full max-w-[300px] sm:max-w-sm bg-white animate-slide-in-right shadow-2xl z-50 overflow-y-auto hide-scrollbar transition-transform duration-300 ease-in-out ${
              isClosingInvoice ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Invoice and Contact Info
                </h2>
                <button
                  onClick={cancelEditInvoiceInfo}
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <FaXmark size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Email Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    readOnly
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your email to get delivery status updates
                  </p>
                </div>

                {/* Billing Address Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Billing Address <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={() => setShowBillingDrawer(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                    >
                      EDIT
                    </button>
                  </div>

                  {billingAddress ? (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{billingAddress.name}</p>
                        <span className="text-sm text-gray-600">
                          {billingAddress.phone}
                        </span>
                      </div>
                      <span
                        className={`${
                          billingAddress.label === "HOME"
                            ? "bg-orange-500"
                            : "bg-primary"
                        } text-white text-xs px-2 py-0.5 rounded-full inline-block mb-2`}
                      >
                        {billingAddress.label}
                      </span>
                      <p className="text-sm text-gray-600">
                        {billingAddress.address}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {billingAddress.thana} - {billingAddress.district} -{" "}
                        {billingAddress.region}
                      </p>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">
                        Please edit your billing address
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cancelEditInvoiceInfo}
                  className="flex-1 btn btn-outline disabled:text-black/50"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveInvoiceInfo}
                  disabled={!userEmail || !billingAddress}
                  className="flex-1 btn text-white btn-primary disabled:text-black/50"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Billing Address Drawer (opens over Invoice drawer) */}
      {showBillingDrawer && (
        <>
          <div
            className={`fixed inset-0 bg-black/10 bg-opacity-50 z-60 transition-opacity duration-300 ${
              isClosingBilling ? "opacity-0" : "opacity-100"
            }`}
            onClick={cancelEditBillingAddress}
          />
          <div
            className={`fixed right-0 top-0 h-full w-full max-w-[300px] sm:max-w-sm bg-white animate-slide-in-right shadow-2xl z-70 overflow-y-auto hide-scrollbar transition-transform duration-300 ease-in-out ${
              isClosingBilling ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Billing Address</h2>
                <button
                  onClick={cancelEditBillingAddress}
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
                        tempBillingAddress === addr._id
                          ? "border-primary bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setTempBillingAddress(addr._id)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={tempBillingAddress === addr._id}
                          onChange={() => setTempBillingAddress(addr._id)}
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
                          <p className="text-xs text-gray-500 mt-1">
                            {addr.thana} - {addr.district} - {addr.region}
                          </p>
                          {addr.isDefaultBilling && (
                            <span className="text-xs text-blue-600 mt-1 inline-block">
                              Default Billing Address
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
                  onClick={cancelEditBillingAddress}
                  className="flex-1 btn disabled:text-black/50"
                  disabled={setDefaultBillingMutation.isPending}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveBillingAddress}
                  disabled={
                    setDefaultBillingMutation.isPending || !tempBillingAddress
                  }
                  className="flex-1 btn text-white btn-primary disabled:text-black/50"
                >
                  {setDefaultBillingMutation.isPending ? (
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
