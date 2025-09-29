const CART_KEY = "shopsphere_cart";

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
  const index = cart.findIndex(item => item.productId === productId);
  if (index >= 0) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart(cart);
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const index = cart.findIndex(item => item.productId === productId);
  if (index >= 0) {
    cart[index].quantity = quantity;
  }
  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart();
  const newCart = cart.filter(item => item.productId !== productId);
  saveCart(newCart);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}