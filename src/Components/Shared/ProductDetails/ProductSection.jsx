import { useLocation, useNavigate } from "react-router";
import { ConfigProvider, Rate } from "antd";
import { PiShoppingCartBold, PiBagBold } from "react-icons/pi";
import ShareProduct from "./ShareProduct";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";
import { saveShopCart } from "../../../lib/localStorage";
import useUserRole from "../../../Hooks/useUserRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { useCartCount } from "../../../Hooks/useCartCount";

const ProductSection = ({
  selectedImage,
  product,
  setSelectedImage,
  discountedPrice,
  displayRating,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
}) => {
  const navigate = useNavigate();
  const { user, userEmail } = useAuth();
  const { roleLoading, role } = useUserRole();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const [quantity, setQuantity] = useState(1);
  const { refetch, cartData } = useCartCount();
  const [maxQuantity, setMaxQuantity] = useState(product.stock);

  useEffect(() => {
    if (cartData && cartData.length > 0) {
      const cartQuantity = cartData
        .filter((item) => item.productId === product._id)
        .reduce((total, item) => total + item.quantity, 0);

      const available = product.stock - cartQuantity;
      setMaxQuantity(available > 0 ? available : 0);
    } else {
      setMaxQuantity(product.stock);
    }
  }, [cartData, product._id, product.stock, quantity]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", { state: location.pathname });
      toast.info("Please login first");
      return;
    }

    if (!roleLoading && role !== "customer") {
      toast.info("You are not allowded to add products on cart");
      return;
    }

    if (maxQuantity === 0) {
      toast.error("This product is already at maximum quantity in your cart");
      return;
    }

    try {
      // Prepare the request body
      const requestBody = {
        productId: product._id,
        quantity,
      };

      // Only add color if product has color options (use first color as default)
      if (product.color) {
        requestBody.color = selectedColor || product.color[0];
      }

      // Only add size if product has size options (use first size as default)
      if (product.size) {
        requestBody.size = selectedSize || product.size[0];
      }

      // Call the API to add to cart
      await axiosSecure.post(`/cart/add?email=${userEmail}`, requestBody);

      toast.success("Product added to cart!");
      refetch();
      setQuantity(1);
    } catch (error) {
      // Handle stock validation error from backend
      if (error.response?.data?.availableToAdd !== undefined) {
        const { availableToAdd, existingQuantity, totalStock } =
          error.response.data;
        toast.error(
          `Cannot add ${quantity} items. Only ${availableToAdd} more available (${existingQuantity} already in cart, ${totalStock} total stock)`
        );
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add product to cart"
        );
      }
    }
  };

  // Buy Now handler
  const handleBuyNow = () => {
    if (!user) {
      toast.info("Please login first!");
      return navigate("/login", { state: location.pathname });
    }

    if (!roleLoading && role !== "customer") {
      toast.info("You are not allowded to buy product");
      return;
    }

    const productInfo = {
      productId: product._id,
      quantity,
      storeId: product.storeId,
    };

    // Only add color if product has color options
    if (product.color) {
      productInfo.color = selectedColor || product.color[0];
    }

    // Only add size if product has size options
    if (product.size) {
      productInfo.size = selectedSize || product.size[0];
    }

    const payload = [productInfo];

    // Save to localStorage with user email
    saveShopCart(payload, userEmail);

    // Redirect to checkout page
    navigate("/checkout");
  };

  return (
    <section className="grid rounded-2xl shadow-xl px-4 py-6 grid-cols-1 md:grid-cols-2 gap-6">
      {/* product image */}
      <div>
        <div className="border relative rounded-lg overflow-hidden">
          <img
            src={selectedImage || product.images[0]}
            alt={product.name}
            className="w-full h-auto object-contain"
          />
          {product.discount > 0 && (
            <span className="absolute top-2 right-2 bg-secondary text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
              {product.discount}% OFF
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8 mt-4">
          {product.images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-auto h-24 relative cursor-pointer rounded border-2 ${
                selectedImage === img ? "border-primary" : "border-gray-300"
              }`}
            >
              <img
                src={img}
                alt="thumbnail"
                className="h-full object-contain rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* product details */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-primary">{product.name}</h2>

        {/* rating */}
        <div className="text-sm text-primary">
          <ConfigProvider
            theme={{
              components: {
                Rate: { starBg: "#B5B7B750", starSize: 20, marginXS: 2 },
              },
            }}
          >
            <Rate disabled allowHalf value={displayRating} />
          </ConfigProvider>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">
          {product.description}
        </p>

        {/* price */}
        <div>
          {product.discount > 0 ? (
            <div className="space-x-2">
              <span className="text-green-600 text-xl font-semibold">
                ৳ {discountedPrice.toFixed(2)}
              </span>
              <span className="line-through text-gray-400">
                ৳ {product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-green-600 text-xl font-semibold">
              ৳ {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* stock */}
        <p className="text-md">
          <strong>In Stock:</strong>{" "}
          {product.stock > 0 ? (
            <span className="text-green-600 font-semibold">
              {product.stock}
            </span>
          ) : (
            <span className="text-red-600 font-semibold">Out of Stock</span>
          )}
        </p>

        {/* Show available quantity if some already in cart */}
        {maxQuantity < product.stock && maxQuantity > 0 && (
          <p className="text-sm text-orange-600">
            <strong>Note:</strong> {product.stock - maxQuantity} already in your
            cart.
            {maxQuantity} more available to add.
          </p>
        )}

        {/* color */}
        {product?.color?.length > 0 && (
          <div className="text-md flex items-center">
            <strong>Colors:</strong>
            <div className="flex items-center gap-1.5 ml-2">
              {product.color.map((c, i) => (
                <div
                  key={i}
                  className={`py-1 px-4 rounded-md border-2 capitalize cursor-pointer ${
                    selectedColor === c ? "border-primary" : "border-gray-400"
                  }`}
                  onClick={() => setSelectedColor(c)}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* size */}
        {product?.size?.length > 0 && (
          <div className="text-md flex items-center">
            <strong>Sizes:</strong>
            <div className="flex items-center gap-1.5 ml-2">
              {product.size.map((s, i) => (
                <div
                  key={i}
                  className={`py-1 px-4 rounded-md border-2 capitalize cursor-pointer ${
                    selectedSize === s ? "border-primary" : "border-gray-400"
                  }`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add to Cart / Buy Now */}
        {product.stock > 0 && (
          <>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-gray-400 rounded-lg">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-xl font-bold disabled:opacity-40 cursor-pointer"
                >
                  -
                </button>
                <span className="px-5 py-1 text-lg font-semibold border-x border-gray-500">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  disabled={quantity === product.stock}
                  className="px-3 py-1 text-xl font-bold disabled:opacity-40 cursor-pointer"
                >
                  +
                </button>
              </div>

              {maxQuantity === 0 && (
                <span className="text-sm text-red-600">
                  Maximum quantity in cart
                </span>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={handleBuyNow}
                disabled={quantity > product.stock}
                className="btn btn-primary disabled:text-black/50 text-white flex items-center disabled:cursor-not-allowed"
              >
                <PiBagBold size={20} className="mr-2" /> Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                disabled={maxQuantity === 0}
                className="btn btn-secondary disabled:text-black/50 text-white flex items-center disabled:cursor-not-allowed"
              >
                <PiShoppingCartBold size={20} className="mr-2" /> Add to Cart
              </button>
            </div>
          </>
        )}

        <div className="mt-16">
          <h2 className="font-bold text-xl mb-1">Like this product?</h2>
          <p className="text-sm text-gray-600 mb-3">
            Share it with your peers!
          </p>
          <ShareProduct product={product}></ShareProduct>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;