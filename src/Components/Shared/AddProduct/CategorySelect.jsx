import { Controller } from "react-hook-form";
import Select from "react-select";
import { MdLocalOffer } from "react-icons/md";

export const CategorySelect = ({ control, categories, error }) => {
  return (
    <div>
      <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
        <MdLocalOffer className="w-4 h-4" />
        Categories <span className="text-red-500">*</span>
      </label>
      <Controller
        control={control}
        name="categories"
        rules={{ required: "Choose at least one category." }}
        render={({ field }) => (
          <Select
            {...field}
            isMulti
            options={categories.map((c) => ({
              value: c.toLowerCase(),
              label: c,
            }))}
            className="text-sm w-full"
            placeholder="Select product categories"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#e5e7eb",
                "&:hover": { borderColor: "#3b82f6" },
                boxShadow: "none",
                minHeight: "45px",
              }),
            }}
            value={
              field.value
                ? categories
                    .filter((c) => field.value.includes(c.toLowerCase()))
                    .map((c) => ({
                      value: c.toLowerCase(),
                      label: c,
                    }))
                : []
            }
            onChange={(selected) =>
              field.onChange(selected.map((s) => s.value))
            }
          />
        )}
      />
      {error && (
        <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};