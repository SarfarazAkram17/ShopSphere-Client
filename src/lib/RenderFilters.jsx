// Filters UI as a function so we can reuse in both desktop & mobile drawer
import { Slider, Rate, ConfigProvider } from "antd";
import Select from "react-select";

const RenderFilters = ({
  search,
  setSearch,
  categories,
  category,
  setCategory,
  color,
  setColor,
  size,
  setSize,
  setPriceRange,
  discounts,
  setDiscount,
  setRating,
}) => (
  <>
    {/* First Row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-center">
      <label className="input input-bordered w-full h-9.5">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      <Select
        isMulti
        isClearable
        placeholder="Select Product Category"
        options={categories}
        value={categories.filter((cat) => category.includes(cat.value))}
        onChange={(selectedOptions) =>
          setCategory(
            selectedOptions ? selectedOptions.map((opt) => opt.value) : []
          )
        }
        className="w-full z-5"
      />

      <label className="input input-bordered w-full h-9.5">
        <input
          type="search"
          placeholder="Search product by Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>

      <label className="input input-bordered w-full h-9.5">
        <input
          type="search"
          placeholder="Search product by Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </label>
    </div>

    {/* Second Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-center">
      <div>
        <p className="font-semibold text-sm">Price Range</p>
        <Slider
          range
          min={0}
          max={100000}
          defaultValue={[0, 100000]}
          onChangeComplete={(val) => setPriceRange(val)}
        />
      </div>

      <Select
        isClearable
        placeholder="Min Discount"
        options={discounts}
        onChange={(option) => setDiscount(option ? option.value : null)}
        className="w-full z-4"
      />

      <div>
        <p className="font-semibold text-sm mb-1">Min Rating</p>
        <ConfigProvider
          theme={{
            components: {
              Rate: {
                starBg: "#B5B7B770",
                starSize: 25,
                marginXS: 7,
              },
            },
          }}
        >
          <Rate allowClear onChange={(val) => setRating(val)} />
        </ConfigProvider>
      </div>
    </div>
  </>
);

export default RenderFilters;