const CART_KEY = "shopsphere_cart";
const SHOP_CART_KEY = "shopsphere_shop_cart";
const SHOP_CART_TIMESTAMP_KEY = "shopsphere_shop_cart_timestamp";
const SHOP_CART_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

// Helper function to get user-specific key
const getUserSpecificKey = (baseKey, userId) => {
  return userId ? `${baseKey}_${userId}` : baseKey;
};

// ============== REGULAR CART FUNCTIONS ==============

export function getCart(userId = null) {
  if (typeof window === "undefined") return [];
  const key = getUserSpecificKey(CART_KEY, userId);
  const cart = localStorage.getItem(key);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart, userId = null) {
  if (typeof window === "undefined") return;
  const key = getUserSpecificKey(CART_KEY, userId);
  localStorage.setItem(key, JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1, userId = null) {
  const cart = getCart(userId);
  const index = cart.findIndex((item) => item.productId === productId);
  if (index >= 0) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart(cart, userId);
}

export function updateCartQuantity(productId, quantity, userId = null) {
  const cart = getCart(userId);
  const index = cart.findIndex((item) => item.productId === productId);
  if (index >= 0) {
    cart[index].quantity = quantity;
  }
  saveCart(cart, userId);
}

export function removeFromCart(productId, userId = null) {
  const cart = getCart(userId);
  const newCart = cart.filter((item) => item.productId !== productId);
  saveCart(newCart, userId);
}

export function clearCart(userId = null) {
  if (typeof window === "undefined") return;
  const key = getUserSpecificKey(CART_KEY, userId);
  localStorage.removeItem(key);
}

// ============== SHOP CART (BUY NOW) FUNCTIONS ==============

export function saveShopCart(items, userId = null) {
  if (typeof window === "undefined") return;
  const cartKey = getUserSpecificKey(SHOP_CART_KEY, userId);
  const timestampKey = getUserSpecificKey(SHOP_CART_TIMESTAMP_KEY, userId);
  
  localStorage.setItem(cartKey, JSON.stringify(items));
  localStorage.setItem(timestampKey, Date.now().toString());
}

export function getShopCart(userId = null) {
  if (typeof window === "undefined") return null;

  const cartKey = getUserSpecificKey(SHOP_CART_KEY, userId);
  const timestampKey = getUserSpecificKey(SHOP_CART_TIMESTAMP_KEY, userId);
  
  const shopCart = localStorage.getItem(cartKey);
  const timestamp = localStorage.getItem(timestampKey);

  // If no shop cart exists
  if (!shopCart || !timestamp) {
    clearShopCart(userId);
    return null;
  }

  // Check if expired (10 minutes)
  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(timestamp);

  if (elapsedTime > SHOP_CART_EXPIRY_TIME) {
    clearShopCart(userId);
    return null;
  }

  return JSON.parse(shopCart);
}

export function clearShopCart(userId = null) {
  if (typeof window === "undefined") return;
  const cartKey = getUserSpecificKey(SHOP_CART_KEY, userId);
  const timestampKey = getUserSpecificKey(SHOP_CART_TIMESTAMP_KEY, userId);
  
  localStorage.removeItem(cartKey);
  localStorage.removeItem(timestampKey);
}

export function isShopCartValid(userId = null) {
  if (typeof window === "undefined") return false;

  const timestampKey = getUserSpecificKey(SHOP_CART_TIMESTAMP_KEY, userId);
  const timestamp = localStorage.getItem(timestampKey);
  if (!timestamp) return false;

  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(timestamp);

  return elapsedTime <= SHOP_CART_EXPIRY_TIME;
}

export function getShopCartRemainingTime(userId = null) {
  if (typeof window === "undefined") return 0;

  const timestampKey = getUserSpecificKey(SHOP_CART_TIMESTAMP_KEY, userId);
  const timestamp = localStorage.getItem(timestampKey);
  if (!timestamp) return 0;

  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(timestamp);
  const remainingTime = SHOP_CART_EXPIRY_TIME - elapsedTime;

  return remainingTime > 0 ? remainingTime : 0;
}

// ============== UTILITY FUNCTIONS ==============

// Clear all cart data for a specific user (useful on logout)
export function clearAllUserData(userId) {
  if (typeof window === "undefined") return;
  
  clearCart(userId);
  clearShopCart(userId);
}

// Get cart count for badge display
export function getCartCount(userId = null) {
  const cart = getCart(userId);
  return cart.reduce((total, item) => total + item.quantity, 0);
}