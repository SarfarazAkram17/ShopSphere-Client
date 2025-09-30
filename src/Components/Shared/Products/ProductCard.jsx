import { Link } from "react-router";
import { PiShoppingCartBold } from "react-icons/pi";
import { ConfigProvider, Rate } from "antd";

const ProductCard = ({ product, discountedPrice, handleAddToCart }) => {
  return (
    <div className="border group h-full relative rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500">
      {/* Discount Badge */}
      {product.discount > 0 && (
        <span className="absolute top-1.5 right-1.5 bg-secondary text-white text-xs font-semibold px-2 py-1 rounded-full shadow z-3">
          {product.discount}% off
        </span>
      )}
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-52 sm:h-60 group-hover:scale-108 overflow-hidden transition-all duration-300 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-primary">{product.name}</h3>

        <p className="text-sm text-gray-600 line-clamp-3">
          {product.description}
        </p>

        <p className="text-sm">
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

        <p className="text-sm">
          <strong>Stock:</strong>{" "}
          <span className="text-green-600 font-semibold">{product.stock}</span>
        </p>

        <ConfigProvider
          theme={{
            components: {
              Rate: {
                starBg: "#B5B7B770",
                starSize: 18,
                marginXS: 2,
              },
            },
          }}
        >
          <Rate disabled defaultValue={product.rating} />
        </ConfigProvider>

        <div className="mt-4 flex justify-between items-center">
          <Link to={`/products/${product._id}`}>
            <button className="btn btn-sm btn-outline btn-primary hover:text-white">
              Details
            </button>
          </Link>

          <button
            onClick={() => handleAddToCart(product)}
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
