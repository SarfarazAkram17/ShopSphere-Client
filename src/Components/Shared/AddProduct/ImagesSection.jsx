import { FormSection } from "./FormSection";
import { ImageUpload } from "./ImageUpload";
import { MdImage } from "react-icons/md";
import { ImageUploadInstructions } from "./ImageUploadInstructions";

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
      {/* 👇 Add the instruction card here */}
      <ImageUploadInstructions />

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
