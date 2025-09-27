const SellerPersonalInfoEditForm = ({ store, formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <p>
        <span className="font-medium">Name:</span> {store?.name}
      </p>
      <p>
        <span className="font-medium">Email:</span> {store?.email}
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
      <label>
        Age
        <input
          className="input input-bordered w-full mt-1 mb-4"
          type="number"
          value={formData.age || ""}
          onChange={(e) =>
            setFormData((p) => ({
              ...p,
              age: e.target.value,
            }))
          }
        />
      </label>
      <label>
        Experience
        <input
          className="input input-bordered w-full mt-1 mb-4"
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
      <label>
        Phone
        <input
          className="input input-bordered w-full mt-1"
          value={formData.phone || ""}
          onChange={(e) =>
            setFormData((p) => ({ ...p, phone: e.target.value }))
          }
        />
      </label>
    </div>
  );
};

export default SellerPersonalInfoEditForm;