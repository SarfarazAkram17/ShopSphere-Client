const SHOP_CART_KEY = "shopsphere_shop_cart";
const SHOP_CART_TIMESTAMP_KEY = "shopsphere_shop_cart_timestamp";
const SHOP_CART_EXPIRY_TIME = 10 * 60 * 1000 + 1000; // 10 minutes 1 second

// ============== SHOP CART (BUY NOW) FUNCTIONS ==============

export function saveShopCart(items, userEmail = null) {
  if (typeof window === "undefined") return;
  const cartKey = userEmail ? `${SHOP_CART_KEY}_${userEmail}` : SHOP_CART_KEY;
  const timestampKey = userEmail
    ? `${SHOP_CART_TIMESTAMP_KEY}_${userEmail}`
    : SHOP_CART_TIMESTAMP_KEY;

  localStorage.setItem(cartKey, JSON.stringify(items));
  localStorage.setItem(timestampKey, Date.now().toString());
}

export function getShopCart(userEmail = null) {
  if (typeof window === "undefined") return null;

  const cartKey = userEmail ? `${SHOP_CART_KEY}_${userEmail}` : SHOP_CART_KEY;
  const timestampKey = userEmail
    ? `${SHOP_CART_TIMESTAMP_KEY}_${userEmail}`
    : SHOP_CART_TIMESTAMP_KEY;

  const shopCart = localStorage.getItem(cartKey);
  const timestamp = localStorage.getItem(timestampKey);

  if (!shopCart || !timestamp) {
    clearShopCart(userEmail);
    return null;
  }

  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(timestamp);

  if (elapsedTime > SHOP_CART_EXPIRY_TIME) {
    clearShopCart(userEmail);
    return null;
  }

  return JSON.parse(shopCart);
}

export function removeShopCartItem(itemToRemove, userEmail = null) {
  if (typeof window === "undefined") return false;

  const cartKey = userEmail ? `${SHOP_CART_KEY}_${userEmail}` : SHOP_CART_KEY;
  const timestampKey = userEmail
    ? `${SHOP_CART_TIMESTAMP_KEY}_${userEmail}`
    : SHOP_CART_TIMESTAMP_KEY;

  // Get current shop cart
  const shopCart = getShopCart(userEmail);

  if (!shopCart || shopCart.length === 0) {
    return false;
  }

  // Filter out the item to remove
  // Match by productId, color (if exists), and size (if exists)
  const updatedShopCart = shopCart.filter((item) => {
    // If productIds don't match, keep the item
    if (item.productId !== itemToRemove.productId) {
      return true;
    }

    // ProductIds match, now check color and size
    const colorMatch = item.color === itemToRemove.color;
    const sizeMatch = item.size === itemToRemove.size;

    // Keep item only if color OR size doesn't match
    // Remove item if both color AND size match (or both are undefined)
    return !(colorMatch && sizeMatch);
  });

  // If no items left, clear the shop cart completely
  if (updatedShopCart.length === 0) {
    clearShopCart(userEmail);
    return true;
  }

  // Save updated shop cart and preserve the original timestamp
  const timestamp = localStorage.getItem(timestampKey);
  localStorage.setItem(cartKey, JSON.stringify(updatedShopCart));

  // Preserve the original timestamp so the timer continues correctly
  if (timestamp) {
    localStorage.setItem(timestampKey, timestamp);
  }

  return true;
}

export function clearShopCart(userEmail = null) {
  if (typeof window === "undefined") return;

  const cartKey = userEmail ? `${SHOP_CART_KEY}_${userEmail}` : SHOP_CART_KEY;
  const timestampKey = userEmail
    ? `${SHOP_CART_TIMESTAMP_KEY}_${userEmail}`
    : SHOP_CART_TIMESTAMP_KEY;

  localStorage.removeItem(cartKey);
  localStorage.removeItem(timestampKey);
}

export function isShopCartValid(userEmail = null) {
  if (typeof window === "undefined") return false;

  const timestampKey = userEmail
    ? `${SHOP_CART_TIMESTAMP_KEY}_${userEmail}`
    : SHOP_CART_TIMESTAMP_KEY;
  const timestamp = localStorage.getItem(timestampKey);
  if (!timestamp) return false;

  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(timestamp);

  return elapsedTime <= SHOP_CART_EXPIRY_TIME;
}

export function getShopCartRemainingTime(userEmail = null) {
  if (typeof window === "undefined") return 0;

  const timestampKey = userEmail
    ? `${SHOP_CART_TIMESTAMP_KEY}_${userEmail}`
    : SHOP_CART_TIMESTAMP_KEY;
  const timestamp = localStorage.getItem(timestampKey);
  if (!timestamp) return 0;

  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(timestamp);
  const remainingTime = SHOP_CART_EXPIRY_TIME - elapsedTime;

  return remainingTime > 0 ? remainingTime : 0;
}