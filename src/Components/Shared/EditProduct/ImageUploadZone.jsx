import { MdImage, MdCloudUpload } from "react-icons/md";

export const ImageUploadZone = ({
  fileInputRef,
  uploading,
  totalImages,
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
        disabled={uploading}
      />

      {/* Drag & Drop Zone */}
      <div
        onClick={onClick}
        onDragEnter={uploading ? undefined : onDragEnter}
        onDragOver={uploading ? undefined : onDragOver}
        onDragLeave={uploading ? undefined : onDragLeave}
        onDrop={uploading ? undefined : onDrop}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
          }
        `}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all
            ${isDragging ? "bg-blue-500 scale-110" : "bg-gray-400"}
          `}
          >
            <MdCloudUpload className="w-8 h-8 text-white" />
          </div>

          {uploading ? (
            <div>
              <p className="text-lg font-semibold text-gray-700">
                Uploading...
              </p>
              <p className="text-sm text-gray-500 mt-1">Please wait</p>
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
                {totalImages} image{totalImages > 1 ? "s" : ""} uploaded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};