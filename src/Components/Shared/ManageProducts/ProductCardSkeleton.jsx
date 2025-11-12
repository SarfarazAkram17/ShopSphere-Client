const ProductCardSkeleton = () => {
  return (
    <div className="border h-full rounded-xl overflow-hidden shadow">
      {/* Image skeleton */}
      <div className="relative w-full h-52 sm:h-60 bg-base-300">
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
          bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="relative w-2/3 h-5 bg-base-300 rounded">
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
            bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          />
        </div>

        {/* Small lines */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative w-full h-3 bg-base-300 rounded">
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
              bg-gradient-to-r from-transparent via-gray-300 to-transparent"
            />
          </div>
        ))}

        {/* Optional color/size lines */}
        <div className="relative w-1/2 h-3 bg-base-300 rounded">
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
            bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          />
        </div>
        <div className="relative w-1/3 h-3 bg-base-300 rounded">
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
            bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          />
        </div>

        {/* Status */}
        <div className="relative w-1/3 h-3 bg-base-300 rounded">
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
            bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative w-20 h-8 bg-base-300 rounded">
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                bg-gradient-to-r from-transparent via-gray-300 to-transparent"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;