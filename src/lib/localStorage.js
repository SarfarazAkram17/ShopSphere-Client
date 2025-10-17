const CART_KEY = "shopsphere_cart";
const SHOP_CART_KEY = "shopsphere_shop_cart";

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

// shop cart
export function getShopCart() {
  if (typeof window === "undefined") return [];
  const data = sessionStorage.getItem(SHOP_CART_KEY);
  return data ? JSON.parse(data) : [];
}

// save multiple products to shop cart
export function saveShopCart(products = []) {
  if (typeof window === "undefined") return;
  if (!Array.isArray(products)) {
    throw new Error("saveShopCart expects an array of products");
  }

  // Add timestamp to each product
  const cartWithTimestamps = products.map((product) => ({
    ...product,
    createdAt: Date.now(),
  }));

  sessionStorage.setItem(SHOP_CART_KEY, JSON.stringify(cartWithTimestamps));
}

// clear shop cart
export function clearShopCart() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SHOP_CART_KEY);
}

// check if shop cart has any valid items
export function isShopCartValid(maxAgeMinutes = 10) {
  const cart = getShopCart();
  if (!cart.length) return false;

  const now = Date.now();
  const maxAgeMs = maxAgeMinutes * 60 * 1000;

  const validCart = cart.filter((item) => now - item.createdAt <= maxAgeMs);

  if (validCart.length !== cart.length) {
    sessionStorage.setItem(SHOP_CART_KEY, JSON.stringify(validCart));
  }

  return validCart.length > 0;
}