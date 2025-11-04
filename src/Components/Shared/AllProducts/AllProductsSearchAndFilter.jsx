import Select from "react-select";

const AllProductsSearchAndFilter = ({
  searchOptions,
  searchType,
  setSearchType,
  setPage,
  searchTerm,
  setSearchTerm,
  sortOptions,
  sort,
  setSort,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-2 items-center mb-6">
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
        options={sortOptions}
        value={sortOptions.find((o) => o.value === sort)}
        onChange={(selected) => {
          setSort(selected?.value || null);
          setPage(0);
        }}
        placeholder="Sort by Price"
        className="w-full"
        isClearable
      />
    </div>
  );
};

export default AllProductsSearchAndFilter;