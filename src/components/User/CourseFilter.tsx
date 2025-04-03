import { FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { ICourseDifficulty, IPrice, ISort } from "@/types/courseType";
import { axiosGetRequest } from "@/config/axios";
import { CATEGORY_API } from "@/constants";
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
}) => {
  const [categories, SetCategories] = useState<
    Array<{ _id: string; categoryName: string }>
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosGetRequest(CATEGORY_API);
      if (!res) return;

      SetCategories(res.data);
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col gap-3 px-5 pt-10 md:px-10">
      <div className="flex flex-col gap-1">
        <p>Difficulty </p>
        <Select
          defaultValue={difficulty}
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
        <Select
          defaultValue={category}
          onValueChange={(value) => setCategory(value)}
        >
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
          defaultValue={price}
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
        <Select
          defaultValue={sort}
          onValueChange={(value: ISort) => setSort(value)}
        >
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
