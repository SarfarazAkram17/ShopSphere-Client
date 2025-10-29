import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Loader/Loader";
import Select from "react-select";
import {
  MdAttachMoney,
  MdLocalOffer,
  MdImage,
  MdDescription,
  MdPalette,
  MdStraighten,
} from "react-icons/md";
import { FiPackage, FiEdit3 } from "react-icons/fi";
import { AiOutlineStock } from "react-icons/ai";
import { FormHeader } from "../../../Components/Shared/EditProduct/FormHeader";
import { FormSection } from "../../../Components/Shared/EditProduct/FormSection";
import { FormInput } from "../../../Components/Shared/EditProduct/FormInput";
import { FormTextarea } from "../../../Components/Shared/EditProduct/FormTextarea";
import { SubmitButton } from "../../../Components/Shared/EditProduct/SubmitButton";
import { ImageUploadZone } from "../../../Components/Shared/EditProduct/ImageUploadZone";
import { ImagePreview } from "../../../Components/Shared/EditProduct/ImagePreview";

const EditProduct = () => {
  const { productId } = useParams();
  const { userEmail } = useAuth();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const queryClient = useQueryClient();

  const [existingImages, setExistingImages] = useState([]);
  const [newImageURLs, setNewImageURLs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const cloudName = import.meta.env.VITE_cloudinary_cloud_name;
  const uploadPreset = import.meta.env.VITE_cloudinary_preset_name;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const [categories] = useState([
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Toys",
  ]);

  // Fetch single product
  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${productId}`);
      return res.data.product;
    },
    enabled: !!productId,
  });

  // Pre-fill form
  useEffect(() => {
    if (productData) {
      reset({
        name: productData.name,
        price: productData.price,
        discount: productData.discount,
        stock: productData.stock,
        color: productData.color && productData.color.join(", "),
        size: productData.size && productData.size.join(", "),
        description: productData.description,
      });
      setExistingImages(productData.images || []);

      if (productData.category && productData.category.length > 0) {
        const formatted = productData.category.map((c) => ({
          value: c.toLowerCase(),
          label:
            categories.find((cat) => cat.toLowerCase() === c.toLowerCase()) ||
            c,
        }));
        setValue("categories", formatted);
      }
    }
  }, [productData, reset, categories, setValue]);

  // Image upload logic
  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    const totalImages = existingImages.length + newImageURLs.length;
    const remainingSlots = 4 - totalImages;

    if (remainingSlots <= 0) {
      toast.error(
        "Maximum 4 images already uploaded! Remove some images first."
      );
      return;
    }

    if (files.length > remainingSlots) {
      toast.error(
        `You can only upload ${remainingSlots} more image(s). You selected ${files.length} images. Please select fewer images.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const filesToUpload = Array.from(files);
    setUploading(true);

    try {
      const uploaded = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const formData = new FormData();
        formData.append("file", filesToUpload[i]);
        formData.append("upload_preset", uploadPreset);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );

        uploaded.push(res.data.secure_url);
      }

      setNewImageURLs((prev) => [...prev, ...uploaded]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(`${uploaded.length} image(s) uploaded successfully!`);
    } catch (error) {
      toast.error(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Drag & Drop handlers
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
      handleImageUpload(files);
    }
  };

  const handleDropZoneClick = () => {
    const totalImages = existingImages.length + newImageURLs.length;
    if (totalImages < 4 && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImageURLs((prev) => prev.filter((_, i) => i !== index));
  };

  // Update product mutation
  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: async (updatedProduct) => {
      const { data } = await axiosSecure.patch(
        `/products/${productId}?email=${userEmail}`,
        updatedProduct
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire("Success", "🎉 Product updated successfully!", "success");
      navigate("/dashboard/manageProducts");
      queryClient.invalidateQueries(["product", "myProducts"]);
    },
    onError: (err) => {
      toast.error(`Failed to update product: ${err.message}`);
    },
  });

  const handleProductUpdate = async (data) => {
    const totalImages = existingImages.length + newImageURLs.length;
    if (totalImages < 4) {
      toast.error("Please upload total 4 images.");
      return;
    }

    const price = Math.round(parseFloat(data.price) * 100) / 100;
    const discount = Math.round(parseFloat(data.discount) * 100) / 100;
    const stock = parseInt(data.stock);

    const imagesToRemove = productData.images.filter(
      (img) => !existingImages.includes(img)
    );

    const updatedProduct = {
      name: data.name,
      price,
      discount,
      description: data.description,
      stock,
      category: data.categories.map((c) => c.value),
      imagesToAdd: newImageURLs,
      imagesToRemove,
    };

    if (data.color?.trim()) {
      updatedProduct.color = data.color
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
    }

    if (data.size?.trim()) {
      updatedProduct.size = data.size
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    updateProduct(updatedProduct);
  };

  if (isLoading) return <Loader />;

  const totalImages = existingImages.length + newImageURLs.length;

  return (
    <div className="px-4">
      <FormHeader
        icon={FiEdit3}
        title="Edit Product"
        description="Update your product information, images, and pricing to keep your listing current and competitive."
        productName={productData?.name}
      />

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <form
          onSubmit={handleSubmit(handleProductUpdate)}
          className="space-y-8"
        >
          {/* Basic Information */}
          <FormSection
            icon={FiPackage}
            title="Basic Information"
            iconColor="text-blue-600"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Product Name"
                icon={MdDescription}
                required
                placeholder="Enter product name"
                register={register("name", { required: true })}
                error={errors.name}
              />

              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdLocalOffer className="w-4 h-4" />
                  Categories <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="categories"
                  control={control}
                  rules={{ required: "Choose at least one category." }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      placeholder="Select Product Categories"
                      options={categories.map((c) => ({
                        value: c.toLowerCase(),
                        label: c,
                      }))}
                      className="text-sm w-full"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#e5e7eb",
                          "&:hover": { borderColor: "#3b82f6" },
                          boxShadow: "none",
                          minHeight: "45px",
                        }),
                      }}
                    />
                  )}
                />
                {errors.categories && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.categories.message}
                  </p>
                )}
              </div>
            </div>
          </FormSection>

          {/* Pricing & Inventory */}
          <FormSection
            icon={MdAttachMoney}
            title="Pricing & Inventory"
            iconColor="text-green-600"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Price (BDT)"
                icon={MdAttachMoney}
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                register={register("price", {
                  required: "Price is required.",
                  min: { value: 1, message: "Price must be greater than 0." },
                  max: {
                    value: 1000000,
                    message: "Price must be less than 1000000.",
                  },
                })}
                error={errors.price}
              />

              <FormInput
                label="Discount (%)"
                icon={MdLocalOffer}
                required
                type="number"
                step="0.01"
                placeholder="0"
                register={register("discount", { min: 0, max: 100 })}
                helpText="Default 0%. Maximum 100%"
                defaultValue={0}
              />
            </div>

            <FormInput
              label="Stock Quantity"
              icon={AiOutlineStock}
              required
              type="number"
              placeholder="Enter available quantity"
              register={register("stock", {
                required: "Stock quantity is required.",
                min: {
                  value: 0,
                  message: "Stock must be greater than or equal to 0.",
                },
              })}
              error={errors.stock}
            />
          </FormSection>

          {/* Product Variants */}
          <FormSection
            icon={MdPalette}
            title="Product Variants"
            iconColor="text-purple-600"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Colors (Optional)"
                icon={MdPalette}
                placeholder="Red, Blue, Green"
                register={register("color")}
                helpText="Separate multiple colors with commas"
              />

              <FormInput
                label="Sizes (Optional)"
                icon={MdStraighten}
                placeholder="S, M, L, XL"
                register={register("size")}
                helpText="Separate multiple sizes with commas"
              />
            </div>
          </FormSection>

          {/* Product Images */}
          <FormSection
            icon={MdImage}
            title="Product Images"
            iconColor="text-pink-600"
          >
            <ImageUploadZone
              fileInputRef={fileInputRef}
              uploading={uploading}
              totalImages={totalImages}
              maxImages={4}
              isDragging={isDragging}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleDropZoneClick}
              onFileChange={(e) => handleImageUpload(e.target.files)}
            />

            {(existingImages.length > 0 || newImageURLs.length > 0) && (
              <div className="space-y-4">
                <ImagePreview
                  images={existingImages}
                  label="Existing"
                  onRemove={handleRemoveExistingImage}
                />

                <ImagePreview
                  images={newImageURLs}
                  label="New"
                  onRemove={handleRemoveNewImage}
                  badgeColor="green"
                />
              </div>
            )}
          </FormSection>

          {/* Description */}
          <FormSection
            icon={MdDescription}
            title="Product Description"
            iconColor="text-indigo-600"
          >
            <FormTextarea
              label="Description"
              icon={MdDescription}
              required
              placeholder="Describe your product in detail..."
              register={register("description", { required: true })}
              error={errors.description}
              rows={5}
            />
          </FormSection>

          <SubmitButton
            uploading={uploading}
            isPending={isPending}
            icon={FiEdit3}
            label="Update Product"
          />
        </form>
      </div>
    </div>
  );
};

export default EditProduct;