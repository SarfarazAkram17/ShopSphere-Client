import { Link } from "react-router";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import LazyImage from "../../LazyImage/LazyImage";

const ProductCard = ({ product, handleDelete }) => {
  return (
    <div className="border h-full rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500">
      <LazyImage
        src={product.images[0]}
        alt={product.name}
        className="w-full h-52 sm:h-60"
        rootMargin="100px"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-semibold text-primary">{product.name}</h3>

        <p className="text-xs text-gray-500">
          <strong>Added On:</strong>{" "}
          {new Date(product.addedAt).toLocaleString("en-BD")}
        </p>

        <p className="text-sm text-gray-600">{product.description}</p>

        <p className="text-sm">
          <strong>Price:</strong> ৳ {product.price.toFixed(2)}
        </p>

        <p className="text-sm">
          <strong>Stock:</strong>{" "}
          <span className="text-green-600 font-semibold">{product.stock}</span>
        </p>

        <p className="text-sm">
          <strong>Discount:</strong> {product.discount}%
        </p>

        {product.color && product.color.length > 0 && (
          <p className="text-sm capitalize">
            <strong>Color(s):</strong> {product.color.join(", ")}
          </p>
        )}

        {product.size && product.size.length > 0 && (
          <p className="text-sm capitalize">
            <strong>Size:</strong> {product.size.join(", ")}
          </p>
        )}

        <p className="text-sm capitalize">
          <strong>Status:</strong>{" "}
          <span
            className={`${
              product.status === "active" ? "text-green-500" : "text-red-500"
            } font-semibold`}
          >
            {product.status}
          </span>
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Link to={`/products/${product._id}`}>
              <button className="btn btn-sm btn-outline btn-primary hover:text-white">
                <FaEye size={15} className="mr-1" /> Details
              </button>
            </Link>
            <Link to={`/dashboard/editProduct/${product._id}`}>
              <button className="btn btn-sm btn-outline btn-secondary hover:text-white">
                <FiEdit3 size={15} className="mr-1" /> Edit
              </button>
            </Link>
            <button
              onClick={() => handleDelete(product._id)}
              className="btn btn-sm btn-outline btn-error hover:text-white"
            >
              <FiTrash2 size={15} className="mr-1" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;