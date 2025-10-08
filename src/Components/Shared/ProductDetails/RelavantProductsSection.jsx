import ProductCard from "../Products/ProductCard";

const RelavantProductsSection = ({ products }) => {
  return (
    <section className="rounded-2xl shadow-xl px-4 py-6">
      <h2 className="text-xl font-semibold mb-6">Relavant Products</h2>

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
            />
          );
        })}
      </div>
    </section>
  );
};

export default RelavantProductsSection;