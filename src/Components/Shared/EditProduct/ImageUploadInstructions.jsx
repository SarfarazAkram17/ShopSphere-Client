import { MdInfoOutline } from "react-icons/md";

export const ImageUploadInstructions = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center gap-3">
      <MdInfoOutline className="w-6 h-6 text-blue-600 flex-shrink-0" />
      <p className="text-sm text-gray-700">
        <strong>Note:</strong> If you add colors, please upload images in the
        same sequence as your color variants.
      </p>
    </div>
  );
};