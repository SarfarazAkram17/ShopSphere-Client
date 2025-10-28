import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import Select from "react-select";
import {
  MdAttachMoney,
  MdLocalOffer,
  MdImage,
  MdDescription,
  MdPalette,
  MdStraighten,
} from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { AiOutlineStock } from "react-icons/ai";

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
    <div className="px-4">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded-2xl mb-4 shadow-lg">
          <FiPackage className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
          Add New Product
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base">
          List your product on ShopSphere. Upload high-quality images, set
          competitive pricing, and provide detailed information to attract
          customers.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <form onSubmit={handleSubmit(handleAddProduct)} className="space-y-8">
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
                  control={control}
                  name="categories"
                  rules={{ required: "Choose at least one category." }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={categories.map((c) => ({
                        value: c.toLowerCase(),
                        label: c,
                      }))}
                      className="text-sm w-full"
                      placeholder="Select product categories"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#e5e7eb",
                          "&:hover": { borderColor: "#3b82f6" },
                          boxShadow: "none",
                          minHeight: "45px",
                        }),
                      }}
                      value={
                        field.value
                          ? categories
                              .filter((c) =>
                                field.value.includes(c.toLowerCase())
                              )
                              .map((c) => ({
                                value: c.toLowerCase(),
                                label: c,
                              }))
                          : []
                      }
                      onChange={(selected) =>
                        field.onChange(selected.map((s) => s.value))
                      }
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
                    min: {
                      value: 1,
                      message: "Price must be greater than 0.",
                    },
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

            <div>
              <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                <MdImage className="w-4 h-4" />
                Upload Images <span className="text-red-500">*</span>
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all bg-gray-50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="file-input file-input-bordered w-full max-w-md mx-auto"
                  disabled={uploading || imageURLs.length >= 4}
                />
                <p className="text-sm text-gray-600 mt-3">
                  {imageURLs.length === 4
                    ? "✓ All 4 images uploaded"
                    : `${imageURLs.length} / 4 images uploaded`}
                </p>
              </div>

              {imageURLs.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {imageURLs.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-40 sm:h-48 object-fit rounded-xl border-2 border-gray-200 shadow-md transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 cursor-pointer right-2 bg-red-500 text-white text-sm w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 flex items-center justify-center shadow-lg"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                        Image {index + 1}
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
                    {uploading ? "Uploading images..." : "Adding product..."}
                  </span>
                </div>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;