import Select from "react-select";

const AllUsersSearchAndFilter = ({
  searchOptions,
  searchType,
  setSearchType,
  setPage,
  searchTerm,
  setSearchTerm,
  roleOptions,
  roleFilter,
  setRoleFilter,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2 items-center mb-6">
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
        options={roleOptions}
        value={roleFilter}
        onChange={(selected) => {
          setRoleFilter(selected);
          setPage(0);
        }}
        className="w-full"
      />
    </div>
  );
};

export default AllUsersSearchAndFilter;