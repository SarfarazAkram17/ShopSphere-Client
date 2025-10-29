import FormInput from "./FormInput";
import LocationSelect from "./LocationSelect";
import AddressTypeSelector from "./AddressTypeSelector";

const AddressForm = ({
  formData,
  setFormData,
  selectedRegion,
  selectedDistrict,
  selectedThana,
  regions,
  districts,
  thanas,
  onRegionChange,
  onDistrictChange,
  onThanaChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          icon="user"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your first and last name"
          required
        />

        <FormInput
          label="Phone Number"
          icon="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Please enter your phone number"
          required
        />

        <LocationSelect
          label="Region"
          options={regions.map((r) => ({ value: r, label: r }))}
          value={selectedRegion}
          onChange={onRegionChange}
          placeholder="Select Region"
          required
        />

        <LocationSelect
          label="District"
          options={districts.map((d) => ({ value: d, label: d }))}
          value={selectedDistrict}
          onChange={onDistrictChange}
          placeholder="Select District"
          isDisabled={!selectedRegion}
          required
        />

        <LocationSelect
          label="Thana"
          options={thanas.map((t) => ({ value: t, label: t }))}
          value={selectedThana}
          onChange={onThanaChange}
          placeholder="Select Thana"
          isDisabled={!selectedRegion || !selectedDistrict}
          required
        />

        <FormInput
          label="Building / House No / Floor / Street"
          icon="building"
          value={formData.building}
          onChange={(e) =>
            setFormData({ ...formData, building: e.target.value })
          }
          placeholder="Please enter"
        />

        <div className="col-span-1 md:col-span-2">
          <FormInput
            label="Full Address"
            icon="location"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="For Example: House# 123, Street# 123, ABC Road"
            required
          />
        </div>
      </div>

      <AddressTypeSelector
        selectedType={formData.label}
        onSelect={(label) => setFormData({ ...formData, label })}
      />
    </div>
  );
};

export default AddressForm;