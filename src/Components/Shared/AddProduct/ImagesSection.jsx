import { FormSection } from "./FormSection";
import { ImageUpload } from "./ImageUpload";
import { MdImage } from "react-icons/md";

export const ImagesSection = ({
  fileInputRef,
  imageURLs,
  uploading,
  onImageUpload,
  onImageRemove,
}) => {
  return (
    <FormSection
      icon={MdImage}
      title="Product Images"
      iconColor="text-pink-600"
    >
      <ImageUpload
        fileInputRef={fileInputRef}
        imageURLs={imageURLs}
        uploading={uploading}
        onImageUpload={onImageUpload}
        onImageRemove={onImageRemove}
      />
    </FormSection>
  );
};