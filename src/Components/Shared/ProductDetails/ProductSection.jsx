import { useNavigate } from "react-router";
import { ConfigProvider, Rate } from "antd";
import { PiShoppingCartBold, PiBagBold } from "react-icons/pi";
import ShareProduct from "./ShareProduct";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";

const ProductSection = ({
  selectedImage,
  product,
  setSelectedImage,
  discountedPrice,
  displayRating,
  setQuantity,
  quantity,
  handleAddToCart,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="grid rounded-2xl shadow-xl px-4 py-6 grid-cols-1 md:grid-cols-2 gap-6">
      {/* product image */}
      <div>
        <div className="w-full h-64 sm:h-80 border relative rounded-lg overflow-hidden">
          <img
            src={selectedImage || product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain"
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
              className={`w-28 h-20 relative cursor-pointer rounded border-2 ${
                selectedImage === img ? "border-primary" : "border-gray-300"
              }`}
            >
              <img
                src={img}
                alt="thumbnail"
                className="h-full w-full object-contain rounded"
              />
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="font-bold text-xl mb-1">Like this product?</h2>
          <p className="text-sm text-gray-600 mb-3">
            Share it with your peers!
          </p>

          <ShareProduct product={product}></ShareProduct>
        </div>
      </div>

      {/* product details */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-primary">{product.name}</h2>

        <div className="text-sm">
          <ConfigProvider
            theme={{
              components: {
                Rate: {
                  starBg: "#B5B7B750",
                  starSize: 15,
                  marginXS: 2,
                },
              },
            }}
          >
            <Rate disabled allowHalf value={displayRating} />
          </ConfigProvider>{" "}
          {/* ( {reviewData.total} {reviewData.total > 1 ? "reviews" : "review"} ) */}
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="text-xl">
          {product.discount > 0 ? (
            <div className="space-x-2">
              <span className="text-green-600 font-semibold">
                ৳ {discountedPrice.toFixed(2)}
              </span>
              <span className="line-through text-lg text-gray-400">
                ৳ {product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-green-600 font-semibold">
              ৳ {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* stock */}
        <p className="text-md">
          <strong>In Stock:</strong>{" "}
          {product.stock ? (
            <span className="text-green-600 font-semibold">
              {product.stock}
            </span>
          ) : (
            <span className="text-red-600 font-semibold">{product.stock}</span>
          )}
        </p>

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

        {/* Quantity + Add to Cart */}
        {product.stock > 0 && (
          <>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-gray-400 rounded-lg">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity === 1}
                  className="px-3 py-2 text-xl font-bold disabled:opacity-40 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  disabled={quantity === product.stock}
                  className="px-3 py-2 text-xl font-bold disabled:opacity-40 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => {
                  if (!user) {
                    toast.info("Login first");
                    return navigate("/login", {
                      state: `/products/${product._id}`,
                    });
                  }

                  navigate("/placeOrder", {
                    state: { productId: product._id, quantity },
                  });
                }}
                className="btn btn-primary text-white flex items-center"
              >
                <PiBagBold size={20} className="mr-2" /> Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="btn btn-secondary text-white flex items-center"
              >
                <PiShoppingCartBold size={20} className="mr-2" /> Add to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
