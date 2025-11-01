import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { uploadToCloudinary } from "../../../lib/imageUpload";
import { useLocationData } from "../../../Hooks/useLocationData";
import { useImageUpload } from "../../../Hooks/useImageUpload";
import PageHeader from "../../../Components/Shared/BecomeASeller/PageHeader";
import PersonalInfoSection from "../../../Components/Shared/BecomeASeller/PersonalInfoSection";
import StoreInfoSection from "../../../Components/Shared/BecomeASeller/StoreInfoSection";
import LocationSection from "../../../Components/Shared/BecomeASeller/LocationSection";
import PaymentSection from "../../../Components/Shared/BecomeASeller/PaymentSection";
import SubmitButton from "../../../Components/Shared/BecomeASeller/SubmitButton";

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

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Toys",
  ];

  // Custom hooks for managing location data and image uploads
  const { regions, districts, thanas, selectedRegion, selectedDistrict } =
    useLocationData(watch, setValue);

  const {
    logoFile,
    coverFile,
    logoPreview,
    coverPreview,
    handleLogoChange,
    handleCoverChange,
    resetImages,
  } = useImageUpload();

  // Set initial form values from user data
  useEffect(() => {
    setValue("name", user.displayName);
    setValue("email", userEmail);
  }, [user, userEmail, setValue]);

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
        resetImages();

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
      <PageHeader />

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <form
          onSubmit={handleSubmit(handleSubmitSellerForm)}
          className="space-y-8"
        >
          <PersonalInfoSection
            register={register}
            errors={errors}
            user={user}
            userEmail={userEmail}
          />

          <StoreInfoSection
            register={register}
            errors={errors}
            control={control}
            categories={categories}
            logoPreview={logoPreview}
            coverPreview={coverPreview}
            handleLogoChange={handleLogoChange}
            handleCoverChange={handleCoverChange}
          />

          <LocationSection
            register={register}
            errors={errors}
            control={control}
            regions={regions}
            districts={districts}
            thanas={thanas}
            selectedRegion={selectedRegion}
            selectedDistrict={selectedDistrict}
          />

          <PaymentSection register={register} errors={errors} />

          <SubmitButton submitting={submitting} />
        </form>
      </div>
    </div>
  );
};

export default BecomeASeller;