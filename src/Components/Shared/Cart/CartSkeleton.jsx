import React from "react";

const CartSkeleton = () => {
  const ShimmerEffect = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
  );

  const ProductItemSkeleton = () => (
    <div className="flex gap-2 sm:gap-3 md:gap-4 items-start sm:items-center">
      {/* Checkbox */}
      <div className="relative w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded mt-2 sm:mt-4 flex-shrink-0 overflow-hidden">
        <ShimmerEffect />
      </div>

      {/* Product Image */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
        <ShimmerEffect />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
        {/* Product Name */}
        <div className="relative w-3/4 h-3 sm:h-4 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>

        {/* Color/Size Info */}
        <div className="flex gap-2 sm:gap-3">
          <div className="relative w-16 sm:w-20 h-2 sm:h-3 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
          <div className="relative w-12 sm:w-16 h-2 sm:h-3 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
        </div>

        {/* Price */}
        <div className="relative w-20 sm:w-24 h-4 sm:h-5 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>

        {/* Mobile: Quantity and Actions */}
        <div className="flex sm:hidden items-center justify-between mt-2 gap-2">
          <div className="relative w-24 h-7 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
          <div className="flex gap-3">
            <div className="relative w-4 h-4 bg-gray-200 rounded overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="relative w-4 h-4 bg-gray-200 rounded overflow-hidden">
              <ShimmerEffect />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Quantity Controls */}
      <div className="hidden sm:flex flex-col items-center gap-3 flex-shrink-0">
        <div className="relative w-28 sm:w-32 h-8 sm:h-9 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>

        {/* Desktop: Actions */}
        <div className="flex gap-3">
          <div className="relative w-5 h-5 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
          <div className="relative w-5 h-5 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
        </div>
      </div>
    </div>
  );

  const StoreCardSkeleton = () => (
    <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-xl overflow-hidden">
      {/* Store Header */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-3 border-b">
        <div className="relative w-4 h-4 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>
        <div className="relative w-32 sm:w-40 h-4 sm:h-5 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>
      </div>

      {/* Products (2 per store) */}
      <div className="space-y-3 sm:space-y-4">
        <ProductItemSkeleton />
        <ProductItemSkeleton />
      </div>
    </div>
  );

  return (
    <section className="bg-gray-100 w-full">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Cart Header */}
            <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2">
                  <div className="relative w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded overflow-hidden">
                    <ShimmerEffect />
                  </div>
                  <div className="relative w-32 sm:w-40 h-3 sm:h-4 bg-gray-200 rounded overflow-hidden">
                    <ShimmerEffect />
                  </div>
                </div>
                <div className="relative w-16 sm:w-20 h-3 sm:h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>
            </div>

            {/* Store Cards (3 stores) */}
            <StoreCardSkeleton />
            <StoreCardSkeleton />
            <StoreCardSkeleton />
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl sticky top-4 sm:top-18 overflow-hidden">
              {/* Title */}
              <div className="relative w-32 sm:w-36 h-5 sm:h-6 bg-gray-200 rounded mb-3 sm:mb-4 overflow-hidden">
                <ShimmerEffect />
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center mb-2">
                <div className="relative w-24 sm:w-28 h-3 sm:h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
                <div className="relative w-16 sm:w-20 h-3 sm:h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                <div className="relative w-20 sm:w-24 h-3 sm:h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
                <div className="relative w-12 sm:w-16 h-3 sm:h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div className="relative w-16 sm:w-20 h-5 sm:h-6 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
                <div className="relative w-20 sm:w-24 h-5 sm:h-6 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>

              {/* Checkout Button */}
              <div className="relative w-full h-10 sm:h-12 bg-gray-200 rounded overflow-hidden">
                <ShimmerEffect />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartSkeleton;