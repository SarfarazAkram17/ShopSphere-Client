import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import { FiPackage } from "react-icons/fi";
import { FormHeader } from "../../../Components/Shared/AddProduct/FormHeader";
import { BasicInfoSection } from "../../../Components/Shared/AddProduct/BasicInfoSection";
import { PricingSection } from "../../../Components/Shared/AddProduct/PricingSection";
import { VariantsSection } from "../../../Components/Shared/AddProduct/VariantsSection";
import { ImagesSection } from "../../../Components/Shared/AddProduct/ImagesSection";
import { DescriptionSection } from "../../../Components/Shared/AddProduct/DescriptionSection";
import { SubmitButton } from "../../../Components/Shared/AddProduct/SubmitButton";

const AddProduct = () => {
  const [categories] = useState([
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Toys",
  ]);

  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef();
  const { userEmail } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm();

  const [uploading, setUploading] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);

  const cloudName = import.meta.env.VITE_cloudinary_cloud_name;
  const uploadPreset = import.meta.env.VITE_cloudinary_preset_name;

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = async (files) => {
    if (!files.length) return;

    const totalImages = imageURLs.length + files.length;
    if (totalImages > 4) {
      toast.error("You can upload 4 images.");
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", uploadPreset);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );

        uploaded.push(res.data.secure_url);
      }

      setImageURLs((prev) => [...prev, ...uploaded]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = (index) => {
    setImageURLs((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- POST Product MUTATION ----------------
  const { mutate: addProduct, isPending } = useMutation({
    mutationFn: async (newProduct) => {
      const { data } = await axiosSecure.post(
        `/products?email=${userEmail}`,
        newProduct
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.productId) {
        Swal.fire("Success", "🎉 Product added successfully!", "success");
        setImageURLs([]);
        reset();
      }
    },
    onError: (err) => {
      toast.error(`Failed to add product: ${err.message}`);
    },
  });

  const handleAddProduct = async (data) => {
    if (imageURLs.length < 4) {
      toast.error("Please upload 4 image before submitting.");
      return;
    }

    const price = Math.round(parseFloat(data.price) * 100) / 100;
    const discount = Math.round(parseFloat(data.discount) * 100) / 100;
    const stock = parseInt(data.stock);

    const newProduct = {
      sellerEmail: userEmail,
      name: data.name,
      price,
      discount,
      description: data.description,
      images: imageURLs,
      stock,
      category: data.categories,
      rating: 0,
      addedAt: new Date().toISOString(),
    };

    if (data.color?.trim()) {
      newProduct.color = data.color
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
    }

    if (data.size?.trim()) {
      newProduct.size = data.size
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    addProduct(newProduct);
  };

  return (
    <div className="px-4 pt-12 pb-16">
      <FormHeader
        icon={FiPackage}
        title="Add New Product"
        description="List your product on ShopSphere. Upload high-quality images, set competitive pricing, and provide detailed information to attract customers."
      />

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <form onSubmit={handleSubmit(handleAddProduct)} className="space-y-8">
          <BasicInfoSection
            register={register}
            control={control}
            errors={errors}
            categories={categories}
          />

          <PricingSection register={register} errors={errors} />

          <VariantsSection register={register} />

          <ImagesSection
            fileInputRef={fileInputRef}
            imageURLs={imageURLs}
            uploading={uploading}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
          />

          <DescriptionSection register={register} errors={errors} />

          <SubmitButton
            loading={uploading || isPending}
            loadingText={
              uploading ? "Uploading images..." : "Adding product..."
            }
          >
            Add Product
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;