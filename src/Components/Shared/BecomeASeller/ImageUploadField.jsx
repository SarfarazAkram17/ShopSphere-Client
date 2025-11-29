import LazyImage from "../../LazyImage/LazyImage";

export const ImageUploadField = ({
  label,
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  preview,
  onChange,
  previewClassName = "w-24 h-24",
}) => (
  <div>
    <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
      <Icon className="w-4 h-4" />
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type="file"
      accept="image/*"
      className="file-input file-input-bordered w-full"
      onChange={onChange}
    />
    {preview && (
      <div className="mt-3">
        <LazyImage
          src={preview}
          alt={`${label} Preview`}
          className={`${previewClassName} rounded-lg border-2 border-gray-200 shadow-sm`}
        />
      </div>
    )}
  </div>
);

export default ImageUploadField;