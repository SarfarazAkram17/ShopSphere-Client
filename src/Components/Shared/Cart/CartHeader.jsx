import { FiTrash2 } from "react-icons/fi";

const CartHeader = ({
  cartLength,
  selectedLength,
  totalQuantity,
  onSelectAll,
  onDeleteSelected,
}) => {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 flex items-center justify-between gap-3 sm:gap-0 shadow-xl">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="checkbox rounded-[2px] checkbox-primary checkbox-sm sm:checkbox-md"
          checked={selectedLength === cartLength}
          onChange={onSelectAll}
        />
        <span className="font-medium text-xs sm:text-sm md:text-base">
          SELECT ALL ({totalQuantity} {totalQuantity === 1 ? "ITEM" : "ITEMS"})
        </span>
      </label>
      <button
        onClick={onDeleteSelected}
        className="text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-2 font-medium text-xs sm:text-sm"
      >
        <FiTrash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
        DELETE
      </button>
    </div>
  );
};

export default CartHeader;