import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const imageData = new FormData();
  imageData.append("file", file);
  imageData.append(
    "upload_preset",
    import.meta.env.VITE_cloudinary_preset_name
  );

  const imageRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_cloudinary_cloud_name
    }/image/upload`,
    imageData
  );

  return imageRes.data.secure_url;
};