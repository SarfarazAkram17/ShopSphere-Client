import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { useAddressForm } from "../../Hooks/useAddressForm";
import AddressModal from "../../Components/Shared/AddressBook/AddressModal";
import { useAddressMutations } from "../../Hooks/useAddressMutations";
import MiniLoader from "../../Components/Loader/MiniLoader";
import { useCartCount } from "../../Hooks/useCartCount";
import { StripeCardPayment } from "../../Components/Shared/Checkout/StripeCardPayment";

// Import new components
import SessionTimer from "../../Components/Shared/Checkout/SessionTimer";
import ShippingAddressCard from "../../Components/Shared/Checkout/ShippingAddressCard";
import DeliveryInformationForm from "../../Components/Shared/Checkout/DeliveryInformationForm";
import StorePackageCard from "../../Components/Shared/Checkout/StorePackageCard";
import OrderSummary from "../../Components/Shared/Checkout/OrderSummary";
import AddressDrawer from "../../Components/Shared/Checkout/AddressDrawer";
import InvoiceDrawer from "../../Components/Shared/Checkout/InvoiceDrawer";
import PaymentMethodSelector from "../../Components/Shared/Checkout/PaymentMethodSelector";
import CODInstructions from "../../Components/Shared/Checkout/CODInstructions";
import PaymentSummary from "../../Components/Shared/Checkout/PaymentSummary";
import PaymentSection from "../../Components/Shared/Checkout/PaymentSection";

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
      navigate("/dashboard/myOrders");
      setTimeout(() => {
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

  // Payment Section
  if (showPaymentSection && createdOrder) {
    return (
      <PaymentSection
        remainingTime={remainingTime}
        formatTime={formatTime}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        createdOrder={createdOrder}
        totals={totals}
        handlePaymentSuccess={handlePaymentSuccess}
        handleConfirmOrder={handleConfirmOrder}
        isProcessingPayment={isProcessingPayment}
        cartItems={cartItems}
      />
    );
  }

  // Main Checkout Section
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1500px] mx-auto px-4 py-8">
        <SessionTimer remainingTime={remainingTime} formatTime={formatTime} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address or Inline Form */}
            {shippingAddress && !showInlineAddressForm ? (
              <ShippingAddressCard
                shippingAddress={shippingAddress}
                onEdit={() => setShowShippingDrawer(true)}
              />
            ) : (
              <DeliveryInformationForm
                formData={formData}
                setFormData={setFormData}
                selectedRegion={selectedRegion}
                selectedDistrict={selectedDistrict}
                selectedThana={selectedThana}
                regions={regions}
                districts={districts}
                thanas={thanas}
                handleRegionChange={handleRegionChange}
                handleDistrictChange={handleDistrictChange}
                handleThanaChange={handleThanaChange}
                onSave={handleAddInlineAddress}
                isSubmitting={addMutation.isPending}
              />
            )}

            {/* Package Items by Store */}
            <div className="space-y-4">
              {Object.entries(groupedByStore).map(
                ([storeId, storeData], storeIndex) => (
                  <StorePackageCard
                    key={storeId}
                    storeData={storeData}
                    storeIndex={storeIndex}
                    totalStores={Object.keys(groupedByStore).length}
                    shippingAddress={shippingAddress}
                    calculateItemPrice={calculateItemPrice}
                    onRemoveItem={handleRemoveItem}
                  />
                )
              )}
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              totals={totals}
              cartItems={cartItems}
              shippingAddress={shippingAddress}
              billingAddress={billingAddress}
              onProceedToPay={handleProceedToPay}
              onEditInvoice={() => setShowInvoiceDrawer(true)}
            />
          </div>
        </div>
      </div>

      {/* Shipping Address Drawer */}
      <AddressDrawer
        isOpen={showShippingDrawer}
        isClosing={isClosingShipping}
        title="Shipping Address"
        addresses={addresses}
        selectedAddress={tempShippingAddress}
        onSelectAddress={setTempShippingAddress}
        onAddNew={() => setShowAddAddressModal(true)}
        onSave={handleSaveShippingAddress}
        onCancel={cancelEditShippingAddress}
        isSaving={setDefaultShippingMutation.isPending}
        addressType="shipping"
      />

      {/* Invoice Drawer */}
      <InvoiceDrawer
        isOpen={showInvoiceDrawer}
        isClosing={isClosingInvoice}
        userEmail={userEmail}
        billingAddress={billingAddress}
        onEditBilling={() => setShowBillingDrawer(true)}
        onSave={handleSaveInvoiceInfo}
        onCancel={cancelEditInvoiceInfo}
      />

      {/* Billing Address Drawer */}
      <AddressDrawer
        isOpen={showBillingDrawer}
        isClosing={isClosingBilling}
        title="Billing Address"
        addresses={addresses}
        selectedAddress={tempBillingAddress}
        onSelectAddress={setTempBillingAddress}
        onAddNew={() => setShowAddAddressModal(true)}
        onSave={handleSaveBillingAddress}
        onCancel={cancelEditBillingAddress}
        isSaving={setDefaultBillingMutation.isPending}
        addressType="billing"
      />

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