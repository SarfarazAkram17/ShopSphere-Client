const EmptyCart = ({ onContinueShopping }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 text-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
        Your cart is empty
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
        Add some products to get started!
      </p>
      <button
        onClick={onContinueShopping}
        className="btn btn-error btn-sm hover:text-white btn-outline"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default EmptyCart;