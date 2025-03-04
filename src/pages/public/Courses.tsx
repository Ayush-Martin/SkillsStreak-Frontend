import { CourseCard, Pagination, SearchBox } from "@/components";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosGetRequest } from "@/config/axios";
import { CATEGORY_API } from "@/constants/API";
import { getCoursesApi } from "@/features/user/api/coursesApi";
import { changePage } from "@/features/user/slice/coursesSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import UserLayout from "@/layouts/UserLayout";
import { AppDispatch, RootReducer } from "@/store";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Courses: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { courses, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.courses
  );

  console.log(courses);

  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState<
    "all" | "beginner" | "intermediate" | "advance"
  >("all");
  const [price, setPrice] = useState<"all" | "free" | "paid">("all");

  const { paginatedData, nextPage, previousPage, search, searchHandler } =
    usePaginatedData({
      data: courses,
      currentPage,
      getDataApi: getCoursesApi,
      changePageApi: changePage,
      extraData: {
        category,
        difficulty,
        price,
      },
    });

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

  useEffect(() => {
    dispatch(getCoursesApi({ page: 1, search, category, difficulty, price }));
  }, [category, difficulty, price]);

  return (
    <UserLayout>
      <div className="px-7">
        <SearchBox
          placeholder="search ..."
          search={search}
          searchHandler={searchHandler}
        />
      </div>
      <div className="flex justify-center gap-2 px-8 mt-5 sm:px-0">
        <Select
          defaultValue="all"
          onValueChange={(
            value: "all" | "beginner" | "intermediate" | "advance"
          ) => setDifficulty(value)}
        >
          <SelectTrigger className="text-white w-[150px]">
            <SelectValue placeholder="Difficulty " className="text-white" />
          </SelectTrigger>
          <SelectContent className="bg-app-neutral ">
            <SelectGroup>
              <SelectLabel>Difficulty</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advance">Advance</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          defaultValue="all"
          onValueChange={(value) => setCategory(value)}
        >
          <SelectTrigger className="text-white w-[150px]">
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
        <Select
          defaultValue="all"
          onValueChange={(value: "all" | "free" | "paid") => setPrice(value)}
        >
          <SelectTrigger className="text-white w-[150px]">
            <SelectValue placeholder="Difficulty " className="text-white" />
          </SelectTrigger>
          <SelectContent className="bg-app-neutral ">
            <SelectGroup>
              <SelectLabel>Price</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center mt-10 lg:block sm:px-14 lg:px-24">
        <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedData.map((course) => (
            <CourseCard
              _id={course._id}
              key={course._id}
              category={course.category.categoryName}
              noOfEnrolled={10}
              noOfModules={course.moduleCount}
              price={course.price}
              thumbnail={course.thumbnail}
              title={course.title}
            />
          ))}
        </div>
      </div>

      {paginatedData.length != 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      )}
    </UserLayout>
  );
};

export default Courses;
