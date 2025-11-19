const ProductCardSkeleton = () => {
  return (
    <div className="border h-full rounded-xl overflow-hidden shadow">
      {/* Image skeleton */}
      <div className="relative w-full h-52 sm:h-60 bg-base-300 overflow-hidden">
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
          bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="relative w-2/3 h-5 bg-base-300 rounded overflow-hidden">
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
            bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          />
        </div>

        {/* description Small lines */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative w-full h-3 bg-base-300 rounded overflow-hidden">
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
              bg-gradient-to-r from-transparent via-gray-300 to-transparent"
            />
          </div>
        ))}

        {/* price */}
        <div className="relative w-2/3 h-5 bg-base-300 rounded overflow-hidden">
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
            bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          />
        </div>

        {/* Rating Skeleton */}
        <div className="flex gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-base-300 rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between gap-2 mt-4">
          <div className="relative w-20 h-8 bg-base-300 rounded overflow-hidden">
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                bg-gradient-to-r from-transparent via-gray-300 to-transparent"
            />
          </div>
          <div className="relative w-24 h-8 bg-base-300 rounded overflow-hidden">
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                bg-gradient-to-r from-transparent via-gray-300 to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;