import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import Loader from "../../Components/Loader/Loader";
import { useAddressForm } from "../../Hooks/useAddressForm";
import { useCartManagement } from "../../Hooks/useCartManagement";
import { useCheckoutAddress } from "../../Hooks/useCheckoutAddress";
import { useCheckoutOrder } from "../../Hooks/useCheckoutOrder";
import {
  groupCartItemsByStore,
  calculateCartTotals,
  calculateItemPrice,
  formatTime,
} from "../../lib/checkoutCalculations";
// Components
import AddressModal from "../../Components/Shared/AddressBook/AddressModal";
import SessionTimer from "../../Components/Shared/Checkout/SessionTimer";
import ShippingAddressCard from "../../Components/Shared/Checkout/ShippingAddressCard";
import DeliveryInformationForm from "../../Components/Shared/Checkout/DeliveryInformationForm";
import StorePackageCard from "../../Components/Shared/Checkout/StorePackageCard";
import OrderSummary from "../../Components/Shared/Checkout/OrderSummary";
import AddressDrawer from "../../Components/Shared/Checkout/AddressDrawer";
import InvoiceDrawer from "../../Components/Shared/Checkout/InvoiceDrawer";
import PaymentSection from "../../Components/Shared/Checkout/PaymentSection";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, userEmail } = useAuth();

  // Address form management
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

  // Cart management
  const { cartItems, remainingTime, isLoading, handleRemoveItem } =
    useCartManagement();

  // Address management
  const {
    shippingAddress,
    billingAddress,
    tempShippingAddress,
    tempBillingAddress,
    showInlineAddressForm,
    showShippingDrawer,
    showInvoiceDrawer,
    showBillingDrawer,
    showAddAddressModal,
    isClosingShipping,
    isClosingInvoice,
    isClosingBilling,
    addresses,
    addressesLoading,
    addMutation,
    setDefaultShippingMutation,
    setDefaultBillingMutation,
    setTempShippingAddress,
    setTempBillingAddress,
    setShowShippingDrawer,
    setShowInvoiceDrawer,
    setShowBillingDrawer,
    setShowAddAddressModal,
    cancelEditShippingAddress,
    cancelEditBillingAddress,
    cancelEditInvoiceInfo,
  } = useCheckoutAddress(resetForm);

  // Order management
  const {
    showPaymentSection,
    createdOrder,
    selectedPaymentMethod,
    isProcessingPayment,
    setSelectedPaymentMethod,
    handleProceedToPay,
    handleConfirmOrder,
    handlePaymentSuccess,
  } = useCheckoutOrder();

  // Calculate grouped stores and totals
  const groupedByStore = groupCartItemsByStore(cartItems);
  const totals = calculateCartTotals(
    cartItems,
    groupedByStore,
    shippingAddress
  );

  // Handle inline address form submission
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

  // Handle shipping address save
  const handleSaveShippingAddress = () => {
    if (!tempShippingAddress) {
      toast.warn("Please select an address");
      return;
    }

    setDefaultShippingMutation.mutate(tempShippingAddress);
  };

  // Handle billing address save
  const handleSaveBillingAddress = () => {
    if (!tempBillingAddress) {
      toast.warn("Please select a billing address");
      return;
    }

    setDefaultBillingMutation.mutate(tempBillingAddress);
  };

  // Handle invoice info save
  const handleSaveInvoiceInfo = () => {
    if (!userEmail) {
      toast.warn("Please enter email address");
      return;
    }

    if (!billingAddress) {
      toast.warn("Please select a billing address");
      return;
    }

    toast.success("Invoice information updated successfully");
    setShowInvoiceDrawer(false);
  };

  if (!user) {
    toast.error("Please login first!");
    navigate("/login");
    return null;
  }

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
    <div className="bg-gray-50">
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
              onProceedToPay={() =>
                handleProceedToPay(
                  shippingAddress,
                  billingAddress,
                  cartItems,
                  groupedByStore,
                  totals
                )
              }
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