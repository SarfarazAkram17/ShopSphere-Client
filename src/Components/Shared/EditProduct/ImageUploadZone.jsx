import { MdImage, MdCloudUpload } from "react-icons/md";

export const ImageUploadZone = ({
  fileInputRef,
  uploading,
  totalImages,
  maxImages = 4,
  isDragging,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  onFileChange,
}) => {
  return (
    <div>
      <label className="flex items-center gap-2 font-semibold mb-3 text-gray-700">
        <MdImage className="w-4 h-4" />
        Upload Images <span className="text-red-500">*</span>
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFileChange}
        className="hidden"
        disabled={uploading || totalImages >= maxImages}
      />

      {/* Drag & Drop Zone */}
      <div
        onClick={onClick}
        onDragEnter={
          totalImages >= maxImages || uploading ? undefined : onDragEnter
        }
        onDragOver={
          totalImages >= maxImages || uploading ? undefined : onDragOver
        }
        onDragLeave={
          totalImages >= maxImages || uploading ? undefined : onDragLeave
        }
        onDrop={totalImages >= maxImages || uploading ? undefined : onDrop}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : totalImages >= maxImages
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
                ? "bg-blue-500 scale-110"
                : totalImages >= maxImages
                ? "bg-green-500"
                : "bg-gray-400"
            }
          `}
          >
            {totalImages >= maxImages ? (
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
          ) : totalImages >= maxImages ? (
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
                {totalImages} / {maxImages} images • {maxImages - totalImages}{" "}
                remaining
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};