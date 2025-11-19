import { FaRegTrashAlt } from "react-icons/fa";

const OrderItemCard = ({ item, calculateItemPrice, onRemove }) => {
  const price = calculateItemPrice(item);
  const originalPrice = item.product?.price || 0;

  return (
    <div className="flex gap-4 border-t pt-4 first:border-t-0 first:pt-0">
      <img
        src={item.product?.image}
        alt={item.product?.name || "Product"}
        className="w-24 h-24 object-contain rounded"
      />
      <div className="flex-1">
        <h3 className="text-sm font-medium mb-1">{item.product?.name}</h3>
        <p className="text-xs text-gray-500 mb-2 flex gap-1.5 items-center flex-wrap">
          {item.color && (
            <span className="capitalize">
              Color: {item.color} {item.size && ", "}
            </span>
          )}
          {item.size && <span className="capitalize">Size: {item.size}</span>}
        </p>
        <div className="flex items-center gap-3">
          <p className="text-orange-500 font-semibold">৳ {price.toFixed(2)}</p>
          {item.product?.discount > 0 && (
            <>
              <p className="text-gray-400 line-through text-sm">
                ৳ {originalPrice}
              </p>
              <p className="text-sm text-gray-600">-{item.product.discount}%</p>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item)}
          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          <FaRegTrashAlt size={18} />
        </button>
        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
      </div>
    </div>
  );
};

export default OrderItemCard;