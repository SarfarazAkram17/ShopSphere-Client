import OrderItemCard from "./OrderItemCard";

const StorePackageCard = ({
  storeData,
  storeIndex,
  totalStores,
  shippingAddress,
  calculateItemPrice,
  onRemoveItem,
}) => {
  // Calculate delivery date range
  const getDeliveryDateRange = (isSameDistrict) => {
    const today = new Date();
    const startDay = isSameDistrict ? 1 : 7;
    const endDay = isSameDistrict ? 3 : 10;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() + startDay);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + endDay);

    const formatDate = (date) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const isSameDistrict =
    shippingAddress?.district === storeData.storeInfo?.district;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-0 sm:justify-between sm:items-center mb-4">
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
              <p className="font-medium">৳ {isSameDistrict ? 80 : 150}</p>
              <p className="text-sm text-gray-600">Standard Delivery</p>
              <p className="text-sm text-gray-600">
                Guaranteed by {getDeliveryDateRange(isSameDistrict)}
              </p>
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