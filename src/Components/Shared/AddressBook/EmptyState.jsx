import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";

const EmptyState = ({ onAddClick }) => {
  return (
    <div className="text-center py-15">
      <div className="bg-white rounded-2xl shadow-lg p-12 inline-block">
        <HiOutlineLocationMarker className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          No addresses yet
        </h3>
        <p className="text-gray-500 mb-6">
          Add your first address to get started
        </p>
        <button
          onClick={onAddClick}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-all cursor-pointer"
        >
          <AiOutlinePlus size={20} />
          Add New Address
        </button>
      </div>
    </div>
  );
};

export default EmptyState;