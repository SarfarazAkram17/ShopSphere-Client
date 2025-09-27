import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Loader/Loader";

const MyStore = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const {
    isPending,
    data: store,
    refetch,
  } = useQuery({
    queryKey: ["myStore", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sellers/myStore?email=${userEmail}`);
      return res.data;
    },
    enabled: !!userEmail,
  });

  const [activeModal, setActiveModal] = useState(null); // "personal" | "store" | null
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  if (isPending) return <Loader />;

  // open modal and preload data
  const handleEdit = (type) => {
    setActiveModal(type);
    setFormData({ ...store });
    setLogoPreview(store?.storeLogo || null);
    setCoverPreview(store?.coverImage || null);
    setLogoFile(null);
    setCoverFile(null);
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "logo") {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_cloudinary_preset_name);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_cloudinary_cloud_name
      }/image/upload`,
      data
    );
    return res.data.secure_url;
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      let logoUrl = store.storeLogo;
      let coverUrl = store.coverImage;

      if (logoFile) logoUrl = await uploadToCloudinary(logoFile);
      if (coverFile) coverUrl = await uploadToCloudinary(coverFile);

      const payload =
        activeModal === "personal"
          ? {
              name: formData.name,
              // email, age, status remain same
            }
          : {
              phone: formData.phone,
              experience: formData.experience,
              storeAddress: formData.storeAddress,
              region: formData.region,
              district: formData.district,
              thana: formData.thana,
              storeName: formData.storeName,
              categories: formData.categories,
              storeLogo: logoUrl,
              coverImage: coverUrl,
            };

      await axiosSecure.patch(`/sellers/myStore/${store._id}`, payload);

      toast.success("Store updated successfully!");
      setActiveModal(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const isSaveDisabled = () => {
    if (activeModal === "personal") {
      return formData.name === store?.name;
    }
    return (
      formData.phone === store?.phone &&
      formData.experience === store?.experience &&
      formData.storeAddress === store?.storeAddress &&
      formData.region === store?.region &&
      formData.district === store?.district &&
      formData.thana === store?.thana &&
      formData.storeName === store?.storeName &&
      formData.categories?.join(",") === store?.categories?.join(",") &&
      logoPreview === store?.storeLogo &&
      coverPreview === store?.coverImage
    );
  };

  return (
    <div className="px-4">
      <h1 className="text-3xl sm:text-4xl text-primary font-bold text-center mb-5">
        My Store
      </h1>

      {/* Personal Infos */}
      <div className="bg-white shadow-md border border-primary rounded-xl p-6 space-y-4 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Personal Information</h2>
          <FaRegEdit
            size={25}
            className="cursor-pointer text-primary"
            onClick={() => handleEdit("personal")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <span className="font-medium">Name:</span> {store?.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {store?.email}
          </p>
          <p>
            <span className="font-medium">Age:</span> {store?.age}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`capitalize font-semibold ${
                store?.status === "active" ? "text-green-600" : "text-red-500"
              }`}
            >
              {store?.status}
            </span>
          </p>
        </div>
      </div>

      {/* Store Infos */}
      <div className="bg-white shadow-md border border-primary rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Store Information</h2>
          <FaRegEdit
            size={25}
            className="cursor-pointer text-primary"
            onClick={() => handleEdit("store")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <span className="font-medium">Phone:</span> {store?.phone}
          </p>
          <p>
            <span className="font-medium">Experience:</span> {store?.experience}{" "}
            years
          </p>
          <p>
            <span className="font-medium">Store Address:</span>{" "}
            {store?.storeAddress}
          </p>
          <p>
            <span className="font-medium">Region:</span> {store?.region}
          </p>
          <p>
            <span className="font-medium">District:</span> {store?.district}
          </p>
          <p>
            <span className="font-medium">Thana:</span> {store?.thana}
          </p>
          <p>
            <span className="font-medium">Store Name:</span> {store?.storeName}
          </p>
          <p>
            <span className="font-medium">Categories:</span>{" "}
            <span className="capitalize">{store?.categories?.join(", ")}</span>
          </p>
          <div>
            <p className="font-medium mb-2">Store Logo:</p>
            <img
              src={store?.storeLogo}
              alt="Store Logo"
              className="w-auto h-32 object-contain rounded"
            />
          </div>
          <div>
            <p className="font-medium mb-2">Cover Image:</p>
            <img
              src={store?.coverImage}
              alt="Cover"
              className="w-auto h-36 object-cover rounded"
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <>
          <div
            className="fixed inset-0 z-40 backdrop-blur-md"
            onClick={() => !loading && setActiveModal(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-h-[95vh] overflow-y-scroll hide-scrollbar border rounded-lg max-w-2xl w-full p-8 relative shadow-xl">
              <button
                onClick={() => !loading && setActiveModal(null)}
                className="absolute top-4 right-4 hover:text-red-500 text-gray-500"
                disabled={loading}
              >
                <FiX size={26} />
              </button>

              <h3 className="text-2xl font-semibold mb-6 text-center">
                Edit{" "}
                {activeModal === "personal" ? "Personal Info" : "Store Info"}
              </h3>

              {/* Personal Form */}
              {activeModal === "personal" && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="font-medium">Name</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </label>
                  <p>
                    <span className="font-medium">Email:</span> {store?.email}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span> {store?.age}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {store?.status}
                  </p>
                </div>
              )}

              {/* Store Form */}
              {activeModal === "store" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label>
                    Phone
                    <input
                      className="input input-bordered w-full"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Experience
                    <input
                      className="input input-bordered w-full"
                      type="number"
                      value={formData.experience || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          experience: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="md:col-span-2">
                    Store Address
                    <input
                      className="input input-bordered w-full"
                      value={formData.storeAddress || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          storeAddress: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    Region
                    <input
                      className="input input-bordered w-full"
                      value={formData.region || ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, region: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    District
                    <input
                      className="input input-bordered w-full"
                      value={formData.district || ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, district: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Thana
                    <input
                      className="input input-bordered w-full"
                      value={formData.thana || ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, thana: e.target.value }))
                      }
                    />
                  </label>
                  <label className="md:col-span-2">
                    Store Name
                    <input
                      className="input input-bordered w-full"
                      value={formData.storeName || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          storeName: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="md:col-span-2">
                    Categories (comma separated)
                    <input
                      className="input input-bordered w-full"
                      value={formData.categories || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          categories: e.target.value.split(","),
                        }))
                      }
                    />
                  </label>

                  {/* Logo */}
                  <div className="md:col-span-1">
                    <p className="font-medium mb-2">Store Logo</p>
                    <img
                      src={logoPreview}
                      alt="logo"
                      className="h-24 w-auto rounded mb-2 object-contain"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "logo")}
                    />
                  </div>

                  {/* Cover */}
                  <div className="md:col-span-1">
                    <p className="font-medium mb-2">Cover Image</p>
                    <img
                      src={coverPreview}
                      alt="cover"
                      className="h-24 w-full rounded mb-2 object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "cover")}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => !loading && setActiveModal(null)}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="btn btn-primary text-white"
                  disabled={loading || isSaveDisabled()}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyStore;