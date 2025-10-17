import { useLocation, useNavigate, useParams } from "react-router";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import { useState } from "react";
import { addToCart } from "../../lib/localStorage";
import ProductSection from "../../Components/Shared/ProductDetails/ProductSection";
import ProductSectionSkeleton from "../../Components/Shared/ProductDetails/ProductSectionSkeleton";
import ReviewSection from "../../Components/Shared/ProductDetails/ReviewSection";
import FromSameStoreProducts from "../../Components/Shared/ProductDetails/FromSameStoreProductsSection";
import RelavantProductsSection from "../../Components/Shared/ProductDetails/RelavantProductsSection";
import ReviewSectionSkeleton from "../../Components/Shared/ProductDetails/ReviewSectionSkeleton";
import { toast } from "react-toastify";
import ProductCardSkeleton from "../../Components/Shared/Products/ProductCardSkeleton";

const ProductDetails = () => {
  const { productId } = useParams();
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch Products
  const { isPending, data } = useQuery({
    queryKey: ["product-details", productId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${productId}`);
      setSelectedImage(res.data.product?.images?.[0]);
      setSelectedColor(res.data.product?.color?.[0]);
      setSelectedSize(res.data.product?.size?.[0]);
      return res.data;
    },

    enabled: !!productId,
  });

  const product = data?.product;
  const sameStoreProducts = data?.sameStoreProducts || [];
  const relevantProducts = data?.relevantProducts || [];

  if (isPending) {
    return (
      <section className="max-w-[1500px] mx-auto px-4 space-y-4">
        <ProductSectionSkeleton></ProductSectionSkeleton>
        <ReviewSectionSkeleton></ReviewSectionSkeleton>

        <section className="rounded-2xl shadow-xl px-4 py-6">
          <div className="relative h-8 w-48 mb-6 bg-base-300 rounded overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center gap-4">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl shadow-xl px-4 py-6">
          <div className="relative h-8 w-48 mb-6 bg-base-300 rounded overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center gap-4">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </section>
    );
  }

  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: location.pathname });
      toast.info("Login first");
      return;
    }

    addToCart(product._id, quantity);
    setQuantity(1);
  };

  const roundToHalf = (num) => {
    const floor = Math.floor(num);
    const decimal = num - floor;

    if (decimal === 0) return floor;
    return floor + 0.5;
  };

  const avgRating = product.rating || 0;
  const displayRating = roundToHalf(avgRating);

  return (
    <section className="max-w-[1500px] mx-auto px-4 space-y-4">
      <ProductSection
        selectedImage={selectedImage}
        product={product}
        setSelectedImage={setSelectedImage}
        discountedPrice={discountedPrice}
        displayRating={displayRating}
        setQuantity={setQuantity}
        quantity={quantity}
        handleAddToCart={handleAddToCart}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      ></ProductSection>

      <ReviewSection></ReviewSection>

      <FromSameStoreProducts
        storeName={product.storeName}
        products={sameStoreProducts}
      ></FromSameStoreProducts>

      <RelavantProductsSection
        products={relevantProducts}
      ></RelavantProductsSection>
    </section>
  );
};

export default ProductDetails;