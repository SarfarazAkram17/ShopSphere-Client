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

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = async (files) => {
    if (!files.length) return;
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

      setNewImageURLs((prev) => [...prev, ...uploaded]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleRemoveNewImage = (index) => {
    setNewImageURLs((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- UPDATE Product MUTATION ----------------
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
    if (existingImages.length + newImageURLs.length < 4) {
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
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded-2xl mb-4 shadow-lg">
          <FiEdit3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
          Edit Product
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base">
          Update your product information, images, and pricing to keep your
          listing current and competitive.
        </p>
        {productData && (
          <div className="mt-4 inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-sm text-gray-700">
              Editing:{" "}
              <span className="font-semibold text-primary">
                {productData.name}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <form
          onSubmit={handleSubmit(handleProductUpdate)}
          className="space-y-8"
        >
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <FiPackage className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Basic Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdDescription className="w-4 h-4" />
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> Product name is required
                  </p>
                )}
              </div>

              {/* Categories */}
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
          </div>

          {/* Pricing & Inventory Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <MdAttachMoney className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Pricing & Inventory
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdAttachMoney className="w-4 h-4" />
                  Price (BDT) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  {...register("price", {
                    required: "Price is required.",
                    min: { value: 1, message: "Price must be greater than 0." },
                    max: {
                      value: 1000000,
                      message: "Price must be less than 1000000.",
                    },
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.price.message}
                  </p>
                )}
              </div>

              {/* Discount */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdLocalOffer className="w-4 h-4" />
                  Discount (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  defaultValue={0}
                  {...register("discount", { min: 0, max: 100 })}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Default 0%. Maximum 100%
                </p>
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                <AiOutlineStock className="w-4 h-4" />
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter available quantity"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                {...register("stock", {
                  required: "Stock quantity is required.",
                  min: {
                    value: 0,
                    message: "Stock must be greater than or equal to 0.",
                  },
                })}
              />
              {errors.stock && (
                <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Product Variants Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <MdPalette className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Product Variants
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Color */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdPalette className="w-4 h-4" />
                  Colors (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Red, Blue, Green"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  {...register("color")}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate multiple colors with commas
                </p>
              </div>

              {/* Size */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdStraighten className="w-4 h-4" />
                  Sizes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="S, M, L, XL"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  {...register("size")}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate multiple sizes with commas
                </p>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <MdImage className="w-5 h-5 text-pink-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Product Images
              </h2>
            </div>

            {/* Image Status Badge */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MdImage className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Image Status</p>
                  <p className="text-sm text-gray-600">
                    {totalImages === 4
                      ? "✓ All 4 images uploaded"
                      : `${totalImages} / 4 images (${
                          4 - totalImages
                        } more needed)`}
                  </p>
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-lg font-semibold ${
                  totalImages === 4
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {totalImages === 4 ? "Complete" : "Incomplete"}
              </div>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="flex items-center gap-2 font-semibold mb-3 text-gray-700">
                  <MdImage className="w-4 h-4" />
                  Current Images ({existingImages.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Current ${index + 1}`}
                        className="w-full h-40 sm:h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(url)}
                        className="absolute top-2 right-2 bg-red-500 text-white text-sm w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 flex items-center justify-center shadow-lg cursor-pointer"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                        Current {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div>
              <label className="flex items-center gap-2 font-semibold mb-3 text-gray-700">
                <MdImage className="w-4 h-4" />
                Add New Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all bg-gray-50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="file-input file-input-bordered w-full max-w-md mx-auto"
                  disabled={uploading || totalImages >= 4}
                />
                <p className="text-sm text-gray-600 mt-3">
                  {totalImages >= 4
                    ? "Maximum 4 images reached"
                    : `You can add ${4 - totalImages} more image(s)`}
                </p>
              </div>

              {newImageURLs.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {newImageURLs.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`New ${index + 1}`}
                        className="w-full h-40 sm:h-48 object-cover rounded-xl border-2 border-green-200 shadow-md transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white text-sm w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 flex items-center justify-center shadow-lg cursor-pointer"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                        New {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <MdDescription className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Product Description
              </h2>
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                <MdDescription className="w-4 h-4" />
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe your product in detail..."
                className="textarea textarea-bordered w-full resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                rows={5}
                {...register("description", { required: true })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                  <span>⚠</span> Product description is required
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              className="btn w-full btn-primary text-white disabled:cursor-not-allowed"
              disabled={uploading || isPending}
              type="submit"
            >
              {uploading || isPending ? (
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />
                  </svg>
                  <span>
                    {uploading ? "Uploading images..." : "Updating product..."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FiEdit3 className="w-5 h-5" />
                  <span>Update Product</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;