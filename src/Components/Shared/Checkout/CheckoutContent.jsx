import SessionTimer from "./SessionTimer";
import ShippingAddressCard from "./ShippingAddressCard";
import DeliveryInformationForm from "./DeliveryInformationForm";
import StorePackageCard from "./StorePackageCard";
import OrderSummary from "./OrderSummary";
import { calculateItemPrice } from "../../../lib/checkoutCalculations";

const CheckoutContent = ({
  remainingTime,
  formatTime,
  shippingAddress,
  showInlineAddressForm,
  setShowShippingDrawer,
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
  groupedByStore,
  handleRemoveItem,
  totals,
  cartItems,
  billingAddress,
  handleProceedToPay,
  setShowInvoiceDrawer,
  isCreatingOrder
}) => {
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
              onProceedToPay={handleProceedToPay}
              onEditInvoice={() => setShowInvoiceDrawer(true)}
              isCreatingOrder={isCreatingOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;