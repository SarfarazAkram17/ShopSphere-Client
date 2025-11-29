import { FiAlertCircle } from "react-icons/fi";
import MiniLoader from "../../Loader/MiniLoader";

const CancellationSummary = ({
  selectedCount,
  refundDetails,
  onCancel,
  isLoading,
  cancellationReason,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
      <h3 className="font-bold text-gray-900 text-lg mb-4">
        Cancellation Summary
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Selected Products:</span>
          <span className="font-semibold text-gray-900">{selectedCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items Refund:</span>
          <span className="font-semibold text-gray-900">
            ৳{refundDetails.itemsRefund.toFixed(2)}
          </span>
        </div>
        {refundDetails.deliveryRefund > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Refund:</span>
            <span className="font-semibold text-gray-900">
              ৳{refundDetails.deliveryRefund.toFixed(2)}
            </span>
          </div>
        )}
        {refundDetails.cashFeeRefund > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Cash Fee Refund:</span>
            <span className="font-semibold text-gray-900">
              ৳{refundDetails.cashFeeRefund.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t mb-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Refund:</span>
          <span className="text-2xl font-bold text-error">
            ৳{refundDetails.totalRefund.toFixed(2)}
          </span>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-900">
              Selected items will be cancelled and marked in your order.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onCancel}
        disabled={selectedCount === 0 || !cancellationReason || isLoading}
        className="w-full btn btn-error text-white disabled:text-black/50"
      >
        {isLoading ? (
          <>
            <MiniLoader /> Processing...
          </>
        ) : (
          "Cancel Selected Items"
        )}
      </button>
    </div>
  );
};

export default CancellationSummary;