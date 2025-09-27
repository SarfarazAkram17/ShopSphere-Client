import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Loader/Loader";
import MyStoreEditModal from "../../../Components/Shared/MyStore/MyStoreEditModal";
import StoreInfoCard from "../../../Components/Shared/MyStore/StoreInfoCard";
import SellerPersonalInfoCard from "../../../Components/Shared/MyStore/SellerPersonalInfoCard";
import { uploadToCloudinary } from "../../../lib/imageUpload";

const MyStore = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const {
    isPending,
    data: store,
    refetch,
  } = useQuery({
    queryKey: ["myStore", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sellers/myStore?email=${userEmail}`);
      return res.data;
    },
    enabled: !!userEmail,
  });

  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // React Select states
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
    "Toys",
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetch("/regions.json")
      .then((res) => res.json())
      .then((data) => setRegions(data));

    fetch("/outlets.json")
      .then((res) => res.json())
      .then((data) => setOutlets(data));
  }, []);

  useEffect(() => {
    if (store) {
      setFormData({ ...store });
      setLogoPreview(store.storeLogo || null);
      setCoverPreview(store.coverImage || null);

      // Set react-select default values
      setSelectedRegion(
        store.region ? { value: store.region, label: store.region } : null
      );
      setSelectedDistrict(
        store.district ? { value: store.district, label: store.district } : null
      );
      setSelectedThana(
        store.thana ? { value: store.thana, label: store.thana } : null
      );
      setSelectedCategories(
        store.categories?.map((c) => ({ value: c.toLowerCase(), label: c })) ||
          []
      );

      // Populate districts and thanas based on store data
      if (store.region) {
        const filteredDistricts = outlets
          .filter((o) => o.region === store.region)
          .map((o) => o.district);
        setDistricts([...new Set(filteredDistricts)]);
      }
      if (store.district) {
        const districtOutlets = outlets.filter(
          (o) => o.region === store.region && o.district === store.district
        );
        const covered = districtOutlets.flatMap((o) => o.covered_area);
        setThanas(covered);
      }
    }
  }, [store, outlets]);

  if (isPending) return <Loader />;

  const handleEdit = (type) => {
    setActiveModal(type);
    setFormData({ ...store });
    setLogoPreview(store?.storeLogo || null);
    setCoverPreview(store?.coverImage || null);
    setLogoFile(null);
    setCoverFile(null);
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "logo") {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // React Select handlers
  const handleRegionChange = (selected) => {
    setSelectedRegion(selected);
    setFormData((p) => ({ ...p, region: selected?.value || "" }));

    if (selected) {
      const filteredDistricts = outlets
        .filter((o) => o.region === selected.value)
        .map((o) => o.district);
      setDistricts([...new Set(filteredDistricts)]);
    } else setDistricts([]);

    setSelectedDistrict(null);
    setSelectedThana(null);
    setThanas([]);
    setFormData((p) => ({ ...p, district: "", thana: "" }));
  };

  const handleDistrictChange = (selected) => {
    setSelectedDistrict(selected);
    setFormData((p) => ({ ...p, district: selected?.value || "" }));

    if (selected) {
      const districtOutlets = outlets.filter(
        (o) =>
          o.region === selectedRegion?.value && o.district === selected.value
      );
      const covered = districtOutlets.flatMap((o) => o.covered_area);
      setThanas(covered);
    } else setThanas([]);

    setSelectedThana(null);
    setFormData((p) => ({ ...p, thana: "" }));
  };

  const handleThanaChange = (selected) => {
    setSelectedThana(selected);
    setFormData((p) => ({ ...p, thana: selected?.value || "" }));
  };

  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected || []);
    setFormData((p) => ({
      ...p,
      categories: selected ? selected.map((c) => c.value) : [],
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      let logoUrl = store.storeLogo;
      let coverUrl = store.coverImage;

      if (logoFile) logoUrl = await uploadToCloudinary(logoFile);
      if (coverFile) coverUrl = await uploadToCloudinary(coverFile);

      const payload =
        activeModal === "personal"
          ? {
              age: Number(formData.age),
              phone: formData.phone,
              experience: Number(formData.experience),
              updatedAt: new Date().toISOString(),
            }
          : {
              storeAddress: formData.storeAddress,
              region: formData.region,
              district: formData.district,
              thana: formData.thana,
              storeName: formData.storeName,
              stripeAccountId: formData.stripeAccountId,
              categories: formData.categories,
              storeLogo: logoUrl,
              coverImage: coverUrl,
              updatedAt: new Date().toISOString(),
            };

      await axiosSecure.patch(
        `/sellers/myStore/${store._id}?email=${userEmail}`,
        payload
      );

      toast.success(
        `${
          activeModal === "personal" ? "Personal details" : "Store details"
        } updated successfully!`
      );
      setActiveModal(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const isSaveDisabled = () => {
    if (activeModal === "personal") {
      return (
        Number(formData.age) === store?.age &&
        formData.phone === store?.phone &&
        Number(formData.experience) === store?.experience
      );
    }
    return (
      formData.storeAddress === store?.storeAddress &&
      formData.region === store?.region &&
      formData.district === store?.district &&
      formData.thana === store?.thana &&
      formData.storeName === store?.storeName &&
      formData.stripeAccountId === store?.stripeAccountId &&
      formData.categories?.join(",") === store?.categories?.join(",") &&
      logoPreview === store?.storeLogo &&
      coverPreview === store?.coverImage
    );
  };

  return (
    <div className="px-4">
      <h1 className="text-3xl sm:text-4xl text-primary font-bold text-center mb-5">
        My Store
      </h1>

      {/* Personal Infos */}
      <SellerPersonalInfoCard
        store={store}
        handleEdit={handleEdit}
      ></SellerPersonalInfoCard>

      {/* Store Infos */}
      <StoreInfoCard store={store} handleEdit={handleEdit}></StoreInfoCard>

      {/* Modal */}
      <MyStoreEditModal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        store={store}
        formData={formData}
        setFormData={setFormData}
        regions={regions}
        selectedRegion={selectedRegion}
        handleRegionChange={handleRegionChange}
        districts={districts}
        selectedDistrict={selectedDistrict}
        handleDistrictChange={handleDistrictChange}
        thanas={thanas}
        selectedThana={selectedThana}
        handleThanaChange={handleThanaChange}
        categories={categories}
        selectedCategories={selectedCategories}
        handleCategoryChange={handleCategoryChange}
        logoPreview={logoPreview}
        coverPreview={coverPreview}
        handleUpdate={handleUpdate}
        handleImageChange={handleImageChange}
        loading={loading}
        isSaveDisabled={isSaveDisabled}
      ></MyStoreEditModal>
    </div>
  );
};

export default MyStore;