import AddressModal from "../AddressBook/AddressModal";
import AddressDrawer from "./AddressDrawer";
import InvoiceDrawer from "./InvoiceDrawer";

const CheckoutModals = ({
  // Shipping drawer
  showShippingDrawer,
  isClosingShipping,
  tempShippingAddress,
  setTempShippingAddress,
  handleSaveShippingAddress,
  cancelEditShippingAddress,
  setDefaultShippingMutation,

  // Billing drawer
  showBillingDrawer,
  isClosingBilling,
  tempBillingAddress,
  setTempBillingAddress,
  handleSaveBillingAddress,
  cancelEditBillingAddress,
  setDefaultBillingMutation,

  // Invoice drawer
  showInvoiceDrawer,
  isClosingInvoice,
  userEmail,
  billingAddress,
  setShowBillingDrawer,
  handleSaveInvoiceInfo,
  cancelEditInvoiceInfo,

  // Add address modal
  showAddAddressModal,
  setShowAddAddressModal,
  formData,
  setFormData,
  selectedRegion,
  selectedDistrict,
  selectedThana,
  regions,
  districts,
  thanas,
  handleRegionChange,
  handleDistrictChange,
  handleThanaChange,
  handleAddInlineAddress,
  addMutation,

  // Common
  addresses,
}) => {
  return (
    <>
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
    </>
  );
};

export default CheckoutModals;