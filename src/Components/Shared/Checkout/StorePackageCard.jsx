import OrderItemCard from "./OrderItemCard";

const StorePackageCard = ({
  storeData,
  storeIndex,
  totalStores,
  shippingAddress,
  calculateItemPrice,
  onRemoveItem,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600">
            Package {storeIndex + 1} of {totalStores}
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Shipped by{" "}
          <span className="font-bold text-black/90">{storeData.storeName}</span>
        </p>
      </div>

      {shippingAddress && (
        <div className="border border-primary rounded-lg p-4 mb-4 w-fit">
          <div className="flex items-start gap-2 mb-2">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p className="font-medium">
                ৳{" "}
                {shippingAddress.district === storeData.storeInfo?.district
                  ? 80
                  : 150}
              </p>
              <p className="text-sm text-gray-600">Standard Delivery</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {storeData.items.map((item, itemIndex) => (
          <OrderItemCard
            key={`${item.productId}-${item.color}-${item.size}-${itemIndex}`}
            item={item}
            calculateItemPrice={calculateItemPrice}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
};

export default StorePackageCard;