import { FiPackage } from "react-icons/fi";

const EmptyState = () => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg p-12 text-center">
      <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No orders found
      </h3>
      <p className="text-gray-500">
        Try adjusting your filters or search query
      </p>
    </div>
  );
};

export default EmptyState;