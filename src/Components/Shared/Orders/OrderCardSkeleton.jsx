const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Order Header Skeleton */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1">
            {/* Order ID */}
            <div className="relative w-48 h-4 bg-base-300 rounded overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Date */}
            <div className="relative w-56 h-4 bg-base-300 rounded overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Payment Status */}
            <div className="flex items-center gap-2 mt-1">
              <div className="relative w-16 h-6 bg-base-300 rounded-full overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
              <div className="relative w-28 h-4 bg-base-300 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Status Badge */}
            <div className="relative w-32 h-10 bg-base-300 rounded-full overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Action Button */}
            <div className="relative w-28 h-9 bg-base-300 rounded overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Customer Details Skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            <div className="relative w-32 h-5 bg-base-300 rounded overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
            <div className="relative w-full h-4 bg-base-300 rounded overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
            <div className="relative w-full h-4 bg-base-300 rounded overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
            <div className="md:col-span-2 relative w-full h-4 bg-base-300 rounded overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          </div>
        </div>

        {/* Products Skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-5 bg-green-600 rounded"></span>
            <div className="relative w-28 h-5 bg-base-300 rounded overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          </div>

          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 bg-base-300 rounded-md overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                <div className="flex-1 space-y-2">
                  {/* Product Name */}
                  <div className="relative w-3/4 h-5 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-wrap gap-3">
                    <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    <div className="relative w-16 h-4 bg-base-300 rounded overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    <div className="relative w-12 h-4 bg-base-300 rounded overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col gap-2">
                  {/* Price */}
                  <div className="relative w-24 h-6 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-indigo-600 rounded"></span>
            <div className="relative w-36 h-5 bg-base-300 rounded overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="relative w-32 h-4 bg-base-300 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
              <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            </div>

            <div className="flex justify-between">
              <div className="relative w-40 h-4 bg-base-300 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
              <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            </div>

            <div className="h-px bg-base-300"></div>

            <div className="flex justify-between pt-2">
              <div className="relative w-32 h-6 bg-base-300 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
              <div className="relative w-28 h-7 bg-base-300 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCardSkeleton;