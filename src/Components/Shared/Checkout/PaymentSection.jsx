import useAuth from "../../../Hooks/useAuth";
import MiniLoader from "../../Loader/MiniLoader";
import CODInstructions from "./CODInstructions";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PaymentSummary from "./PaymentSummary";
import SessionTimer from "./SessionTimer";
import { StripeCardPayment } from "./StripeCardPayment";

const PaymentSection = ({
  remainingTime,
  formatTime,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  createdOrder,
  totals,
  handlePaymentSuccess,
  handleConfirmOrder,
  isProcessingPayment,
  cartItems,
}) => {
  const { userEmail } = useAuth();

  return (
    <div className="bg-gray-50">
      <div className="max-w-[1500px] mx-auto px-4 py-8">
        <SessionTimer remainingTime={remainingTime} formatTime={formatTime} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Select Payment Method
              </h2>

              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onSelect={setSelectedPaymentMethod}
              />

              {/* Card Payment Form */}
              {selectedPaymentMethod === "card" && (
                <div className="border-t pt-6 mt-6">
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
                <div className="border-t pt-6 mt-6">
                  <CODInstructions />
                </div>
              )}

              {/* Confirm Button for COD */}
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
            <PaymentSummary
              totals={totals}
              cartItems={cartItems}
              selectedPaymentMethod={selectedPaymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;