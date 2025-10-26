import { useState, useEffect } from "react";

export const useAddressForm = () => {
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

  const handleThanaChange = (selected) => {
    setSelectedThana(selected);
    setFormData({ ...formData, thana: selected ? selected.value : "" });
  };

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
    setSelectedRegion(null);
    setSelectedDistrict(null);
    setSelectedThana(null);
    setDistricts([]);
    setThanas([]);
  };

  const loadAddressForEdit = (address, outletsData) => {
    setFormData(address);

    const region = { value: address.region, label: address.region };
    setSelectedRegion(region);

    const filteredDistricts = outletsData
      .filter((o) => o.region === address.region)
      .map((o) => o.district);
    setDistricts([...new Set(filteredDistricts)]);

    const district = { value: address.district, label: address.district };
    setSelectedDistrict(district);

    const districtOutlets = outletsData.filter(
      (o) => o.region === address.region && o.district === address.district
    );
    const covered = districtOutlets.flatMap((o) => o.covered_area);
    setThanas(covered);

    const thana = { value: address.thana, label: address.thana };
    setSelectedThana(thana);
  };

  return {
    formData,
    selectedRegion,
    selectedDistrict,
    selectedThana,
    districts,
    thanas,
    regions,
    outlets,
    setFormData,
    setSelectedRegion,
    setSelectedDistrict,
    setSelectedThana,
    handleRegionChange,
    handleDistrictChange,
    handleThanaChange,
    resetForm,
    loadAddressForEdit,
  };
};