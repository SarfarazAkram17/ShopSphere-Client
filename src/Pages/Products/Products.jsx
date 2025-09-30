import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pagination, Drawer } from "antd";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import ProductCardSkeleton from "../../Components/Shared/Products/ProductCardSkeleton";
import ProductCard from "../../Components/Shared/Products/ProductCard";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { addToCart } from "../../lib/cartUtils";
import { RiMenuSearchLine } from "react-icons/ri";
import RenderFilters from "../../lib/RenderFilters";

const Products = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [discount, setDiscount] = useState(null);
  const [rating, setRating] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch Products
  const { isPending, data } = useQuery({
    queryKey: [
      "products-all",
      page,
      search,
      category,
      color,
      size,
      priceRange,
      discount,
      rating,
    ],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/all`, {
        params: {
          page,
          limit: 24,
          search,
          category: category.join(","),
          color,
          size,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          discount,
          minRating: rating,
        },
      });
      return res.data;
    },
  });

  const products = data?.allProducts || [];
  const total = data?.total || 0;

  // Static filter options
  const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Clothing", value: "clothing" },
    { label: "Books", value: "books" },
    { label: "Home & Kitchen", value: "home & kitchen" },
    { label: "Beauty", value: "beauty" },
    { label: "Sports", value: "sports" },
    { label: "Toys", value: "toys" },
  ];

  const discounts = [
    { label: "5% or more", value: 5 },
    { label: "10% or more", value: 10 },
    { label: "20% or more", value: 20 },
    { label: "30% or more", value: 30 },
    { label: "40% or more", value: 40 },
    { label: "50% or more", value: 50 },
  ];

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: location.pathname });
      toast.info("Login first");
      return;
    }
    addToCart(product._id);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4">
      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-primary">
        Products
      </h2>
      <p className="text-center text-xs xl:text-sm text-gray-600 mb-8 xl:max-w-4xl max-w-3xl mx-auto">
        Browse through our wide selection of products, from toys and electronics
        to clothing and books. Easily filter by category, color, size, price,
        discount, and rating to find exactly what you need. Enjoy a smooth
        shopping experience and discover the perfect items for yourself or your
        loved ones.
      </p>

      {/* Filters */}
      <div className="hidden md:block">
        <RenderFilters
          search={search}
          setSearch={setSearch}
          categories={categories}
          category={category}
          setCategory={setCategory}
          color={color}
          setColor={setColor}
          size={size}
          setSize={setSize}
          setPriceRange={setPriceRange}
          discounts={discounts}
          setDiscount={setDiscount}
          setRating={setRating}
        ></RenderFilters>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="flex md:hidden items-center gap-2 mb-4">
        <label className="input input-bordered w-full h-9.5">
          <input
            type="search"
            required
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button onClick={() => setDrawerOpen(true)} className="btn rounded-sm">
          <RiMenuSearchLine size={20} />
        </button>
      </div>

      {/* Drawer for Mobile */}
      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
      >
        <RenderFilters
          search={search}
          setSearch={setSearch}
          categories={categories}
          category={category}
          setCategory={setCategory}
          color={color}
          setColor={setColor}
          size={size}
          setSize={setSize}
          setPriceRange={setPriceRange}
          discounts={discounts}
          setDiscount={setDiscount}
          setRating={setRating}
        ></RenderFilters>
      </Drawer>

      {/* Products Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center gap-4">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center gap-4">
            {products.map((product) => {
              const discountedPrice =
                product.discount > 0
                  ? product.price - (product.price * product.discount) / 100
                  : product.price;

              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  discountedPrice={discountedPrice}
                  handleAddToCart={handleAddToCart}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <Pagination
              current={page}
              total={total}
              pageSize={24}
              showSizeChanger={false}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Products;