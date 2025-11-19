const PaymentSummary = ({ totals, cartItems, selectedPaymentMethod }) => {
  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const cashPaymentFee = selectedPaymentMethod === "cod" ? 20 : 0;
  const finalTotal = totals.total + cashPaymentFee;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 sticky top-18">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">
            Subtotal ({totalItems} items and shipping fee included)
          </span>
          <span className="font-semibold">৳ {totals.total.toFixed(2)}</span>
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
            ৳ {finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        By proceeding, you agree to ShopSphere's Terms and Conditions
      </div>
    </div>
  );
};

export default PaymentSummary;