import { useForm, Controller } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { uploadToCloudinary } from "../../../lib/imageUpload";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdStore,
  MdImage,
  MdLocationOn,
  MdWorkHistory,
  MdCategory,
  MdAccountBalance,
  MdCake,
} from "react-icons/md";
import { FaStore, FaHandshake } from "react-icons/fa";

const BecomeASeller = () => {
  const [submitting, setSubmitting] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user, userEmail } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
    watch,
  } = useForm();

  const [regions, setRegions] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [categories] = useState([
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Toys",
  ]);

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");

  useEffect(() => {
    setValue("name", user.displayName);
    setValue("email", userEmail);
  }, [user, userEmail, setValue]);

  useEffect(() => {
    fetch("/regions.json")
      .then((res) => res.json())
      .then((data) => setRegions(data));

    fetch("/outlets.json")
      .then((res) => res.json())
      .then((data) => setOutlets(data));
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const filteredDistricts = outlets
        .filter((o) => o.region === selectedRegion.value)
        .map((o) => o.district);
      setDistricts([...new Set(filteredDistricts)]);
    } else {
      setDistricts([]);
    }

    setValue("district", null);
    setValue("thana", null);
    setThanas([]);
  }, [selectedRegion, outlets, setValue]);

  useEffect(() => {
    if (selectedDistrict && selectedRegion) {
      const districtOutlets = outlets.filter(
        (o) =>
          o.region === selectedRegion.value &&
          o.district === selectedDistrict.value
      );
      const covered = districtOutlets.flatMap((o) => o.covered_area);
      setThanas(covered);
    } else {
      setThanas([]);
    }

    setValue("thana", null);
  }, [selectedDistrict, selectedRegion, outlets, setValue]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSellerForm = async (data) => {
    if (!logoFile || !coverFile) {
      toast.error("Please upload both store logo and cover image.");
      return;
    }

    setSubmitting(true);

    try {
      const logoUrl = await uploadToCloudinary(logoFile);
      const coverUrl = await uploadToCloudinary(coverFile);

      const sellerApplication = {
        name: data.name,
        email: data.email,
        age: parseInt(data.age),
        phone: data.phone,
        experience: parseInt(data.experience),
        storeAddress: data.storeAddress,
        region: data.region.value,
        district: data.district.value,
        thana: data.thana.value,
        storeName: data.storeName,
        storeLogo: logoUrl,
        coverImage: coverUrl,
        categories: data.categories.map((c) => c.value),
        stripeAccountId: data.stripeAccountId.trim(),
        status: "pending",
        appliedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post(
        `/sellers?email=${userEmail}`,
        sellerApplication
      );

      if (res.data.insertedId) {
        reset();
        setLogoFile(null);
        setCoverFile(null);
        setLogoPreview(null);
        setCoverPreview(null);
        setDistricts([]);
        setThanas([]);

        Swal.fire({
          icon: "success",
          title: "Application Submitted Successfully!",
          text: "Waiting for admin approval.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-12 pb-16 mb-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded-2xl mb-4 shadow-lg">
          <FaHandshake className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
          Become a Seller
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-base leading-relaxed">
          Join ShopSphere as a seller and grow your business online! Fill out
          the application form with your personal and store details. Once
          approved, you'll gain access to the seller dashboard to manage
          products, track orders, and receive secure payouts.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <form
          onSubmit={handleSubmit(handleSubmitSellerForm)}
          className="space-y-8"
        >
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <MdPerson className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdPerson className="w-4 h-4" />
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={user.displayName}
                  readOnly
                  className="input input-bordered w-full bg-gray-50 focus:outline-none"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdEmail className="w-4 h-4" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="input input-bordered w-full bg-gray-50 focus:outline-none"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdCake className="w-4 h-4" />
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  {...register("age", {
                    required: "Age is required",
                    min: {
                      value: 18,
                      message: "You must be at least 18 years old",
                    },
                  })}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.age.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdPhone className="w-4 h-4" />
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdWorkHistory className="w-4 h-4" />
                  Experience (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter your experience in years"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  {...register("experience", {
                    required: "Experience is required",
                    min: { value: 0, message: "Experience cannot be negative" },
                  })}
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.experience.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Store Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <FaStore className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Store Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Name */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdStore className="w-4 h-4" />
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your store name"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  {...register("storeName", {
                    required: "Store name is required",
                  })}
                />
                {errors.storeName && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.storeName.message}
                  </p>
                )}
              </div>

              {/* Store Address */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdLocationOn className="w-4 h-4" />
                  Store Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g: Gulistan, Dhaka-1213"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  {...register("storeAddress", {
                    required: "Store address is required",
                  })}
                />
                {errors.storeAddress && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.storeAddress.message}
                  </p>
                )}
              </div>

              {/* Store Logo */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdImage className="w-4 h-4" />
                  Store Logo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleLogoChange}
                />
                {logoPreview && (
                  <div className="mt-3">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdImage className="w-4 h-4" />
                  Cover Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleCoverChange}
                />
                {coverPreview && (
                  <div className="mt-3">
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Product Categories */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdCategory className="w-4 h-4" />
                  Product Categories <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="categories"
                  control={control}
                  rules={{ required: "Select at least one category" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={categories.map((c) => ({
                        value: c.toLowerCase(),
                        label: c,
                      }))}
                      isMulti
                      placeholder="Select product categories you'll sell"
                      className="text-sm w-full"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#e5e7eb",
                          "&:hover": { borderColor: "#a855f7" },
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

          {/* Location Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <MdLocationOn className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Location Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Region */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdLocationOn className="w-4 h-4" />
                  Region <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="region"
                  control={control}
                  rules={{ required: "Region is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={regions.map((r) => ({ value: r, label: r }))}
                      placeholder="Select Region"
                      className="text-sm w-full"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#e5e7eb",
                          "&:hover": { borderColor: "#22c55e" },
                          boxShadow: "none",
                          minHeight: "45px",
                        }),
                      }}
                    />
                  )}
                />
                {errors.region && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.region.message}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdLocationOn className="w-4 h-4" />
                  District <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="district"
                  control={control}
                  rules={{ required: "District is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={districts.map((d) => ({ value: d, label: d }))}
                      isDisabled={!selectedRegion}
                      placeholder="Select District"
                      className="text-sm w-full"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#e5e7eb",
                          "&:hover": { borderColor: "#22c55e" },
                          boxShadow: "none",
                          minHeight: "45px",
                        }),
                      }}
                    />
                  )}
                />
                {errors.district && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.district.message}
                  </p>
                )}
              </div>

              {/* Thana */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                  <MdLocationOn className="w-4 h-4" />
                  Thana <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="thana"
                  control={control}
                  rules={{ required: "Thana is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={thanas.map((t) => ({ value: t, label: t }))}
                      isDisabled={!selectedRegion || !selectedDistrict}
                      placeholder="Select Thana"
                      className="text-sm w-full"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#e5e7eb",
                          "&:hover": { borderColor: "#22c55e" },
                          boxShadow: "none",
                          minHeight: "45px",
                        }),
                      }}
                    />
                  )}
                />
                {errors.thana && (
                  <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.thana.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <MdAccountBalance className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Payment Information
              </h2>
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                <MdAccountBalance className="w-4 h-4" />
                Stripe Account ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your Stripe Account ID"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                {...register("stripeAccountId", {
                  required: "Stripe Account ID is required",
                })}
              />
              <p className="text-xs text-gray-500 mt-2">
                Connect your Stripe account to receive payments securely
              </p>
              {errors.stripeAccountId && (
                <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.stripeAccountId.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="btn w-full btn-primary text-white disabled:text-black/50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
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
                  <span>Submitting Application...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FaHandshake className="w-5 h-5" />
                  <span>Submit Application</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeASeller;