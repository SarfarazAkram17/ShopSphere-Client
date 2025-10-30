import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const BecomeARider = () => {
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

  useEffect(() => {
    setValue("name", user.displayName);
    setValue("email", userEmail);
  }, [user, userEmail, setValue]);

  // Register react-select fields manually for validation
  useEffect(() => {
    register("region", { required: "Region is required" });
    register("district", { required: "District is required" });
    register("thana", { required: "Thana is required" });
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
    } else {
      setDistricts([]);
    }

    setSelectedDistrict(null);
    setThanas([]);
    setSelectedThana(null); // Reset thana selection
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
    } else {
      setThanas([]);
    }

    setSelectedThana(null);
    setValue("thana", "");
    trigger("thana");
  };

  const handleThanaChange = (selected) => {
    setSelectedThana(selected);
    setValue("thana", selected ? selected.value : "");
    trigger("thana");
  };

  const handleSubmitRiderForm = async (data) => {
    setSubmitting(true);

    try {
      const riderApplication = {
        name: data.name,
        email: data.email,
        age: parseInt(data.age),
        phone: data.phone,
        experience: parseInt(data.experience),
        region: data.region,
        district: data.district,
        thana: data.thana,
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
        setSelectedRegion(null);
        setSelectedDistrict(null);
        setThanas([]);
        setSelectedThana(null);
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
    <div className="px-4 pt-12 pb-16 mb-8">
      <h1 className="text-3xl sm:text-4xl text-primary font-bold text-center mb-5">
        Become a Rider at ShopSphere
      </h1>
      <p className="mb-10 text-center text-xs leading-relaxed max-w-2xl mx-auto">
        Join our delivery team and start earning by delivering delicious meals
        to customers. Simply fill out the form with your details and experience,
        and once approved, you'll get access to your Rider Dashboard to manage
        orders and track earnings. Apply now and start your journey with us!
      </p>

      <form onSubmit={handleSubmit(handleSubmitRiderForm)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              value={user.displayName}
              readOnly
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Address (Read-only) */}
          <div>
            <label className="text-xs font-semibold">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              value={userEmail}
              readOnly
              {...register("email", {
                required: "Email is required",
              })}
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
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              placeholder="Enter your age"
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

          {/* Phone Number */}
          <div>
            <label className="text-xs font-semibold">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full p-2 border border-gray-400 rounded-md text-xs xl:text-sm mt-1"
              {...register("phone", {
                required: "Phone number is required",
              })}
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1 font-semibold">
                {errors.phone.message}
              </span>
            )}
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

          {/* Region Select */}
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

          {/* District Select */}
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

          {/* Thana Select */}
          <div className="md:col-span-2">
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
        </div>

        <button
          type="submit"
          className="btn mt-10 btn-primary w-full text-white disabled:text-black/50"
          disabled={submitting}
        >
          {submitting ? (
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
              </svg>
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

export default BecomeARider;