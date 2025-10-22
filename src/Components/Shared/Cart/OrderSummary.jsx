const OrderSummary = ({
  selectedCount,
  subtotal,
  shippingFee,
  total,
  totalQuantity,
  onCheckout,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl sticky top-4 sm:top-18">
      <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
        Order Summary
      </h2>

      {/* Subtotal */}
      <div className="flex justify-between mb-2 text-xs sm:text-sm">
        <span className="text-gray-600">
          Subtotal ({selectedCount}{" "}
          {selectedCount === 0 || selectedCount === 1 ? "Item" : "Items"})
        </span>
        <span className="font-semibold">৳ {subtotal.toFixed(2)}</span>
      </div>

      {/* Shipping Fee */}
      <div className="flex justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b text-xs sm:text-sm">
        <span className="text-gray-600">Shipping Fee</span>
        <span className="font-semibold">৳ {shippingFee}</span>
      </div>

      {/* Total */}
      <div className="flex justify-between mb-4 sm:mb-6">
        <span className="text-base sm:text-lg font-bold">Total</span>
        <span className="text-base sm:text-lg font-bold text-orange-500">
          ৳ {total.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={selectedCount === 0}
        className="btn btn-primary w-full text-white font-bold disabled:opacity-50 disabled:text-black/60 text-xs sm:text-sm md:text-base h-10 sm:h-12 min-h-[2.5rem] sm:min-h-[3rem]"
      >
        <span className="truncate">
          PROCEED TO CHECKOUT ({totalQuantity})
        </span>
      </button>
    </div>
  );
};

export default OrderSummary;