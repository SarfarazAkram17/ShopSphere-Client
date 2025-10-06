import { useParams } from "react-router";
// import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import Loader from "../../Components/Loader/Loader";

const ProductDetails = () => {
  const { productId } = useParams();
  const axiosInstance = useAxios();
  //   const { user } = useAuth();
  //   const navigate = useNavigate();

  // Fetch Products
  const { isPending, data } = useQuery({
    queryKey: ["product-details"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${productId}`);
      return res.data;
    },
  });

//   const product = data?.product;
//   const sameStoreProducts = data?.sameStoreProducts || [];
//   const relevantProducts = data?.relevantProducts || [];

  if (isPending) {
    return <Loader></Loader>;
  }
  return (
    <section className="max-w-[1500px] mx-auto px-4">

    </section>
  );
};

export default ProductDetails;