import Select from "react-select";

const PendingSellersSearchAndFilter = ({
  searchOptions,
  searchType,
  setSearchType,
  setPage,
  searchTerm,
  setSearchTerm,
  regions,
  selectedRegion,
  setSelectedRegion,
  districts,
  selectedDistrict,
  setSelectedDistrict,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2 items-center mb-6">
      <Select
        options={searchOptions}
        value={searchType}
        onChange={(selected) => {
          setSearchType(selected);
          setPage(0);
        }}
        className="w-full"
      />
      <label className="input input-bordered w-full h-9.5">
        <input
          type="search"
          required
          placeholder={`Search by ${searchType.value}`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
        />
      </label>
      <Select
        options={regions.map((r) => ({ value: r, label: r }))}
        value={selectedRegion}
        onChange={setSelectedRegion}
        placeholder="Filter by Region"
        className="w-full"
        isClearable
      />
      <Select
        options={districts.map((d) => ({ value: d, label: d }))}
        value={selectedDistrict}
        onChange={setSelectedDistrict}
        placeholder="Filter by District"
        className="w-full"
        isClearable
      />
    </div>
  );
};

export default PendingSellersSearchAndFilter;
