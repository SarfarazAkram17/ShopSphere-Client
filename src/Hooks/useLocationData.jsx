import { useEffect, useState } from "react";

export const useLocationData = (watch, setValue) => {
  const [regions, setRegions] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);

  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");

  // Load regions and outlets on mount
  useEffect(() => {
    fetch("/regions.json")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("Error loading regions:", err));

    fetch("/outlets.json")
      .then((res) => res.json())
      .then((data) => setOutlets(data))
      .catch((err) => console.error("Error loading outlets:", err));
  }, []);

  // Update districts when region changes
  useEffect(() => {
    if (selectedRegion) {
      const filteredDistricts = outlets
        .filter((o) => o.region === selectedRegion.value)
        .map((o) => o.district);
      setDistricts([...new Set(filteredDistricts)]);
    } else {
      setDistricts([]);
    }

    setValue("district", null);
    setValue("thana", null);
    setThanas([]);
  }, [selectedRegion, outlets, setValue]);

  // Update thanas when district changes
  useEffect(() => {
    if (selectedDistrict && selectedRegion) {
      const districtOutlets = outlets.filter(
        (o) =>
          o.region === selectedRegion.value &&
          o.district === selectedDistrict.value
      );
      const covered = districtOutlets.flatMap((o) => o.covered_area);
      setThanas(covered);
    } else {
      setThanas([]);
    }

    setValue("thana", null);
  }, [selectedDistrict, selectedRegion, outlets, setValue]);

  return {
    regions,
    districts,
    thanas,
    selectedRegion,
    selectedDistrict,
  };
};