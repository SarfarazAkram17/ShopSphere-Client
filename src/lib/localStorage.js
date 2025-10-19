const CART_KEY = "shopsphere_cart";
const SHOP_CART_KEY = "shopsphere_shop_cart";
const SHOP_CART_TIMESTAMP_KEY = "shopsphere_shop_cart_timestamp";
const SHOP_CART_EXPIRY_TIME = 10 * 60 * 1000;

export function getCart() {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const index = cart.findIndex((item) => item.productId === productId);
  if (index >= 0) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart(cart);
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const index = cart.findIndex((item) => item.productId === productId);
  if (index >= 0) {
    cart[index].quantity = quantity;
  }
  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart();
  const newCart = cart.filter((item) => item.productId !== productId);
  saveCart(newCart);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

// ============== SHOP CART (BUY NOW) FUNCTIONS ==============

// Save shop cart with timestamp
export function saveShopCart(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SHOP_CART_KEY, JSON.stringify(items));
  localStorage.setItem(SHOP_CART_TIMESTAMP_KEY, Date.now().toString());
}

// Get shop cart with expiry check
export function getShopCart() {
  if (typeof window === "undefined") return null;

  const shopCart = localStorage.getItem(SHOP_CART_KEY);
  const timestamp = localStorage.getItem(SHOP_CART_TIMESTAMP_KEY);

  // If no shop cart exists
  if (!shopCart || !timestamp) {
    clearShopCart();
    return null;
  }

  // Check if expired (10 minutes)
  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(timestamp);

  if (elapsedTime > SHOP_CART_EXPIRY_TIME) {
    clearShopCart();
    return null;
  }

  return JSON.parse(shopCart);
}

// Clear shop cart and timestamp
export function clearShopCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SHOP_CART_KEY);
  localStorage.removeItem(SHOP_CART_TIMESTAMP_KEY);
}

// Check if shop cart is valid (not expired)
export function isShopCartValid() {
  if (typeof window === "undefined") return false;

  const timestamp = localStorage.getItem(SHOP_CART_TIMESTAMP_KEY);
  if (!timestamp) return false;

  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(timestamp);

  return elapsedTime <= SHOP_CART_EXPIRY_TIME;
}

// Get remaining time for shop cart (in milliseconds)
export function getShopCartRemainingTime() {
  if (typeof window === "undefined") return 0;

  const timestamp = localStorage.getItem(SHOP_CART_TIMESTAMP_KEY);
  if (!timestamp) return 0;

  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(timestamp);
  const remainingTime = SHOP_CART_EXPIRY_TIME - elapsedTime;

  return remainingTime > 0 ? remainingTime : 0;
}