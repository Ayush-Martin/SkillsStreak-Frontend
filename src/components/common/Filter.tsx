/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui";
import { Button } from "../ui/button";

export interface IFilterItem<T extends string> {
  label: string;
  default: {
    value: T | "all";
    placeholder: string;
  };
  values: {
    value: T;
    placeholder: string;
  }[];
  selectedValue: T | "all";
  changeSelectedValue: (value: T | "all") => void;
}

interface IFilterProps {
  filters: IFilterItem<any>[];
  clearFilters?: () => void;
}

const Filter: FC<IFilterProps> = ({ filters, clearFilters }) => {
  return (
    <div className="bg-[#0e111c] text-white p-5 rounded-xl shadow-lg border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
      <div className="flex flex-wrap gap-4 w-full md:w-auto">
        {filters.map(
          ({
            label,
            default: defaultValue,
            values,
            selectedValue,
            changeSelectedValue,
          }) => (
            <div key={label} className="flex flex-col gap-2 min-w-[200px]">
              <span className="text-sm text-gray-400">{label}</span>
              <Select
                value={selectedValue}
                onValueChange={(value: string) =>
                  changeSelectedValue(value as typeof selectedValue)
                }
              >
                <SelectTrigger className="w-full bg-[#1a1f2e] border border-gray-700 text-gray-200 hover:bg-[#22283a] focus:ring-2 focus:ring-indigo-500 rounded-lg transition-all">
                  <SelectValue
                    placeholder={defaultValue.placeholder}
                    className="text-gray-300"
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1f2e] border border-gray-700 text-gray-200">
                  <SelectGroup>
                    <SelectLabel className="text-gray-400">{label}</SelectLabel>
                    <SelectItem value={defaultValue.value}>
                      {defaultValue.placeholder}
                    </SelectItem>
                    {values.map((v) => (
                      <SelectItem value={v.value} key={v.value}>
                        {v.placeholder}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )
        )}
      </div>

      {/* Clear Button */}
      {clearFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#1a1f2e] text-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default Filter;
