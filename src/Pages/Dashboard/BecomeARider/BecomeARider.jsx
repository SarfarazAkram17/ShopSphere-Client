import { useForm, Controller } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWorkHistory,
  MdAccountBalance,
  MdCake,
  MdDeliveryDining,
} from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";

const BecomeARider = () => {
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

  const handleSubmitRiderForm = async (data) => {
    setSubmitting(true);

    try {
      const riderApplication = {
        name: data.name,
        email: data.email,
        age: parseInt(data.age),
        phone: data.phone,
        experience: parseInt(data.experience),
        region: data.region.value,
        district: data.district.value,
        thana: data.thana.value,
        stripeAccountId: data.stripeAccountId.trim(),
        status: "pending",
        appliedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post(
        `/riders?email=${userEmail}`,
        riderApplication
      );

      if (res.data.insertedId) {
        reset();
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
          <FaMotorcycle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
          Become a Rider
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-base leading-relaxed">
          Join our delivery team and start earning by delivering products to
          customers. Simply fill out the form with your details and experience,
          and once approved, you'll get access to your Rider Dashboard to manage
          orders and track earnings.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <form
          onSubmit={handleSubmit(handleSubmitRiderForm)}
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
                  placeholder="Enter your delivery experience in years"
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

          {/* Location Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <MdLocationOn className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Service Area
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MdDeliveryDining className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    Service Area Information
                  </p>
                  <p className="text-xs text-gray-600">
                    Select the region, district, and thana where you'll be
                    providing delivery services. This helps us assign orders
                    efficiently.
                  </p>
                </div>
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
                Connect your Stripe account to receive delivery payments
                securely
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
                  <FaMotorcycle className="w-5 h-5" />
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

export default BecomeARider;