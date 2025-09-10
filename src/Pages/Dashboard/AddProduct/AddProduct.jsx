import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import Select from "react-select";

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
    setValue,
    trigger,
  } = useForm();

  const [uploading, setUploading] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const cloudName = import.meta.env.VITE_cloudinary_cloud_name;
  const uploadPreset = import.meta.env.VITE_cloudinary_preset_name;

  useEffect(() => {
    register("categories", { required: "Choose at least one category." });
  }, [register]);

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
        setSelectedCategories([]);
        reset();
      }
    },
    onError: (err) => {
      toast.error(`Failed to add product: ${err.message}`);
    },
  });

  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected || []);
    setValue("categories", selected ? selected.map((c) => c.value) : []);
    trigger("categories");
  };

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
      color:
        data.color
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0) || null,
      size:
        data.size
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0) || null,
      addedAt: new Date().toISOString(),
    };

    addProduct(newProduct);
  };

  return (
    <div className="px-4">
      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-primary">
        Add New Product
      </h2>
      <p className="text-center text-sm text-gray-600 mb-8 max-w-2xl mx-auto">
        Add a new product item to the menu. Upload 4 image, set price and
        details. Discount defaults to 0% but can be updated.
      </p>

      <form onSubmit={handleSubmit(handleAddProduct)} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Product Name"
            className="input input-bordered w-full"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              Product name is required.
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Price (BDT) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Price (BDT)"
            className="input input-bordered w-full"
            {...register("price", {
              required: "Price is required.",
              min: { value: 1, message: "Price must be greater than 0." },
            })}
          />
          {errors.price && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Discount */}
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Discount (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Discount (%)"
            className="input input-bordered w-full"
            defaultValue={0}
            {...register("discount", { min: 0, max: 100 })}
          />
          <p className="text-xs text-gray-500 mt-1">
            Default 0%. Can be updated up to 100%.
          </p>
        </div>

        {/* Stock */}
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="Stock Quantity"
            className="input input-bordered w-full"
            {...register("stock", {
              required: "Stock quantity is required.",
              min: {
                value: 0,
                message: "Stock must be greater than or equal to 0.",
              },
            })}
          />
          {errors.stock && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {errors.stock.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Product Categories <span className="text-red-500">*</span>
          </label>
          <Select
            options={categories.map((c) => ({
              value: c.toLowerCase(),
              label: c,
            }))}
            value={selectedCategories}
            onChange={handleCategoryChange}
            isMulti
            placeholder="Select Product Categories"
            className="text-xs xl:text-sm mt-1 w-full"
          />
          {errors.categories && (
            <span className="text-red-500 text-xs mt-1 font-semibold">
              {errors.categories.message}
            </span>
          )}
        </div>

        {/* Color */}
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Color (Optional) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Color (separated with comma)"
            className="input input-bordered w-full"
            {...register("color")}
          />
        </div>

        {/* Size */}
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Size (Optional) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Size (separated with comma)"
            className="input input-bordered w-full"
            {...register("size")}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="file-input file-input-bordered w-full"
            disabled={uploading || imageURLs.length >= 4}
          />

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {imageURLs.length > 0 &&
              imageURLs.map((url, index) => (
                <div key={index} className="relative w-full h-28">
                  <img
                    src={url}
                    alt="Product"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded opacity-80 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>

          <p className="text-xs text-gray-600 mt-1">
            {imageURLs.length === 4
              ? "You have uploaded 4 images."
              : `Uploaded: ${imageURLs.length} / 4`}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1 text-sm text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full resize-none"
            rows={4}
            {...register("description", { required: true })}
          />
          {errors.description && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              Product description is required.
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            className="btn w-full mt-8 btn-primary disabled:text-black/50 text-white"
            disabled={uploading || isPending}
            type="submit"
          >
            {uploading || isPending ? (
              <>
                <span className="loading loading-spinner text-primary"></span>{" "}
                {uploading ? (
                  <span className="animate-pulse">Uploading image(s)</span>
                ) : (
                  <span className="animate-pulse">Adding Product</span>
                )}
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;