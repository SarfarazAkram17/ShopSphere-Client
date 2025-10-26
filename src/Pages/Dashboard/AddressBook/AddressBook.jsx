import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineHome,
  AiOutlinePhone,
  AiOutlineUser,
  AiOutlineCheck,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import { BsBriefcase, BsBuilding } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiMap } from "react-icons/bi";
import Select from "react-select";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Loader/Loader";
import { toast } from "react-toastify";

const AddressBook = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDefaultShippingModal, setShowDefaultShippingModal] =
    useState(false);
  const [showDefaultBillingModal, setShowDefaultBillingModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [tempDefaultShipping, setTempDefaultShipping] = useState(null);
  const [tempDefaultBilling, setTempDefaultBilling] = useState(null);

  // Location data states
  const [regions, setRegions] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [thanas, setThanas] = useState([]);
  const [selectedThana, setSelectedThana] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    region: "",
    district: "",
    thana: "",
    building: "",
    address: "",
    label: "HOME",
  });

  useEffect(() => {
    fetch("/regions.json")
      .then((res) => res.json())
      .then((data) => setRegions(data));

    fetch("/outlets.json")
      .then((res) => res.json())
      .then((data) => setOutlets(data));
  }, []);

  const {
    data: addresses = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["addresses", userEmail],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/users/address?email=${userEmail}`
      );
      return response.data;
    },
  });
  // done
  const addMutation = useMutation({
    mutationFn: (newAddress) =>
      axiosSecure.post(`/users/address?email=${userEmail}`, newAddress),
    onSuccess: () => {
      refetch();
      setShowAddModal(false);
      resetForm();
    },
  });
  // done
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) =>
      axiosSecure.put(`/users/address/${id}?email=${userEmail}`, data),
    onSuccess: () => {
      refetch();
      setShowEditModal(false);
      resetForm();
    },
  });
  // done
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.delete(`/users/address/${id}?email=${userEmail}`),
    onSuccess: () => {
      refetch();
      setShowDeleteModal(false);
      setShowEditModal(false);
      setShowAddModal(false);
      setSelectedAddress(null);
    },
  });
  // done
  const setDefaultShippingMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.put(
        `/users/address/${id}/default-shipping?email=${userEmail}`
      ),
    onSuccess: () => {
      refetch();
      setShowDefaultShippingModal(false);
      setTempDefaultShipping(null);
    },
  });
  // done
  const setDefaultBillingMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.put(
        `/users/address/${id}/default-billing?email=${userEmail}`
      ),
    onSuccess: () => {
      refetch();
      setShowDefaultBillingModal(false);
      setTempDefaultBilling(null);
    },
  });
  // done
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      region: "",
      district: "",
      thana: "",
      building: "",
      address: "",
      label: "HOME",
    });
    setSelectedAddress(null);
    setSelectedRegion(null);
    setSelectedDistrict(null);
    setSelectedThana(null);
    setDistricts([]);
    setThanas([]);
  };
  // done
  const handleRegionChange = (selected) => {
    setSelectedRegion(selected);
    setFormData({
      ...formData,
      region: selected ? selected.value : "",
      district: "",
      thana: "",
    });

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
    setSelectedThana(null);
  };
  // done
  const handleDistrictChange = (selected) => {
    setSelectedDistrict(selected);
    setFormData({
      ...formData,
      district: selected ? selected.value : "",
      thana: "",
    });

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
  };
  // done
  const handleThanaChange = (selected) => {
    setSelectedThana(selected);
    setFormData({ ...formData, thana: selected ? selected.value : "" });
  };
  // done
  const handleEdit = (address) => {
    setSelectedAddress(address);
    setFormData(address);

    // Set the region
    const region = { value: address.region, label: address.region };
    setSelectedRegion(region);

    // Load districts for the region
    const filteredDistricts = outlets
      .filter((o) => o.region === address.region)
      .map((o) => o.district);
    setDistricts([...new Set(filteredDistricts)]);

    // Set the district
    const district = { value: address.district, label: address.district };
    setSelectedDistrict(district);

    // Load thanas for the district
    const districtOutlets = outlets.filter(
      (o) => o.region === address.region && o.district === address.district
    );
    const covered = districtOutlets.flatMap((o) => o.covered_area);
    setThanas(covered);

    // Set the thana
    const thana = { value: address.thana, label: address.thana };
    setSelectedThana(thana);

    setShowEditModal(true);
  };
  // done
  const handleDelete = (address) => {
    setSelectedAddress(address);
    setShowDeleteModal(true);
  };
  // done
  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.region ||
      !formData.district ||
      !formData.thana ||
      !formData.address
    ) {
      return toast.warn("Fill all the fields");
    }

    if (showEditModal) {
      updateMutation.mutate({ id: selectedAddress._id, ...formData });
    } else {
      addMutation.mutate(formData);
    }
  };
  // done
  const openDefaultShippingModal = () => {
    const currentDefault = addresses.find((addr) => addr.isDefaultShipping);
    setTempDefaultShipping(currentDefault?._id || null);
    setShowDefaultShippingModal(true);
  };
  // done
  const openDefaultBillingModal = () => {
    const currentDefault = addresses.find((addr) => addr.isDefaultBilling);
    setTempDefaultBilling(currentDefault?._id || null);
    setShowDefaultBillingModal(true);
  };
  // done
  const handleSaveDefaultShipping = () => {
    if (tempDefaultShipping) {
      setDefaultShippingMutation.mutate(tempDefaultShipping);
    }
  };
  // done
  const handleSaveDefaultBilling = () => {
    if (tempDefaultBilling) {
      setDefaultBillingMutation.mutate(tempDefaultBilling);
    }
  };
  // done
  const handleCloseDefaultShippingModal = () => {
    setShowDefaultShippingModal(false);
    setTempDefaultShipping(null);
  };
  // done
  const handleCloseDefaultBillingModal = () => {
    setShowDefaultBillingModal(false);
    setTempDefaultBilling(null);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen px-4">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <HiOutlineLocationMarker className="w-10 h-10" />
                Address Book
              </h1>
              <p className="text-teal-50">
                Manage your delivery and billing addresses
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <AiOutlinePlus size={22} />
              Add Address
            </button>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
          <div className="flex gap-4 justify-center">
            <button
              onClick={openDefaultShippingModal}
              className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-teal-600 font-medium hover:scale-105 cursor-pointer"
            >
              <HiOutlineLocationMarker size={20} />
              Set Default Shipping
            </button>
            <button
              onClick={openDefaultBillingModal}
              className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-cyan-600 font-medium hover:scale-105 cursor-pointer"
            >
              <BsBuilding size={20} />
              Set Default Billing
            </button>
          </div>
        </div>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((address) => (
          <div
            key={address._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105 flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      address.label === "HOME" ? "bg-orange-100" : "bg-teal-100"
                    }`}
                  >
                    {address.label === "HOME" ? (
                      <AiOutlineHome
                        className={`w-6 h-6 ${
                          address.label === "HOME"
                            ? "text-orange-600"
                            : "text-teal-600"
                        }`}
                      />
                    ) : (
                      <BsBriefcase className="w-6 h-6 text-teal-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {address.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        address.label === "HOME"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {address.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-3 mb-4 flex-1">
                <div className="flex items-start gap-2 text-gray-600">
                  <HiOutlineLocationMarker className="w-4 h-4 mt-1 flex-shrink-0 text-teal-500" />
                  <p className="text-sm leading-relaxed">{address.address}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BiMap className="w-4 h-4 flex-shrink-0 text-cyan-500" />
                  <p className="text-sm">
                    {address.region} • {address.district} • {address.thana}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <AiOutlinePhone className="w-4 h-4 flex-shrink-0 text-purple-500" />
                  <p className="text-sm font-medium">{address.phone}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {address.isDefaultShipping && (
                  <span className="text-xs px-3 py-1 bg-teal-50 text-teal-700 rounded-full font-medium border border-teal-200">
                    ✓ Default Shipping
                  </span>
                )}
                {address.isDefaultBilling && (
                  <span className="text-xs px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full font-medium border border-cyan-200">
                    ✓ Default Billing
                  </span>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleEdit(address)}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all group-hover:scale-105 cursor-pointer mt-auto"
              >
                <AiOutlineEdit size={18} />
                Edit Address
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-15">
          <div className="bg-white rounded-2xl shadow-lg p-12 inline-block">
            <HiOutlineLocationMarker className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No addresses yet
            </h3>
            <p className="text-gray-500 mb-6">
              Add your first address to get started
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-all cursor-pointer"
            >
              <AiOutlinePlus size={20} />
              Add New Address
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <HiOutlineLocationMarker className="w-7 h-7" />
                  {showEditModal ? "Edit Address" : "Add New Address"}
                </h2>
                <div className="flex items-center gap-3">
                  {showEditModal && (
                    <button
                      onClick={() => handleDelete(selectedAddress)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-red-600 transition-all cursor-pointer"
                    >
                      <AiOutlineDelete size={18} />
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="bg-white/20 text-white p-2 rounded-xl hover:bg-white/30 transition-all cursor-pointer"
                  >
                    <AiOutlineClose size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <AiOutlineUser size={16} className="text-teal-500" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first and last name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <AiOutlinePhone size={16} className="text-teal-500" />
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Please enter your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BiMap size={16} className="text-teal-500" />
                      Region <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={regions.map((r) => ({ value: r, label: r }))}
                      value={selectedRegion}
                      onChange={handleRegionChange}
                      placeholder="Select Region"
                      className="text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "0.75rem",
                          borderWidth: "2px",
                          borderColor: "#e5e7eb",
                          padding: "0.25rem",
                          "&:hover": { borderColor: "#14b8a6" },
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={districts.map((d) => ({ value: d, label: d }))}
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      isDisabled={!selectedRegion}
                      placeholder="Select District"
                      className="text-sm"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "0.75rem",
                          borderWidth: "2px",
                          borderColor: "#e5e7eb",
                          padding: "0.25rem",
                          backgroundColor: state.isDisabled
                            ? "#f3f4f6"
                            : "white",
                          "&:hover": {
                            borderColor: state.isDisabled
                              ? "#e5e7eb"
                              : "#14b8a6",
                          },
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thana <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={thanas.map((t) => ({ value: t, label: t }))}
                      value={selectedThana}
                      onChange={handleThanaChange}
                      isDisabled={!selectedRegion || !selectedDistrict}
                      placeholder="Select Thana"
                      className="text-sm"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "0.75rem",
                          borderWidth: "2px",
                          borderColor: "#e5e7eb",
                          padding: "0.25rem",
                          backgroundColor: state.isDisabled
                            ? "#f3f4f6"
                            : "white",
                          "&:hover": {
                            borderColor: state.isDisabled
                              ? "#e5e7eb"
                              : "#14b8a6",
                          },
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BsBuilding size={16} className="text-teal-500" />
                      Building / House No / Floor / Street
                    </label>
                    <input
                      type="text"
                      placeholder="Please enter"
                      value={formData.building}
                      onChange={(e) =>
                        setFormData({ ...formData, building: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <HiOutlineLocationMarker
                        size={16}
                        className="text-teal-500"
                      />
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="For Example: House# 123, Street# 123, ABC Road"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Label Selection */}
                <div className="pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Select Address Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() =>
                        setFormData({ ...formData, label: "HOME" })
                      }
                      className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-3 transition-all cursor-pointer ${
                        formData.label === "HOME"
                          ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <AiOutlineHome
                        size={24}
                        className={
                          formData.label === "HOME"
                            ? "text-orange-600"
                            : "text-gray-400"
                        }
                      />
                      <span
                        className={`font-bold text-lg ${
                          formData.label === "HOME"
                            ? "text-orange-700"
                            : "text-gray-600"
                        }`}
                      >
                        HOME
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, label: "OFFICE" })
                      }
                      className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-3 transition-all cursor-pointer ${
                        formData.label === "OFFICE"
                          ? "border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-100 shadow-lg scale-105"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <BsBriefcase
                        size={24}
                        className={
                          formData.label === "OFFICE"
                            ? "text-teal-600"
                            : "text-gray-400"
                        }
                      />
                      <span
                        className={`font-bold text-lg ${
                          formData.label === "OFFICE"
                            ? "text-teal-700"
                            : "text-gray-600"
                        }`}
                      >
                        OFFICE
                      </span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={addMutation.isPending || updateMutation.isPending}
                    className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    {addMutation.isPending || updateMutation.isPending ? (
                      "Saving..."
                    ) : (
                      <>
                        <AiOutlineCheck size={20} />
                        Save Address
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAddress && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <AiOutlineDelete className="w-7 h-7" />
                Delete Address?
              </h3>
            </div>
            <div className="p-8">
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this address? This action cannot
                be undone.
              </p>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl mb-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                  <AiOutlineUser className="w-5 h-5 text-teal-500 mt-1" />
                  <div>
                    <p className="font-bold text-gray-800">
                      {selectedAddress.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HiOutlineLocationMarker className="w-5 h-5 text-teal-500 mt-1" />
                  <div>
                    <p className="text-gray-700">{selectedAddress.address}</p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.region} • {selectedAddress.district} •{" "}
                      {selectedAddress.thana}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(selectedAddress._id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Default Shipping Modal */}
      {showDefaultShippingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <HiOutlineLocationMarker className="w-7 h-7" />
                Select Default Shipping Address
              </h2>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="flex justify-center items-center py-15 text-gray-500 font-semibold">
                    <span>No Address added yet</span>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => setTempDefaultShipping(address._id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        tempDefaultShipping === address._id
                          ? "border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <div className="font-bold text-gray-800 mb-2">
                              {address.name}
                            </div>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                address.label === "HOME"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-teal-100 text-teal-700"
                              }`}
                            >
                              {address.label}
                            </span>
                          </div>
                          <div className="text-gray-700">{address.address}</div>
                          <div className="text-gray-600 text-sm">
                            {address.region} • {address.district} •{" "}
                            {address.thana}
                          </div>
                          <div>
                            <div className="text-gray-700 font-medium">
                              {address.phone}
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                              {address.isDefaultShipping && (
                                <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full w-fit">
                                  Current Default Shipping
                                </span>
                              )}
                              {address.isDefaultBilling && (
                                <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full w-fit">
                                  Default Billing
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            tempDefaultShipping === address._id
                              ? "border-teal-500 bg-teal-500"
                              : "border-gray-300"
                          }`}
                        >
                          {tempDefaultShipping === address._id && (
                            <AiOutlineCheck size={16} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
              <button
                onClick={handleCloseDefaultShippingModal}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDefaultShipping}
                disabled={setDefaultShippingMutation.isPending}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {setDefaultShippingMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <AiOutlineCheck size={20} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Default Billing Modal */}
      {showDefaultBillingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <BsBuilding className="w-7 h-7" />
                Select Default Billing Address
              </h2>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="flex justify-center items-center py-15 text-gray-500 font-semibold">
                    <span>No Address added yet</span>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => setTempDefaultBilling(address._id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        tempDefaultBilling === address._id
                          ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <div className="font-bold text-gray-800 mb-2">
                              {address.name}
                            </div>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                address.label === "HOME"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-teal-100 text-teal-700"
                              }`}
                            >
                              {address.label}
                            </span>
                          </div>
                          <div className="text-gray-700">{address.address}</div>
                          <div className="text-gray-600 text-sm">
                            {address.region} • {address.district} •{" "}
                            {address.thana}
                          </div>
                          <div>
                            <div className="text-gray-700 font-medium">
                              {address.phone}
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                              {address.isDefaultShipping && (
                                <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full w-fit">
                                  Default Shipping
                                </span>
                              )}
                              {address.isDefaultBilling && (
                                <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full w-fit">
                                  Current Default Billing
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            tempDefaultBilling === address._id
                              ? "border-cyan-500 bg-cyan-500"
                              : "border-gray-300"
                          }`}
                        >
                          {tempDefaultBilling === address._id && (
                            <AiOutlineCheck size={16} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
              <button
                onClick={handleCloseDefaultBillingModal}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDefaultBilling}
                disabled={setDefaultBillingMutation.isPending}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {setDefaultBillingMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <AiOutlineCheck size={20} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;