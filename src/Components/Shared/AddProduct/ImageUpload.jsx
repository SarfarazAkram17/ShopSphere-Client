import { useState } from "react";
import { MdImage, MdCloudUpload } from "react-icons/md";

export const ImageUpload = ({
  fileInputRef,
  imageURLs,
  uploading,
  onImageUpload,
  onImageRemove,
  maxImages = 4,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
  };

  const handleClick = () => {
    if (imageURLs.length < maxImages && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
        <MdImage className="w-4 h-4" />
        Upload Images <span className="text-red-500">*</span>
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => onImageUpload(e.target.files)}
        className="hidden"
        disabled={uploading || imageURLs.length >= maxImages}
      />

      {/* Drag & Drop Zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : imageURLs.length >= maxImages
              ? "border-green-400 bg-green-50 cursor-not-allowed"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
          }
        `}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all
            ${
              isDragging
                ? "bg-blue-500"
                : imageURLs.length >= maxImages
                ? "bg-green-500"
                : "bg-gray-400"
            }
          `}
          >
            {imageURLs.length >= maxImages ? (
              <span className="text-3xl text-white">✓</span>
            ) : (
              <MdCloudUpload className="w-8 h-8 text-white" />
            )}
          </div>

          {uploading ? (
            <div>
              <p className="text-lg font-semibold text-gray-700">
                Uploading...
              </p>
              <p className="text-sm text-gray-500 mt-1">Please wait</p>
            </div>
          ) : imageURLs.length >= maxImages ? (
            <div>
              <p className="text-lg font-semibold text-green-600">
                All {maxImages} images uploaded!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Remove an image to upload more
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {isDragging ? "Drop images here" : "Drag & drop images here"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or{" "}
                <span className="text-blue-500 font-medium">
                  click to browse
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {imageURLs.length} / {maxImages} images uploaded
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {imageURLs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {imageURLs.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-40 sm:h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => onImageRemove(index)}
                className="absolute top-2 cursor-pointer right-2 bg-red-500 text-white text-sm w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 flex items-center justify-center shadow-lg"
              >
                ✕
              </button>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};