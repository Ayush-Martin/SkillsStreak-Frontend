import { FC, useEffect } from "react";
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { ICourseDifficulty, IPrice, ISort } from "@/types/courseType";
import {
  DIFFICULTY_OPTIONS,
  PRICE_OPTIONS,
  SORT_OPTIONS,
} from "@/constants/sections/courseFilter";

interface ICourseFilterProps {
  difficulty: "all" | ICourseDifficulty;
  category: string;
  price: "all" | IPrice;
  sort: ISort;
  setDifficulty: (value: "all" | ICourseDifficulty) => void;
  setCategory: (value: string) => void;
  setPrice: (value: "all" | IPrice) => void;
  setSort: (value: ISort) => void;
  categories: Array<{ _id: string; categoryName: string }>;
  fetchCategories: () => void;
}

const CourseFilter: FC<ICourseFilterProps> = ({
  setCategory,
  setDifficulty,
  setPrice,
  setSort,
  difficulty,
  category,
  price,
  sort,
  categories,
  fetchCategories,
}) => {
  useEffect(() => {
    fetchCategories();
  }, []);

  const clearAll = () => {
    setCategory("all");
    setDifficulty("all");
    setPrice("all");
    setSort("popularity");
  };

  return (
    <div className="flex flex-col gap-3 px-5 pt-10 md:px-10">
      <div className="flex flex-col gap-1">
        <Button
          className="bg-transparent border border-app-neutral hover:bg-app-neutral text-white hover:text-black"
          onClick={clearAll}
        >
          Clear all
        </Button>
        <p>Difficulty </p>
        <Select
          value={difficulty}
          onValueChange={(value: "all" | ICourseDifficulty) =>
            setDifficulty(value)
          }
        >
          <SelectTrigger className="text-white ">
            <SelectValue placeholder="Difficulty " className="text-white" />
          </SelectTrigger>
          <SelectContent className="bg-app-neutral ">
            <SelectGroup>
              <SelectLabel>Difficulty</SelectLabel>
              {DIFFICULTY_OPTIONS.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <p>Category </p>
        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="text-white ">
            <SelectValue placeholder="Category " className="text-white" />
          </SelectTrigger>
          <SelectContent className="bg-app-neutral ">
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              {categories.map((category) => (
                <SelectItem value={category._id} key={category._id}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <p>Price </p>
        <Select
          value={price}
          onValueChange={(value: "all" | IPrice) => setPrice(value)}
        >
          <SelectTrigger className="text-white ">
            <SelectValue placeholder="Price" className="text-white" />
          </SelectTrigger>
          <SelectContent className="bg-app-neutral ">
            <SelectGroup>
              <SelectLabel>Price</SelectLabel>
              {PRICE_OPTIONS.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <p>Sort by </p>
        <Select value={sort} onValueChange={(value: ISort) => setSort(value)}>
          <SelectTrigger className="text-white ">
            <SelectValue placeholder="SORT BY" className="text-white" />
          </SelectTrigger>
          <SelectContent className="bg-app-neutral ">
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              {SORT_OPTIONS.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CourseFilter;
