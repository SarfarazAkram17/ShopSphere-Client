import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import Loader from "../../Components/Loader/Loader";
import { useAddressForm } from "../../Hooks/useAddressForm";
import { useCartManagement } from "../../Hooks/useCartManagement";
import { useCheckoutAddress } from "../../Hooks/useCheckoutAddress";
import { useCheckoutOrder } from "../../Hooks/useCheckoutOrder";
import { useCheckoutHandlers } from "../../Hooks/useCheckoutHandlers";
import {
  groupCartItemsByStore,
  calculateCartTotals,
  formatTime,
} from "../../lib/checkoutCalculations";
import PaymentSection from "../../Components/Shared/Checkout/PaymentSection";
import CheckoutContent from "../../Components/Shared/Checkout/CheckoutContent";
import CheckoutModals from "../../Components/Shared/Checkout/CheckoutModals";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, userEmail } = useAuth();

  // Form management
  const addressForm = useAddressForm();

  // Data management
  const cart = useCartManagement();
  const address = useCheckoutAddress(addressForm.resetForm);
  const order = useCheckoutOrder();

  // Calculations
  const groupedByStore = groupCartItemsByStore(cart.cartItems);
  const totals = calculateCartTotals(
    cart.cartItems,
    groupedByStore,
    address.shippingAddress
  );

  // Handlers
  const handlers = useCheckoutHandlers({
    formData: addressForm.formData,
    userEmail,
    tempShippingAddress: address.tempShippingAddress,
    tempBillingAddress: address.tempBillingAddress,
    billingAddress: address.billingAddress,
    addMutation: address.addMutation,
    setDefaultShippingMutation: address.setDefaultShippingMutation,
    setDefaultBillingMutation: address.setDefaultBillingMutation,
    setShowInvoiceDrawer: address.setShowInvoiceDrawer,
  });

  const handleProceedToPayWrapper = () => {
    order.handleProceedToPay(
      address.shippingAddress,
      address.billingAddress,
      cart.cartItems,
      groupedByStore,
      totals
    );
  };

  // Early returns
  if (!user) {
    toast.error("Please login first!");
    navigate("/login");
    return null;
  }

  if (cart.isLoading || address.addressesLoading) {
    return <Loader />;
  }

  // Payment section
  if (order.showPaymentSection && order.createdOrder) {
    return (
      <PaymentSection
        remainingTime={cart.remainingTime}
        formatTime={formatTime}
        selectedPaymentMethod={order.selectedPaymentMethod}
        setSelectedPaymentMethod={order.setSelectedPaymentMethod}
        createdOrder={order.createdOrder}
        totals={totals}
        handlePaymentSuccess={order.handlePaymentSuccess}
        handleConfirmOrder={order.handleConfirmOrder}
        isProcessingPayment={order.isProcessingPayment}
        cartItems={cart.cartItems}
      />
    );
  }

  // Main checkout
  return (
    <>
      <CheckoutContent
        remainingTime={cart.remainingTime}
        formatTime={formatTime}
        shippingAddress={address.shippingAddress}
        showInlineAddressForm={address.showInlineAddressForm}
        setShowShippingDrawer={address.setShowShippingDrawer}
        formData={addressForm.formData}
        setFormData={addressForm.setFormData}
        selectedRegion={addressForm.selectedRegion}
        selectedDistrict={addressForm.selectedDistrict}
        selectedThana={addressForm.selectedThana}
        regions={addressForm.regions}
        districts={addressForm.districts}
        thanas={addressForm.thanas}
        handleRegionChange={addressForm.handleRegionChange}
        handleDistrictChange={addressForm.handleDistrictChange}
        handleThanaChange={addressForm.handleThanaChange}
        handleAddInlineAddress={handlers.handleAddInlineAddress}
        addMutation={address.addMutation}
        groupedByStore={groupedByStore}
        handleRemoveItem={cart.handleRemoveItem}
        totals={totals}
        cartItems={cart.cartItems}
        billingAddress={address.billingAddress}
        handleProceedToPay={handleProceedToPayWrapper}
        setShowInvoiceDrawer={address.setShowInvoiceDrawer}
      />

      <CheckoutModals
        showShippingDrawer={address.showShippingDrawer}
        isClosingShipping={address.isClosingShipping}
        tempShippingAddress={address.tempShippingAddress}
        setTempShippingAddress={address.setTempShippingAddress}
        handleSaveShippingAddress={handlers.handleSaveShippingAddress}
        cancelEditShippingAddress={address.cancelEditShippingAddress}
        setDefaultShippingMutation={address.setDefaultShippingMutation}
        showBillingDrawer={address.showBillingDrawer}
        isClosingBilling={address.isClosingBilling}
        tempBillingAddress={address.tempBillingAddress}
        setTempBillingAddress={address.setTempBillingAddress}
        handleSaveBillingAddress={handlers.handleSaveBillingAddress}
        cancelEditBillingAddress={address.cancelEditBillingAddress}
        setDefaultBillingMutation={address.setDefaultBillingMutation}
        showInvoiceDrawer={address.showInvoiceDrawer}
        isClosingInvoice={address.isClosingInvoice}
        userEmail={userEmail}
        billingAddress={address.billingAddress}
        setShowBillingDrawer={address.setShowBillingDrawer}
        handleSaveInvoiceInfo={handlers.handleSaveInvoiceInfo}
        cancelEditInvoiceInfo={address.cancelEditInvoiceInfo}
        showAddAddressModal={address.showAddAddressModal}
        setShowAddAddressModal={address.setShowAddAddressModal}
        formData={addressForm.formData}
        setFormData={addressForm.setFormData}
        selectedRegion={addressForm.selectedRegion}
        selectedDistrict={addressForm.selectedDistrict}
        selectedThana={addressForm.selectedThana}
        regions={addressForm.regions}
        districts={addressForm.districts}
        thanas={addressForm.thanas}
        handleRegionChange={addressForm.handleRegionChange}
        handleDistrictChange={addressForm.handleDistrictChange}
        handleThanaChange={addressForm.handleThanaChange}
        handleAddInlineAddress={handlers.handleAddInlineAddress}
        addMutation={address.addMutation}
        addresses={address.addresses}
      />
    </>
  );
};

export default Checkout;