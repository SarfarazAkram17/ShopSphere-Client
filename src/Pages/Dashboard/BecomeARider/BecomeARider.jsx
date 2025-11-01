import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useLocationData } from "../../../Hooks/useLocationData";
import PageHeader from "../../../Components/Shared/BecomeARider/PageHeader";
import PersonalInfoSection from "../../../Components/Shared/BecomeARider/PersonalInfoSection";
import ServiceAreaSection from "../../../Components/Shared/BecomeARider/ServiceAreaSection";
import PaymentSection from "../../../Components/Shared/BecomeARider/PaymentSection";
import SubmitButton from "../../../Components/Shared/BecomeARider/SubmitButton";

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

  // Custom hook for managing location data
  const { regions, districts, thanas, selectedRegion, selectedDistrict } =
    useLocationData(watch, setValue);

  // Set initial form values from user data
  useEffect(() => {
    setValue("name", user.displayName);
    setValue("email", userEmail);
  }, [user, userEmail, setValue]);

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
          onSubmit={handleSubmit(handleSubmitRiderForm)}
          className="space-y-8"
        >
          <PersonalInfoSection
            register={register}
            errors={errors}
            user={user}
            userEmail={userEmail}
          />

          <ServiceAreaSection
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

export default BecomeARider;