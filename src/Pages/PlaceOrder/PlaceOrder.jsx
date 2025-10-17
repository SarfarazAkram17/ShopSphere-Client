// import { useNavigate } from "react-router";
// import {
//   clearShopCart,
//   getShopCart,
//   isShopCartValid,
// } from "../../lib/localStorage";
// import { useEffect, useState } from "react";

import { getShopCart } from "../../lib/localStorage";

const PlaceOrder = () => {
  // const navigate = useNavigate();
  // const [shopCart, setShopCart] = useState([]);

  // useEffect(() => {
  //   const cart = getShopCart();
  //   setShopCart(cart);

  //   if (!cart.length || !isShopCartValid()) {
  //     // If cart empty or invalid, redirect to home or products
  //     navigate(-1);
  //     return;
  //   }

  //   const handleBeforeUnload = () => clearShopCart();
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     clearShopCart();
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [navigate]);

  // if (!shopCart.length) return null;

  const cart = getShopCart();
  console.log(cart);

  return (
    <div>
      place order:
      <p>{JSON.stringify(cart)}</p>
    </div>
  );
};

export default PlaceOrder;