import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import ProductCardSkeleton from "../../../Components/Shared/ManageProducts/ProductCardSkeleton";
import ProductCard from "../../../Components/Shared/ManageProducts/ProductCard";
import Pagination from "@mui/material/Pagination";

const ManageProducts = () => {
  const { userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(0);

  // Fetch my products
  const { data, isPending, refetch } = useQuery({
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

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10">
        Manage Products
      </h2>

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-4">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No products available yet.
        </p>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                handleDelete={handleDelete}
              ></ProductCard>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-10">
            <Pagination
              count={Math.ceil(total / 12)}
              page={page + 1}
              variant="outlined"
              shape="rounded"
              color="primary"
              showFirstButton
              showLastButton
              onChange={(e, value) => setPage(value - 1)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProducts;