// Generate unique key for each item (including variants)
export const generateItemKey = (storeId, item, itemIndex) => {
  return `${storeId}_${item.productId}_${itemIndex}`;
};

// Calculate refund based on selected products
export const calculateRefund = (order, selectedProducts) => {
  if (!order) return { itemsRefund: 0, deliveryRefund: 0, totalRefund: 0 };

  let itemsRefund = 0;
  let deliveryRefund = 0;

  order.stores.forEach((store) => {
    if (store.storeOrderStatus !== "pending") return;

    // Get selected items from this store
    const selectedStoreItems = store.items.filter((item, idx) => {
      const key = generateItemKey(store.storeId, item, idx);
      return (
        selectedProducts.has(key) &&
        (!item.status || item.status !== "cancelled")
      );
    });

    // Calculate items refund
    const storeItemsTotal = selectedStoreItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    itemsRefund += storeItemsTotal;

    // Check if all active items from this store are selected
    const activeItems = store.items.filter(
      (item) => !item.status || item.status !== "cancelled"
    );

    const allActiveSelected = activeItems.every((item) => {
      const originalIdx = store.items.findIndex(
        (i, originalIdx) =>
          i === item && originalIdx === store.items.indexOf(item)
      );
      const key = generateItemKey(store.storeId, item, originalIdx);
      return selectedProducts.has(key);
    });

    if (allActiveSelected && activeItems.length > 0) {
      deliveryRefund += store.deliveryCharge;
    }
  });

  // Add cash payment fee if entire order is cancelled
  let cashFeeRefund = 0;
  const allPendingProductsSelected = order.stores
    .filter((store) => store.storeOrderStatus === "pending")
    .every((store) => {
      const activeItems = store.items.filter(
        (item) => !item.status || item.status !== "cancelled"
      );

      return (
        activeItems.length > 0 &&
        activeItems.every((item) => {
          const originalIdx = store.items.findIndex(
            (i, originalIdx) =>
              i === item && originalIdx === store.items.indexOf(item)
          );
          const key = generateItemKey(store.storeId, item, originalIdx);
          return selectedProducts.has(key);
        })
      );
    });

  if (allPendingProductsSelected && order.cashPaymentFee) {
    cashFeeRefund = order.cashPaymentFee;
  }

  return {
    itemsRefund,
    deliveryRefund,
    cashFeeRefund,
    totalRefund: itemsRefund + deliveryRefund + cashFeeRefund,
  };
};