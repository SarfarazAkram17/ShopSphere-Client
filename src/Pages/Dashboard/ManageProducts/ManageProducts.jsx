import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Components/Loader/Loader";
import { Pagination } from "antd";
import useAuth from "../../../Hooks/useAuth";
import { FaEye } from "react-icons/fa";

const ManageProducts = () => {
  const { userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);

  // Fetch foods
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myProducts", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/my?email=${userEmail}`, {
        params: { page, limit: 12 },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const products = data?.myProducts || [];
  const total = data?.total || 0;

  // Delete product
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(
            `/products/${id}?email=${userEmail}`
          );
          if (res.data.deletedCount) {
            Swal.fire("Deleted!", "The product has been deleted.", "success");
            refetch();
          }
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10">
        Manage Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No products available yet.
        </p>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border h-full rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-52 sm:h-60 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold text-primary">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    <strong>Added On:</strong>{" "}
                    {new Date(product.addedAt).toLocaleString("en-BD")}
                  </p>

                  <p className="text-sm text-gray-600">{product.description}</p>

                  <p className="text-sm">
                    <strong>Price:</strong> ৳ {product.price.toFixed(2)}
                  </p>

                  <p className="text-sm">
                    <strong>Stock:</strong> <span className="text-green-600 font-semibold">{product.stock}</span>
                  </p>

                  <p className="text-sm">
                    <strong>Discount:</strong> {product.discount}%
                  </p>

                  {product.color.length > 0 && (
                    <p className="text-sm capitalize">
                      <strong>Color(s):</strong> {product.color.join(", ")}
                    </p>
                  )}

                  {product.size.length > 0 && (
                    <p className="text-sm capitalize">
                      <strong>Size:</strong> {product.size.join(", ")}
                    </p>
                  )}

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
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <Pagination
              current={page}
              align="center"
              total={total}
              pageSize={12}
              showSizeChanger={false}
              onChange={(newPage) => {
                setPage(newPage);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProducts;