export const groupCartItemsByStore = (cartItems) => {
  return cartItems.reduce((acc, item) => {
    const storeId = item.product?.storeId || "unknown";
    const storeName = item.product?.storeName || "Unknown Store";
    const storeInfo = item.product?.storeInfo;

    if (!acc[storeId]) {
      acc[storeId] = {
        storeName,
        storeInfo,
        items: [],
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {});
};

export const calculateItemPrice = (item) => {
  if (!item?.product) return 0;
  const price =
    item.product.discount > 0
      ? item.product.price - (item.product.price * item.product.discount) / 100
      : item.product.price;
  return price;
};

export const calculateDeliveryCharge = (shippingDistrict, storeDistrict) => {
  return shippingDistrict === storeDistrict ? 80 : 150;
};

export const calculateCartTotals = (
  cartItems,
  groupedByStore,
  shippingAddress
) => {
  const itemsTotal = cartItems.reduce((sum, item) => {
    const price = calculateItemPrice(item);
    return sum + price * item.quantity;
  }, 0);

  const deliveryTotal = Object.entries(groupedByStore).reduce(
    // eslint-disable-next-line no-unused-vars
    (sum, [storeId, storeData]) => {
      const deliveryCharge = calculateDeliveryCharge(
        shippingAddress?.district,
        storeData.storeInfo?.district
      );
      return sum + deliveryCharge;
    },
    0
  );

  return {
    itemsTotal,
    deliveryTotal,
    total: itemsTotal + deliveryTotal,
  };
};

export const prepareOrderData = (
  userEmail,
  shippingAddress,
  billingAddress,
  groupedByStore,
  totals
) => {
  const stores = Object.entries(groupedByStore).map(([storeId, storeData]) => {
    const storeItems = storeData.items.map((item) => {
      const unitPrice = item.product.price;
      const discount = item.product.discount || 0;
      const discountedPrice =
        discount > 0 ? unitPrice - (unitPrice * discount) / 100 : unitPrice;
      const subtotal = discountedPrice * item.quantity;

      return {
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.image,
        color: item.color || null,
        size: item.size || null,
        quantity: item.quantity,
        unitPrice,
        discount,
        discountedPrice: Number(discountedPrice.toFixed(2)),
        subtotal: Number(subtotal.toFixed(2)),
      };
    });

    const storeTotal = storeItems.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryCharge = calculateDeliveryCharge(
      shippingAddress.district,
      storeData.storeInfo?.district
    );
    const platformCommission = 10;
    const platformCommissionAmount = (storeTotal * platformCommission) / 100;
    const sellerAmount = storeTotal - platformCommissionAmount;
    const riderAmount = deliveryCharge === 80 ? 70 : 50;

    return {
      storeId,
      storeName: storeData.storeName,
      storeEmail: storeData.storeInfo?.storeEmail || "",
      storeOrderStatus: "pending",
      items: storeItems,
      deliveryCharge,
      storeTotal: Number(parseFloat(storeTotal).toFixed(2)),
      platformCommission,
      platformCommissionAmount: Number(platformCommissionAmount.toFixed(2)),
      sellerAmount: Number(sellerAmount.toFixed(2)),
      riderAmount,
    };
  });

  return {
    customerEmail: userEmail,
    orderStatus: "pending",
    paymentStatus: "unpaid",
    shippingAddress: {
      name: shippingAddress.name,
      phone: shippingAddress.phone,
      email: shippingAddress.email || userEmail,
      address: shippingAddress.address,
      building: shippingAddress.building || "",
      thana: shippingAddress.thana,
      district: shippingAddress.district,
      region: shippingAddress.region,
      label: shippingAddress.label,
    },
    billingAddress: {
      name: billingAddress.name,
      phone: billingAddress.phone,
      email: billingAddress.email || userEmail,
      address: billingAddress.address,
      building: billingAddress.building || "",
      thana: billingAddress.thana,
      district: billingAddress.district,
      region: billingAddress.region,
      label: billingAddress.label,
    },
    stores,
    itemsTotal: Number(totals.itemsTotal.toFixed(2)),
    totalDeliveryCharge: totals.deliveryTotal,
    totalAmount: Number((totals.total + 20).toFixed(2)),
    paymentMethod: "cash_on_delivery",
    cashPaymentFee: 20,
    transactionId: null,
  };
};

export const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};