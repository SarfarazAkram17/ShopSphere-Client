import { BsShop } from "react-icons/bs";
import CartItem from "./CartItem";

const StoreGroup = ({
  storeId,
  storeName,
  items,
  cart,
  selectedItems,
  onStoreCheckboxChange,
  onItemSelection,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const isAllSelected = items.every((item) =>
    selectedItems.includes(cart.indexOf(item))
  );

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-xl">
      {/* Store Header */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-3 border-b">
        <input
          type="checkbox"
          className="checkbox rounded-[2px] checkbox-sm checkbox-primary"
          checked={isAllSelected}
          onChange={onStoreCheckboxChange}
        />
        <span className="font-semibold flex gap-1.5 items-center text-xs sm:text-sm md:text-base">
          <BsShop size={15} className="sm:w-[17px] sm:h-[17px]" />
          <span
            className="truncate max-w-[200px] sm:max-w-none"
            title={storeName}
          >
            {storeName}
          </span>
        </span>
      </div>

      {/* Store Items */}
      <div className="space-y-3 sm:space-y-4">
        {items.map((item) => {
          const globalIndex = cart.indexOf(item);
          return (
            <CartItem
              key={`${storeId}-${item.productId}-${item.color || "no-color"}-${
                item.size || "no-size"
              }`}
              item={item}
              isSelected={selectedItems.includes(globalIndex)}
              onToggleSelection={() => onItemSelection(globalIndex)}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StoreGroup;