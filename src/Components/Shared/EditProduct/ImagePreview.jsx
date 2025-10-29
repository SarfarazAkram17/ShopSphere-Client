export const ImagePreview = ({
  images,
  label,
  onRemove,
  badgeColor = "black",
}) => {
  if (images.length === 0) return null;

  return (
    <div>
      <p
        className={`text-sm font-semibold mb-3 ${
          badgeColor === "green" ? "text-green-600" : "text-gray-600"
        }`}
      >
        {label} ({images.length})
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={typeof image === "string" ? image : image.url}
              alt={`${label} ${index + 1}`}
              className={`w-full h-40 sm:h-48 object-cover rounded-xl border-2 shadow-md transition-transform group-hover:scale-105 ${
                badgeColor === "green" ? "border-green-200" : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 bg-red-500 text-white text-sm w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 flex items-center justify-center shadow-lg cursor-pointer"
            >
              ✕
            </button>
            <div
              className={`absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded-md ${
                badgeColor === "green"
                  ? "bg-green-600 font-semibold"
                  : "bg-black/60"
              }`}
            >
              {label} {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};