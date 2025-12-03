import { FiPackage } from "react-icons/fi";

const EmptyState = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <FiPackage className="mx-auto text-gray-400 mb-4" size={64} />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No orders found
      </h3>
      <p className="text-gray-600">
        You haven't received any orders yet. Orders will appear here when
        customers purchase your products.
      </p>
    </div>
  );
};

export default EmptyState;