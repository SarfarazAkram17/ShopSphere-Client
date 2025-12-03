import { Link, useLocation, useNavigate } from "react-router";
import { PiShoppingCartBold } from "react-icons/pi";
import { ConfigProvider, Rate } from "antd";
import useAuth from "../../../Hooks/useAuth";
import { toast } from "react-toastify";
import useUserRole from "../../../Hooks/useUserRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useCartCount } from "../../../Hooks/useCartCount";
import { useEffect, useState } from "react";
import LazyImage from "../../LazyImage/LazyImage";

const ProductCard = ({ product, discountedPrice }) => {
  const { user, userEmail } = useAuth();
  const { roleLoading, role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
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
  }, [cartData, product._id, product.stock]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", { state: location.pathname });
      toast.info("Please login first");
      return;
    }

    if (!roleLoading && role !== "customer") {
      toast.info("You are not allowed to add products to cart");
      return;
    }

    if (maxQuantity === 0) {
      toast.error("This product is already at maximum quantity in your cart");
      return;
    }

    try {
      const requestBody = {
        productId: product._id,
        quantity: 1,
      };

      if (product.color && product.color.length > 0) {
        requestBody.color = product.color[0];
      }

      if (product.size && product.size.length > 0) {
        requestBody.size = product.size[0];
      }

      await axiosSecure.post(`/cart/add?email=${userEmail}`, requestBody);

      toast.success("Product added to cart!");
      refetch();
    } catch (error) {
      if (error.response?.data?.availableToAdd !== undefined) {
        const { availableToAdd, existingQuantity, totalStock } =
          error.response.data;
        toast.error(
          `Cannot add item. Only ${availableToAdd} more available (${existingQuantity} already in cart, ${totalStock} total stock)`
        );
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add product to cart"
        );
      }
    }
  };

  const isOutOfStock = product.stock <= 0;
  const isMaxedInCart = maxQuantity === 0;

  const getButtonText = () => {
    if (isOutOfStock) return "Out of Stock";
    if (isMaxedInCart) return "Max in Cart";
    return "Add to Cart";
  };

  return (
    <div className="border group rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500 h-full flex flex-col">
      {/* Using LazyImage Component */}
      <div className="relative">
        <LazyImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-56 sm:h-64 group-hover:scale-108 transition-all duration-300"
          rootMargin="100px"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-secondary text-white text-xs font-semibold px-2 py-1 rounded-full shadow z-3">
            {product.discount}% off
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="text-lg font-semibold text-primary line-clamp-1"
          title={product.name}
        >
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {product.description}
        </p>

        <p className="text-sm my-2">
          <strong>Price:</strong>{" "}
          {product.discount > 0 ? (
            <>
              <span className="text-green-600 font-semibold">
                ৳{discountedPrice.toFixed(2)}
              </span>{" "}
              <span className="line-through text-xs text-gray-400 mr-2">
                ৳{product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-green-600 font-semibold">
              ৳{product.price.toFixed(2)}
            </span>
          )}
        </p>

        <ConfigProvider
          theme={{
            components: {
              Rate: {
                starBg: "#B5B7B770",
                starSize: 17,
                marginXS: 2,
              },
            },
          }}
        >
          <Rate allowHalf disabled defaultValue={product.rating} />
        </ConfigProvider>

        {maxQuantity < product.stock && maxQuantity > 0 && (
          <p className="text-xs text-orange-600 mt-2">
            {product.stock - maxQuantity} already in cart
          </p>
        )}

        <div className="mt-auto flex justify-between items-center pt-5">
          <Link to={`/products/${product._id}`}>
            <button className="btn btn-sm btn-outline btn-primary hover:text-white">
              Details
            </button>
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isMaxedInCart}
            className="btn btn-sm btn-outline btn-secondary hover:text-white disabled:text-black/50"
          >
            <PiShoppingCartBold size={18} className="mr-1" /> {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;