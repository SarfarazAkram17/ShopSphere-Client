import { useState, useEffect, useRef } from "react";

const LazyImage = ({
  src,
  alt,
  className = "",
  objectFit = "contain",
  rootMargin = "100px",
  priority = false,
  placeholder = "default",
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // If priority, start as true
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading (skip if priority)
  useEffect(() => {
    if (priority) return; // Skip observer if priority image

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: rootMargin,
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority, rootMargin]);

  // For priority images, render normally without lazy loading
  if (priority) {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsImageLoaded(true)}
        onError={() => setHasError(true)}
        className={className}
        style={{ objectFit }}
      />
    );
  }

  // Default placeholder SVG
  const defaultPlaceholder = (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <svg
        className="w-12 h-12 text-gray-400 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );

  // Error placeholder
  const errorPlaceholder = (
    <div className="w-full h-full bg-red-100 flex items-center justify-center">
      <svg
        className="w-12 h-12 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder - shown while image is loading */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isImageLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        {hasError
          ? errorPlaceholder
          : placeholder === "default"
          ? defaultPlaceholder
          : placeholder}
      </div>

      {/* Actual Image - loaded when in view */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectFit }}
        />
      )}
    </div>
  );
};

export default LazyImage;