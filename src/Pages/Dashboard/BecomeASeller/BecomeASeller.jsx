import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import axios from "axios";

const BecomeASeller = () => {
  const [submitting, setSubmitting] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user, userEmail } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm();

  const [regions, setRegions] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [thanas, setThanas] = useState([]);
  const [selectedThana, setSelectedThana] = useState(null);

  const [categories] = useState([
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Beauty",
    "Sports",
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    setValue("name", user.displayName);
    setValue("email", userEmail);
  }, [user, userEmail, setValue]);

  useEffect(() => {
    register("region", { required: "Region is required" });
    register("district", { required: "District is required" });
    register("thana", { required: "Thana is required" });
    register("categories", { required: "Select at least one category" });
  }, [register]);

  useEffect(() => {
    fetch("/regions.json")
      .then((res) => res.json())
      .then((data) => setRegions(data));

    fetch("/outlets.json")
      .then((res) => res.json())
      .then((data) => setOutlets(data));
  }, []);

  const handleRegionChange = (selected) => {
    setSelectedRegion(selected);
    setValue("region", selected ? selected.value : "");
    trigger("region");

    if (selected) {
      const filteredDistricts = outlets
        .filter((o) => o.region === selected.value)
        .map((o) => o.district);
      setDistricts([...new Set(filteredDistricts)]);
    } else setDistricts([]);

    setSelectedDistrict(null);
    setThanas([]);
    setSelectedThana(null);
    setValue("district", "");
    setValue("thana", "");
    trigger("district");
    trigger("thana");
  };

  const handleDistrictChange = (selected) => {
    setSelectedDistrict(selected);
    setValue("district", selected ? selected.value : "");
    trigger("district");

    if (selected) {
      const districtOutlets = outlets.filter(
        (o) =>
          o.region === selectedRegion?.value && o.district === selected.value
      );
      const covered = districtOutlets.flatMap((o) => o.covered_area);
      setThanas(covered);
    } else setThanas([]);

    setSelectedThana(null);
    setValue("thana", "");
    trigger("thana");
  };

  const handleThanaChange = (selected) => {
    setSelectedThana(selected);
    setValue("thana", selected ? selected.value : "");
    trigger("thana");
  };

  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected || []);
    setValue("categories", selected ? selected.map((c) => c.value) : []);
    trigger("categories");
  };

  const uploadToCloudinary = async (file) => {
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

  const handleSubmitSellerForm = async (data) => {
    if (!logoFile || !coverFile) {
      toast.error("Please upload both store logo and cover image.");
      return;
    }

    setSubmitting(true);

    try {
      // Upload images
      const logoUrl = await uploadToCloudinary(logoFile);
      const coverUrl = await uploadToCloudinary(coverFile);

      const sellerApplication = {
        name: data.name,
        email: data.email,
        age: parseInt(data.age),
        phone: data.phone,
        experience: parseInt(data.experience),
        storeAddress: data.storeAddress,
        region: data.region,
        district: data.district,
        thana: data.thana,
        storeName: data.storeName,
        storeLogo: logoUrl,
        coverImage: coverUrl,
        categories: data.categories,
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
        setSelectedRegion(null);
        setSelectedDistrict(null);
        setThanas([]);
        setSelectedThana(null);
        setSelectedCategories([]);
        setLogoFile(null);
        setCoverFile(null);
        setValue("thana", "");

        Swal.fire({
          icon: "success",
          title: "Application Submitted successfully!",
          text: "Waiting for admin approval.",
          timer: 1500,
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
    <div className="px-4 mb-8">
      <h1 className="text-3xl sm:text-4xl text-primary font-bold text-center mb-5">
        Become a Seller at ShopSphere
      </h1>
      <p className="mb-10 text-center text-xs leading-relaxed max-w-2xl mx-auto">
        Join ShopSphere as a seller and grow your business online! Fill out the
        application form with your personal and store details, select your
        region, district, thana, categories, and connect your Stripe account.
        Once approved, you’ll gain access to the seller dashboard to manage
        products, track orders, and receive secure payouts.
      </p>

      <form onSubmit={handleSubmit(handleSubmitSellerForm)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={user.displayName}
              readOnly
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="text-xs font-semibold">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter your age"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              {...register("age", {
                required: "Age is required",
                min: {
                  value: 18,
                  message: "You must be at least 18 years old",
                },
              })}
            />
            {errors.age && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.age.message}
              </span>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="text-xs font-semibold">
              Experience in years <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter your experience"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              {...register("experience", {
                required: "Experience is required",
              })}
            />
            {errors.experience && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.experience.message}
              </span>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.phone.message}
              </span>
            )}
          </div>

          {/* Store Name */}
          <div>
            <label className="text-xs font-semibold">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter store name"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              {...register("storeName", { required: "Store name is required" })}
            />
            {errors.storeName && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.storeName.message}
              </span>
            )}
          </div>

          {/* Store Logo */}
          <div>
            <label className="text-xs font-semibold">
              Store Logo <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-xs font-semibold">
              Cover Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              onChange={(e) => setCoverFile(e.target.files[0])}
            />
          </div>

          {/* Stripe Account ID */}
          <div>
            <label className="text-xs font-semibold">Stripe Account ID</label>
            <input
              type="text"
              placeholder="Enter your Stripe Account ID"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              {...register("stripeAccountId", {
                required: "Stripe Account ID is required",
              })}
            />
            {errors.stripeAccountId && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.stripeAccountId.message}
              </span>
            )}
          </div>

          {/* Store Address */}
          <div>
            <label className="text-xs font-semibold">
              Store Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter store address (e.g: Gulistan, Dhaka-1213)"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              {...register("storeAddress", {
                required: "Store address is required",
              })}
            />
            {errors.storeAddress && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.storeAddress.message}
              </span>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="text-xs font-semibold">
              Region <span className="text-red-500">*</span>
            </label>
            <Select
              options={regions.map((r) => ({ value: r, label: r }))}
              value={selectedRegion}
              onChange={handleRegionChange}
              placeholder="Select Region"
              className="text-xs xl:text-sm mt-1"
            />
            {errors.region && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.region.message}
              </span>
            )}
          </div>

          {/* District */}
          <div>
            <label className="text-xs font-semibold">
              District <span className="text-red-500">*</span>
            </label>
            <Select
              options={districts.map((d) => ({ value: d, label: d }))}
              value={selectedDistrict}
              onChange={handleDistrictChange}
              isDisabled={!selectedRegion}
              placeholder="Select District"
              className="text-xs xl:text-sm mt-1"
            />
            {errors.district && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.district.message}
              </span>
            )}
          </div>

          {/* Thana */}
          <div>
            <label className="text-xs font-semibold">
              Thana <span className="text-red-500">*</span>
            </label>
            <Select
              options={thanas.map((t) => ({ value: t, label: t }))}
              value={selectedThana}
              onChange={handleThanaChange}
              isDisabled={!selectedRegion || !selectedDistrict}
              placeholder="Select Thana"
              className="text-xs xl:text-sm mt-1"
            />
            {errors.thana && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.thana.message}
              </span>
            )}
          </div>

          {/* Product Categories */}
          <div>
            <label className="text-xs font-semibold">
              Product Categories <span className="text-red-500">*</span>
            </label>
            <Select
              options={categories.map((c) => ({ value: c, label: c }))}
              value={selectedCategories}
              onChange={handleCategoryChange}
              isMulti
              placeholder="Select Product Categories"
              className="text-xs xl:text-sm mt-1"
            />
            {errors.categories && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.categories.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn mt-10 btn-primary w-full text-white disabled:text-black/50"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="loading loading-spinner text-primary"></span>
              <span className="animate-pulse">Submitting Application</span>
            </>
          ) : (
            <>Submit Application</>
          )}
        </button>
      </form>
    </div>
  );
};

export default BecomeASeller;