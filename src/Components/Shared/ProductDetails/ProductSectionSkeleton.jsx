const ProductSectionSkeleton = () => {
  return (
    <section className="grid rounded-2xl shadow-xl px-4 py-6 grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: Product Image Section */}
      <div>
        {/* Main Image Skeleton */}
        <div className="relative w-full h-64 sm:h-80 bg-base-300 rounded-lg overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        {/* Thumbnails Skeleton */}
        <div className="flex flex-wrap gap-2 mb-8 mt-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="relative w-28 h-20 bg-base-300 rounded-md overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          ))}
        </div>

        {/* Share Section Skeleton */}
        <div className="mt-5 space-y-2">
          {[
            { w: "w-40", h: "h-6" },
            { w: "w-64", h: "h-4" },
          ].map((size, i) => (
            <div
              key={i}
              className={`relative ${size.w} ${size.h} bg-base-300 rounded overflow-hidden`}
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          ))}

          <div className="flex gap-2 mt-3">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="relative w-10 h-10 bg-base-300 rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Product Details Section */}
      <div className="space-y-4">
        {/* Title */}
        <div className="relative h-8 w-3/4 bg-base-300 rounded overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        {/* Rating */}
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

        {/* Description */}
        <div className="space-y-2">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className={`relative h-4 ${
                idx < 2 ? "w-full" : idx < 4 ? "w-5/6" : "w-2/3"
              } bg-base-300 rounded overflow-hidden`}
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mt-4">
          {[
            { w: "w-24", h: "h-7" },
            { w: "w-18", h: "h-5" },
          ].map((size, i) => (
            <div
              key={i}
              className={`relative ${size.w} ${size.h} bg-base-300 rounded overflow-hidden`}
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          ))}
        </div>

        {/* Stock */}
        <div className="relative h-5 w-32 bg-base-300 rounded overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        {/* Color Skeleton */}
        <div className="flex items-center gap-2 mt-3">
          <div className="relative h-6 w-16 bg-base-300 rounded-md overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="relative h-10 w-20 bg-base-300 rounded-md overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          ))}
        </div>

        {/* Size Skeleton */}
        <div className="flex items-center gap-2 mt-3">
          <div className="relative h-6 w-16 bg-base-300 rounded-md overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="relative h-10 w-20 bg-base-300 rounded-md overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          ))}
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4 mt-6">
          <div className="relative h-10 w-28 bg-base-300 rounded-lg overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="relative h-10 w-32 bg-base-300 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSectionSkeleton;