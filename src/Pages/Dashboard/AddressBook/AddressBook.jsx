import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Loader/Loader";
import { toast } from "react-toastify";
import { useAddressMutations } from "../../../Hooks/useAddressMutations";
import { useAddressForm } from "../../../Hooks/useAddressForm";
import EmptyState from "../../../Components/Shared/AddressBook/EmptyState";
import AddressBookHeader from "../../../Components/Shared/AddressBook/AddressBookHeader";
import AddressGrid from "../../../Components/Shared/AddressBook/AddressGrid";
import AddressModal from "../../../Components/Shared/AddressBook/AddressModal";
import DeleteModal from "../../../Components/Shared/AddressBook/DeleteModal";
import DefaultAddressModal from "../../../Components/Shared/AddressBook/DefaultAddressModal";

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

  const {
    formData,
    selectedRegion,
    selectedDistrict,
    selectedThana,
    districts,
    thanas,
    regions,
    outlets,
    setFormData,
    handleRegionChange,
    handleDistrictChange,
    handleThanaChange,
    resetForm,
    loadAddressForEdit,
  } = useAddressForm();

  const {
    addMutation,
    updateMutation,
    deleteMutation,
    setDefaultShippingMutation,
    setDefaultBillingMutation,
  } = useAddressMutations(axiosSecure, userEmail, refetch, {
    onAddSuccess: () => {
      setShowAddModal(false);
      resetForm();
    },
    onUpdateSuccess: () => {
      setShowEditModal(false);
      resetForm();
    },
    onDeleteSuccess: () => {
      setShowDeleteModal(false);
      setShowEditModal(false);
      setShowAddModal(false);
      setSelectedAddress(null);
    },
    onDefaultShippingSuccess: () => {
      setShowDefaultShippingModal(false);
      setTempDefaultShipping(null);
    },
    onDefaultBillingSuccess: () => {
      setShowDefaultBillingModal(false);
      setTempDefaultBilling(null);
    },
  });

  const handleEdit = (address) => {
    setSelectedAddress(address);
    loadAddressForEdit(address, outlets);
    setShowEditModal(true);
  };

  const handleDelete = (address) => {
    setSelectedAddress(address);
    setShowDeleteModal(true);
  };

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

  const openDefaultShippingModal = () => {
    const currentDefault = addresses.find((addr) => addr.isDefaultShipping);
    setTempDefaultShipping(currentDefault?._id || null);
    setShowDefaultShippingModal(true);
  };

  const openDefaultBillingModal = () => {
    const currentDefault = addresses.find((addr) => addr.isDefaultBilling);
    setTempDefaultBilling(currentDefault?._id || null);
    setShowDefaultBillingModal(true);
  };

  const handleSaveDefaultShipping = () => {
    if (tempDefaultShipping) {
      setDefaultShippingMutation.mutate(tempDefaultShipping);
    }
  };

  const handleSaveDefaultBilling = () => {
    if (tempDefaultBilling) {
      setDefaultBillingMutation.mutate(tempDefaultBilling);
    }
  };

  const handleCloseModal = (type) => {
    if (type === "add" || type === "edit") {
      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
    } else if (type === "defaultShipping") {
      setShowDefaultShippingModal(false);
      setTempDefaultShipping(null);
    } else if (type === "defaultBilling") {
      setShowDefaultBillingModal(false);
      setTempDefaultBilling(null);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="px-4 pt-12 pb-16">
      <AddressBookHeader
        onAddClick={() => setShowAddModal(true)}
        onDefaultShippingClick={openDefaultShippingModal}
        onDefaultBillingClick={openDefaultBillingModal}
      />

      {addresses.length === 0 ? (
        <EmptyState onAddClick={() => setShowAddModal(true)} />
      ) : (
        <AddressGrid addresses={addresses} onEdit={handleEdit} />
      )}

      {(showAddModal || showEditModal) && (
        <AddressModal
          isEdit={showEditModal}
          formData={formData}
          setFormData={setFormData}
          selectedRegion={selectedRegion}
          selectedDistrict={selectedDistrict}
          selectedThana={selectedThana}
          regions={regions}
          districts={districts}
          thanas={thanas}
          onRegionChange={handleRegionChange}
          onDistrictChange={handleDistrictChange}
          onThanaChange={handleThanaChange}
          onSubmit={handleSubmit}
          onClose={() => handleCloseModal("add")}
          onDelete={() => handleDelete(selectedAddress)}
          isSubmitting={addMutation.isPending || updateMutation.isPending}
          selectedAddress={selectedAddress}
        />
      )}

      {showDeleteModal && selectedAddress && (
        <DeleteModal
          address={selectedAddress}
          onConfirm={() => deleteMutation.mutate(selectedAddress._id)}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={deleteMutation.isPending}
        />
      )}

      {showDefaultShippingModal && (
        <DefaultAddressModal
          type="shipping"
          addresses={addresses}
          selectedId={tempDefaultShipping}
          onSelect={setTempDefaultShipping}
          onSave={handleSaveDefaultShipping}
          onClose={() => handleCloseModal("defaultShipping")}
          isSaving={setDefaultShippingMutation.isPending}
        />
      )}

      {showDefaultBillingModal && (
        <DefaultAddressModal
          type="billing"
          addresses={addresses}
          selectedId={tempDefaultBilling}
          onSelect={setTempDefaultBilling}
          onSave={handleSaveDefaultBilling}
          onClose={() => handleCloseModal("defaultBilling")}
          isSaving={setDefaultBillingMutation.isPending}
        />
      )}
    </div>
  );
};

export default AddressBook;