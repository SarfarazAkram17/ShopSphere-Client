import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Drawer } from "antd";
import useAxios from "../../Hooks/useAxios";
import ProductCardSkeleton from "../../Components/Shared/Products/ProductCardSkeleton";
import ProductCard from "../../Components/Shared/Products/ProductCard";
import { RiMenuSearchLine } from "react-icons/ri";
import RenderFilters from "../../lib/RenderFilters";
import Pagination from "@mui/material/Pagination";

const Offers = () => {
  const axiosInstance = useAxios();
  const [page, setPage] = useState(0);
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
      "offered-products",
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
      const res = await axiosInstance.get(`/products/offer`, {
        params: {
          page,
          limit: 20,
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

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-primary">
        Products on Sale
      </h2>
      <p className="text-center text-xs xl:text-sm text-gray-600 mb-8 xl:max-w-4xl max-w-3xl mx-auto">
        Discover our exclusive collection of discounted products across a
        variety of categories. From electronics and clothing to books and more,
        enjoy amazing deals with special offers tailored just for you. Use
        filters like category, color, size, price, discount, and rating to
        quickly find the best bargains and save more on your shopping.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-center gap-4">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-center gap-4">
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
                />
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-10">
            <Pagination
              count={Math.ceil(total / 20)}
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

export default Offers;