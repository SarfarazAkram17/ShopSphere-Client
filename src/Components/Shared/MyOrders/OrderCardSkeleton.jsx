const OrderCardSkeleton = () => {
  const ShimmerEffect = ({ className }) => (
    <div
      className={`relative ${className} bg-base-300 rounded overflow-hidden`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
  );

  const SingleProductSkeleton = () => (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
      {/* Product Image */}
      <ShimmerEffect className="w-20 h-20 flex-shrink-0" />

      <div className="flex-1 min-w-0 space-y-2">
        {/* Product Name */}
        <ShimmerEffect className="w-1/2 h-4.5" />

        <ShimmerEffect className="w-25 h-3.5" />
        {/* Price Info */}
        <ShimmerEffect className="w-22 h-3.5" />
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <ShimmerEffect className="w-20 h-5" />
      </div>
    </div>
  );

  const StoreSkeleton = ({ showBorder }) => (
    <div className={showBorder ? "mt-4 pt-4 border-t" : ""}>
      {/* Store Header */}
      <div className="flex items-center justify-between mb-3">
        <ShimmerEffect className="w-40 h-5" />
        <ShimmerEffect className="w-20 h-6 rounded-full" />
      </div>

      {/* Product */}
      <div className="space-y-3">
        <SingleProductSkeleton />
        <SingleProductSkeleton />
      </div>

      {/* Store Subtotal */}
      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <ShimmerEffect className="w-48 h-4" />
        <ShimmerEffect className="w-24 h-4" />
      </div>
    </div>
  );

  const OrderCardSkeleton = ({ storeCount }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg">
      {/* Order Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div>
              <ShimmerEffect className="w-16 h-3 mb-1" />
              <ShimmerEffect className="w-40 h-4" />
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
            <div>
              <ShimmerEffect className="w-20 h-3 mb-1" />
              <ShimmerEffect className="w-32 h-4" />
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
            <div>
              <ShimmerEffect className="w-24 h-3 mb-1" />
              <ShimmerEffect className="w-20 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShimmerEffect className="w-24 h-8 rounded-full" />
            <ShimmerEffect className="w-20 h-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Order Body */}
      <div className="p-4">
        {/* Stores */}
        {[...Array(storeCount)].map((_, index) => (
          <StoreSkeleton key={index} showBorder={index > 0} />
        ))}

        {/* Order Footer */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shipping Address */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <ShimmerEffect className="w-8 h-8 mt-1 flex-shrink-0 rounded" />
                <div className="flex-1 space-y-2">
                  <ShimmerEffect className="w-32 h-3" />
                  <ShimmerEffect className="w-full h-4" />
                  <ShimmerEffect className="w-3/4 h-3" />
                  <ShimmerEffect className="w-full h-3" />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <ShimmerEffect className="w-8 h-8 mt-1 flex-shrink-0 rounded" />
                <div className="flex-1 space-y-2">
                  <ShimmerEffect className="w-28 h-3" />
                  <ShimmerEffect className="w-32 h-4" />
                  <ShimmerEffect className="w-full h-3" />
                  <ShimmerEffect className="w-2/3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <ShimmerEffect className="w-32 h-9 rounded-lg" />
            <ShimmerEffect className="w-32 h-9 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Order with 2 stores */}
      <OrderCardSkeleton storeCount={2} />

      {/* Order with 1 store */}
      <OrderCardSkeleton storeCount={1} />
    </div>
  );
};

export default OrderCardSkeleton;