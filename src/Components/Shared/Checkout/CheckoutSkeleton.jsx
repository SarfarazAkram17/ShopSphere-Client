const CheckoutSkeleton = () => {
  const ShimmerEffect = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
  );

  const OrderItemSkeleton = () => (
    <div className="flex gap-4 border-t pt-4 first:border-t-0 first:pt-0">
      {/* Product Image */}
      <div className="relative w-24 h-24 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
        <ShimmerEffect />
      </div>

      {/* Product Details */}
      <div className="flex-1 space-y-2">
        {/* Product Name */}
        <div className="relative w-3/4 h-4 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>

        {/* Color/Size */}
        <div className="flex gap-2">
          <div className="relative w-16 h-3 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
          <div className="relative w-12 h-3 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
          <div className="relative w-20 h-5 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative w-16 h-4 bg-gray-200 rounded overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="relative w-10 h-4 bg-gray-200 rounded overflow-hidden">
              <ShimmerEffect />
            </div>
          </div>
        </div>

        {/* Mobile: Delete & Qty */}
        <div className="flex items-center gap-8 sm:hidden">
          <div className="relative w-5 h-5 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
          <div className="relative w-12 h-4 bg-gray-200 rounded overflow-hidden">
            <ShimmerEffect />
          </div>
        </div>
      </div>

      {/* Desktop: Delete & Qty */}
      <div className="hidden sm:flex flex-col items-end justify-between">
        <div className="relative w-5 h-5 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>
        <div className="relative w-12 h-4 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>
      </div>
    </div>
  );

  const StorePackageSkeleton = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 overflow-hidden">
      {/* Package Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-0 sm:justify-between sm:items-center mb-4">
        <div className="relative w-24 h-4 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>
        <div className="relative w-32 sm:w-40 h-4 bg-gray-200 rounded overflow-hidden">
          <ShimmerEffect />
        </div>
      </div>

      {/* Delivery Info Box */}
      <div className="border border-gray-300 rounded-lg p-4 mb-4 w-fit">
        <div className="flex items-start gap-2">
          <div className="relative w-5 h-5 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
            <ShimmerEffect />
          </div>
          <div className="space-y-2">
            <div className="relative w-12 h-5 bg-gray-200 rounded overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="relative w-32 h-3 bg-gray-200 rounded overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="relative w-40 h-3 bg-gray-200 rounded overflow-hidden">
              <ShimmerEffect />
            </div>
          </div>
        </div>
      </div>

      {/* Order Items (2 items per package) */}
      <div className="space-y-4">
        <OrderItemSkeleton />
        <OrderItemSkeleton />
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-[1500px] mx-auto">
        {/* Session Timer Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 overflow-hidden">
          <div className="flex gap-3 items-start">
            <div className="relative w-8 h-8 bg-yellow-200 rounded-full flex-shrink-0 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="relative w-48 h-5 bg-yellow-200 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />
              </div>
              <div className="relative w-64 h-4 bg-yellow-200 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Checkout Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-32 h-6 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
                <div className="relative w-12 h-5 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>

              {/* Name & Phone */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative w-32 h-5 bg-gray-200 rounded overflow-hidden">
                    <ShimmerEffect />
                  </div>
                  <div className="relative w-24 h-4 bg-gray-200 rounded overflow-hidden">
                    <ShimmerEffect />
                  </div>
                </div>

                {/* Address Badge & Full Address */}
                <div className="flex items-center gap-2">
                  <div className="relative w-16 h-6 bg-gray-200 rounded overflow-hidden">
                    <ShimmerEffect />
                  </div>
                  <div className="flex-1 relative h-4.5 bg-gray-200 rounded overflow-hidden">
                    <ShimmerEffect />
                  </div>
                </div>
              </div>
            </div>

            <StorePackageSkeleton />
            <StorePackageSkeleton />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 overflow-hidden">
              {/* Invoice and Contact Info */}
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-60 h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
                <div className="relative w-12 h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>

              <div className="relative w-32 h-6 bg-gray-200 rounded mb-4 overflow-hidden">
                <ShimmerEffect />
              </div>

              {/* Items Total */}
              <div className="flex justify-between items-center mb-2">
                <div className="relative w-28 h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
                <div className="relative w-24 h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>

              {/* Delivery Fee */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <div className="relative w-24 h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
                <div className="relative w-16 h-4 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-2">
                <div className="relative w-16 h-6 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
                <div className="relative w-28 h-6 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>

              {/* VAT Text */}
              <div className="flex justify-end mb-6">
                <div className="relative w-60 h-3 bg-gray-200 rounded overflow-hidden">
                  <ShimmerEffect />
                </div>
              </div>

              {/* Proceed to Pay Button */}
              <div className="relative w-full h-12 bg-gray-200 rounded overflow-hidden">
                <ShimmerEffect />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;