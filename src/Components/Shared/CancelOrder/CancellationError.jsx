import { FiXCircle } from "react-icons/fi";

const CancellationError = ({ order, onBackClick }) => {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <FiXCircle className="mx-auto text-red-500 text-5xl mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">
          Cannot Cancel Order
        </h2>
        <p className="text-red-700 mb-4">
          This order cannot be cancelled because it has been{" "}
          {order?.orderStatus} or payment is already completed, or all items are
          already cancelled.
        </p>
        <button onClick={onBackClick} className="btn btn-error text-white px-8">
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default CancellationError;