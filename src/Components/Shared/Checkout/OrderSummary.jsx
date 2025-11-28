const OrderSummary = ({
  totals,
  cartItems,
  shippingAddress,
  billingAddress,
  onProceedToPay,
  onEditInvoice,
  isCreatingOrder
}) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 sticky top-18 space-y-6">
      {/* Invoice and Contact Info */}
      <div className="my-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Invoice and Contact Info</h3>
          <button
            onClick={onEditInvoice}
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
              Item{cartItems.length > 1 ? "s" : ""})
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
        onClick={onProceedToPay}
        disabled={isCreatingOrder || !shippingAddress || !billingAddress}
        className="w-full btn btn-primary text-white disabled:text-black/50 disabled:cursor-not-allowed"
      >
        Proceed to Pay (
        {cartItems.reduce((total, item) => total + (item.quantity || 0), 0)})
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
  );
};

export default OrderSummary;