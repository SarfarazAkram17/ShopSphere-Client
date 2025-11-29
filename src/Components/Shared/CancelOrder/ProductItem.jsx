import { FiXCircle } from "react-icons/fi";
import { formatDate, generateItemKey } from "../../../lib/cancelOrder";
import LazyImage from "../../LazyImage/LazyImage";

const ProductItem = ({
  item,
  itemIndex,
  storeId,
  isPending,
  isSelected,
  onToggle,
}) => {
  const isCancelled = item.status === "cancelled";
  const itemKey = generateItemKey(storeId, item, itemIndex);

  const handleClick = () => {
    if (isPending) {
      onToggle(itemKey, isCancelled);
    }
  };

  return (
    <div
      className={`flex gap-3 p-3 rounded-lg border-2 transition-all relative ${
        isCancelled
          ? "border-red-300 bg-red-50 opacity-70"
          : isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-gray-50"
      } ${!isPending || isCancelled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={handleClick}
    >
      {/* Cancelled Badge */}
      {isCancelled && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            <FiXCircle className="text-xs" />
            Cancelled
          </span>
        </div>
      )}

      {isPending && !isCancelled && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleClick}
          className="checkbox checkbox-primary rounded text-white mt-1"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <LazyImage
        src={item.productImage}
        alt={item.productName}
        className={`w-20 h-20 object-contain rounded-lg ${
          isCancelled ? "grayscale opacity-50" : ""
        }`}
      />

      <div className="flex-1">
        <h4
          className={`font-medium mb-1 ${
            isCancelled ? "text-gray-500 line-through" : "text-gray-900"
          }`}
        >
          {item.productName}
        </h4>

        <div
          className={`flex items-center gap-2 text-sm mb-2 ${
            isCancelled ? "text-gray-600" : "text-gray-800"
          }`}
        >
          {item.color && (
            <span className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="capitalize">{item.color}</span>
            </span>
          )}
          {item.size && (
            <span>
              {item.color && "•"} Size: {item.size}
            </span>
          )}
          <span>
            {(item.color || item.size) && "•"} Qty: {item.quantity}
          </span>
        </div>

        <p
          className={`text-sm font-semibold ${
            isCancelled ? "text-gray-500 line-through" : "text-gray-900"
          }`}
        >
          ৳{item.subtotal.toFixed(2)}
        </p>

        {isCancelled && item.cancelledAt && (
          <p className="text-xs text-red-600 mt-2">
            Cancelled on {formatDate(item.cancelledAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductItem;