import { Link, useLocation, useNavigate } from "react-router";
import { PiShoppingCartBold } from "react-icons/pi";
import { ConfigProvider, Rate } from "antd";
import useAuth from "../../../Hooks/useAuth";
import { toast } from "react-toastify";
import useUserRole from "../../../Hooks/useUserRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useCartCount } from "../../../Hooks/useCartCount";

const ProductCard = ({ product, discountedPrice }) => {
  const { user, userEmail } = useAuth();
  const { roleLoading, role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const { refetch } = useCartCount();

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

    try {
      // Prepare the request body
      const requestBody = {
        productId: product._id,
        quantity: 1,
      };

      // Only add color if product has color options (use first color as default)
      if (product.color) {
        requestBody.color = product.color[0];
      }

      // Only add size if product has size options (use first size as default)
      if (product.size) {
        requestBody.size = product.size[0];
      }

      // Call the API to add to cart
      await axiosSecure.post(`/cart/add?email=${userEmail}`, requestBody);

      toast.success("Product added to cart!");
      refetch();
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className="border group rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500 h-full flex flex-col">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-56 sm:h-64 group-hover:scale-108 overflow-hidden transition-all duration-300 object-fit"
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
        <h3 className="text-lg font-semibold text-primary">{product.name}</h3>

        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {product.description}
        </p>

        <p className="text-sm my-2">
          <strong>Price:</strong> ৳{" "}
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

        {/* Buttons at the bottom */}
        <div className="mt-auto flex justify-between items-center pt-5">
          <Link to={`/products/${product._id}`}>
            <button className="btn btn-sm btn-outline btn-primary hover:text-white">
              Details
            </button>
          </Link>

          <button
            onClick={() => handleAddToCart()}
            disabled={product.stock <= 0}
            className="btn btn-sm btn-outline btn-secondary hover:text-white"
          >
            <PiShoppingCartBold size={18} className="mr-1" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;