import { Slider, Rate, ConfigProvider } from "antd";
import Select from "react-select";
import { useState, useEffect } from "react";

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
}) => {
  // Local state to control the slider and inputs together
  const [localRange, setLocalRange] = useState([0, 1000000]);

  // Sync external priceRange updates (if any)
  useEffect(() => {
    setLocalRange((prev) => prev);
  }, []);

  // Handle input box change
  const handleInputChange = (index, value) => {
    let newRange = [...localRange];
    newRange[index] = Number(value) || 0;

    // Ensure min is not greater than max
    if (index === 0 && newRange[0] > newRange[1]) newRange[1] = newRange[0];
    if (index === 1 && newRange[1] < newRange[0]) newRange[0] = newRange[1];

    setLocalRange(newRange);
    setPriceRange(newRange);
  };

  // Handle slider change
  const handleSliderChange = (value) => {
    setLocalRange(value);
    setPriceRange(value);
  };

  return (
    <>
      {/* First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4 items-center">
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
          styles={{
            placeholder: (base) => ({
              ...base,
              fontSize: "13px",
            }),
          }}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 items-end">
        {/* Price Range */}
        <div>
          <p className="font-semibold text-sm mb-1">Price Range</p>
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            <input
              type="number"
              min={0}
              value={localRange[0]}
              onChange={(e) => handleInputChange(0, e.target.value)}
              className="input input-bordered w-full lg:w-24 h-9.5 text-sm"
            />
            <Slider
              range
              min={0}
              max={1000000}
              value={localRange}
              onChange={handleSliderChange}
              className="lg:flex-1"
            />
            <input
              type="number"
              min={0}
              value={localRange[1]}
              onChange={(e) => handleInputChange(1, e.target.value)}
              className="input input-bordered w-full lg:w-24 h-9.5 text-sm"
            />
          </div>
        </div>

        {/* Discount */}
        <Select
          isClearable
          placeholder="Min Discount"
          options={discounts}
          onChange={(option) => setDiscount(option ? option.value : null)}
          className="w-full z-4"
        />

        {/* Rating */}
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
};

export default RenderFilters;