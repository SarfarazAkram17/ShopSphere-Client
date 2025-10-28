import { FiTrash2, FiMinus, FiPlus, FiHeart } from "react-icons/fi";

const CartItem = ({
  item,
  isSelected,
  onToggleSelection,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const product = item.product;

  if (!product) return null;

  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  return (
    <div className="flex gap-2 sm:gap-3 md:gap-4 items-start sm:items-center">
      {/* Checkbox */}
      <input
        type="checkbox"
        className="checkbox rounded-[2px] checkbox-primary checkbox-sm sm:checkbox-md mt-2 sm:mt-4 flex-shrink-0"
        checked={isSelected}
        onChange={onToggleSelection}
      />

      {/* Product Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain rounded"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3
          title={product.name}
          className="font-medium text-xs sm:text-sm mb-1 line-clamp-2"
        >
          {product.name}
        </h3>

        {/* Color and Size */}
        {(item.color || item.size) && (
          <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-600 mb-2">
            {item.color && (
              <span>
                Color: <span className="capitalize">{item.color}</span>
              </span>
            )}
            {item.size && (
              <span>
                Size: <span className="uppercase">{item.size}</span>
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col mb-1">
          <span className="text-green-600 font-bold text-base">
            ৳ {discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-xs text-gray-500 line-through">
              ৳ {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Warning */}
        {product.stock < 5 && product.stock > 0 && (
          <p className="text-[10px] sm:text-xs text-red-600 font-semibold">
            Only {product.stock} left in stock
          </p>
        )}

        {/* Mobile: Quantity and Actions */}
        <div className="flex sm:hidden items-center justify-between mt-2 gap-2">
          <div className="flex items-center border border-gray-400 rounded">
            <button
              onClick={() => onUpdateQuantity(item, item.quantity - 1)}
              disabled={item.quantity === 1}
              className="px-1.5 py-0.5 disabled:opacity-40 cursor-pointer"
            >
              <FiMinus size={12} />
            </button>
            <span className="px-3 py-0.5 text-sm font-semibold border-x border-gray-500">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item, item.quantity + 1)}
              disabled={item.quantity >= product.stock}
              className="px-1.5 py-0.5 disabled:opacity-40 cursor-pointer"
            >
              <FiPlus size={12} />
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => onRemoveItem(item)}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <FiTrash2 size={16} />
            </button>
            <button title='This is static for now' className="text-gray-400 hover:text-pink-500 cursor-pointer">
              <FiHeart size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: Quantity Controls */}
      <div className="hidden sm:flex flex-col items-center gap-3 flex-shrink-0">
        <div className="flex items-center border border-gray-400 rounded">
          <button
            onClick={() => onUpdateQuantity(item, item.quantity - 1)}
            disabled={item.quantity === 1}
            className="px-2 py-1 disabled:opacity-40 cursor-pointer"
          >
            <FiMinus size={14} />
          </button>
          <span className="px-4 sm:px-5 py-1 text-base sm:text-lg font-semibold border-x border-gray-500">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item, item.quantity + 1)}
            disabled={item.quantity >= product.stock}
            className="px-2 py-1 disabled:opacity-40 cursor-pointer"
          >
            <FiPlus size={14} />
          </button>
        </div>

        {/* Desktop: Actions */}
        <div className="flex justify-center gap-3 items-center">
          <button
            onClick={() => onRemoveItem(item)}
            className="text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <FiTrash2 size={19} />
          </button>
          <button className="text-gray-400 hover:text-pink-500 cursor-pointer">
            <FiHeart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;