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

  // React Hook Form
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

        // ✅ set default value for Controller
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

  // todo: send color and size and from backend handle required things
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

    // Conditionally add size if not empty
    if (data.size?.trim()) {
      updatedProduct.size = data.size
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    updateProduct(updatedProduct);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">
        Edit Product: {productData.name}
      </h2>

      <form onSubmit={handleSubmit(handleProductUpdate)} className="space-y-4">
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
              max: {
                value: 1000000,
                message: "Price must be less than 1000000.",
              },
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
                className="text-xs xl:text-sm mt-1 w-full"
              />
            )}
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
            Color (Optional)
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
            Size (Optional)
          </label>
          <input
            type="text"
            placeholder="Size (separated with comma)"
            className="input input-bordered w-full"
            {...register("size")}
          />
        </div>

        {/* Existing Images */}
        <div>
          <label className="block font-semibold mb-1">
            Existing Images <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {existingImages.length > 0 ? (
              existingImages.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`existing-img-${i}`}
                    className="h-28 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                No existing image yet.
              </p>
            )}
          </div>
        </div>

        {/* add New Image */}
        <div>
          <label className="block font-semibold mb-1">
            Add New Images <span className="text-red-500">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="file-input file-input-bordered w-full"
            disabled={
              uploading ||
              existingImages.length === 4 ||
              existingImages.length + newImageURLs.length >= 4
            }
          />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
            {newImageURLs.length > 0 &&
              newImageURLs.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`new-uploaded-${i}`}
                    className="h-28 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
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
                <svg
                  className="w-5 h-5 text-primary animate-spin"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="25"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2="75"
                    y2="50"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>{" "}
                {uploading ? (
                  <span className="animate-pulse">Uploading image(s)</span>
                ) : (
                  <span className="animate-pulse">Updating Product</span>
                )}
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
