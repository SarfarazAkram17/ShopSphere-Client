import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdCake,
  MdWorkHistory,
} from "react-icons/md";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";

export const PersonalInfoSection = ({ register, errors, user, userEmail }) => (
  <div className="space-y-6">
    <SectionHeader icon={MdPerson} title="Personal Information" color="blue" />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Name" icon={MdPerson} error={errors.name} required>
        <input
          type="text"
          value={user.displayName}
          readOnly
          className="input input-bordered w-full bg-gray-50 focus:outline-none"
          {...register("name", { required: "Name is required" })}
        />
      </FormField>

      <FormField label="Email" icon={MdEmail} error={errors.email} required>
        <input
          type="email"
          value={userEmail}
          readOnly
          className="input input-bordered w-full bg-gray-50 focus:outline-none"
          {...register("email", { required: "Email is required" })}
        />
      </FormField>

      <FormField label="Age" icon={MdCake} error={errors.age} required>
        <input
          type="number"
          placeholder="Enter your age"
          className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          {...register("age", {
            required: "Age is required",
            min: { value: 18, message: "You must be at least 18 years old" },
          })}
        />
      </FormField>

      <FormField label="Phone" icon={MdPhone} error={errors.phone} required>
        <input
          type="tel"
          placeholder="Enter your phone number"
          className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          {...register("phone", { required: "Phone number is required" })}
        />
      </FormField>

      <div className="md:col-span-2">
        <FormField
          label="Experience (Years)"
          icon={MdWorkHistory}
          error={errors.experience}
          required
        >
          <input
            type="number"
            placeholder="Enter your delivery experience in years"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            {...register("experience", {
              required: "Experience is required",
              min: { value: 0, message: "Experience cannot be negative" },
            })}
          />
        </FormField>
      </div>
    </div>
  </div>
);

export default PersonalInfoSection;