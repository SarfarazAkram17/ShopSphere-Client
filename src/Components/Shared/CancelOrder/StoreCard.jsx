import { generateItemKey } from "../../../lib/cancelOrder";
import ProductItem from "./ProductItem";

const StoreCard = ({
  store,
  selectedProducts,
  onToggleProduct,
  onToggleStore,
}) => {
  const isPending = store.storeOrderStatus === "pending";

  const activeItems = store.items.filter(
    (item) => !item.status || item.status !== "cancelled"
  );

  const cancelledItems = store.items.filter(
    (item) => item.status === "cancelled"
  );

  const allActiveSelected =
    isPending &&
    activeItems.length > 0 &&
    activeItems.every((item) => {
      const originalIdx = store.items.indexOf(item);
      const key = generateItemKey(store.storeId, item, originalIdx);
      return selectedProducts.has(key);
    });

  // Don't show store if all items are cancelled and store is not pending
  if (
    store.items.length === 0 ||
    (cancelledItems.length === store.items.length && !isPending)
  ) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${
        !isPending ? "opacity-60" : ""
      }`}
    >
      {/* Store Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center gap-3">
          {isPending && activeItems.length > 0 && (
            <input
              type="checkbox"
              checked={allActiveSelected}
              onChange={() => onToggleStore(store)}
              className="checkbox checkbox-primary rounded text-white"
            />
          )}
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {store.storeName}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              Status: {store.storeOrderStatus}
            </p>
            {cancelledItems.length > 0 && (
              <p className="text-xs text-red-600 mt-1">
                {cancelledItems.length} item(s) already cancelled
              </p>
            )}
          </div>
        </div>
        {!isPending && (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            Cannot Cancel
          </span>
        )}
      </div>

      {/* Products */}
      <div className="space-y-3">
        {store.items.map((item, itemIndex) => (
          <ProductItem
            key={itemIndex}
            item={item}
            itemIndex={itemIndex}
            storeId={store.storeId}
            isPending={isPending}
            isSelected={selectedProducts.has(
              generateItemKey(store.storeId, item, itemIndex)
            )}
            onToggle={onToggleProduct}
          />
        ))}
      </div>

      {/* Active Items Summary */}
      {activeItems.length > 0 && cancelledItems.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-gray-600">
            {activeItems.length} active item(s) can be cancelled
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreCard;