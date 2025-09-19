import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CourseCardSkeleton,
  CourseCard,
  Footer,
  Pagination,
  SearchBox,
} from "@/components";
import { getCoursesApi } from "@/features/user/api/coursesApi";
import { changePage } from "@/features/user/slice/coursesSlice";
import { usePaginatedData } from "@/hooks";
import { UserLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { ICourseDifficulty, IPrice, ISort } from "@/types/courseType";
import { getCategories } from "@/api/category.api";
import { ICategory } from "@/types/categoryType";
import Filter from "@/components/common/Filter";

const PAGE_SIZE = 4;

const Courses: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { courses, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.courses
  );

  const [categories, SetCategories] = useState<Array<ICategory>>([]);
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState<"all" | ICourseDifficulty>(
    "all"
  );
  const [price, setPrice] = useState<"all" | IPrice>("all");
  const [sort, setSort] = useState<ISort>("popularity");

  const { paginatedData, nextPage, previousPage, search, searchHandler } =
    usePaginatedData({
      data: courses,
      currentPage,
      getDataApi: getCoursesApi,
      changePageApi: changePage,
      size: PAGE_SIZE,
      extraData: {
        category,
        difficulty,
        price,
        sort,
      },
    });

  useEffect(() => {
    dispatch(
      getCoursesApi({
        page: 1,
        search,
        category,
        difficulty,
        price,
        sort,
        size: PAGE_SIZE,
      })
    );
  }, [category, difficulty, price, sort]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      if (!data) return;
      SetCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <UserLayout>
      <div className="mt-5 px-7">
        <SearchBox
          placeholder="search by course title"
          search={search}
          searchHandler={searchHandler}
        />
      </div>

      <div className="px-10 md:px-20 my-4">
        <Filter
          filters={[
            {
              label: "Category",
              default: { value: "all", placeholder: "All Categories" },
              values: categories.map((c) => ({
                value: c._id,
                placeholder: c.categoryName,
              })),
              selectedValue: category,
              changeSelectedValue: setCategory,
            },
            {
              label: "Difficulty",
              default: { value: "all", placeholder: "All Levels" },
              values: [
                { value: "beginner", placeholder: "Beginner" },
                { value: "intermediate", placeholder: "Intermediate" },
                { value: "advance", placeholder: "Advance" },
              ],
              selectedValue: difficulty,
              changeSelectedValue: setDifficulty,
            },
            {
              label: "Price",
              default: { value: "all", placeholder: "All Prices" },
              values: [
                { value: "free", placeholder: "Free" },
                { value: "paid", placeholder: "Paid" },
              ],
              selectedValue: price,
              changeSelectedValue: setPrice,
            },
            {
              label: "Sort",
              default: { value: "popularity" },
              values: [
                { value: "popularity", placeholder: "Popularity" },
                { value: "priceLowToHigh", placeholder: "Price: Low to High" },
                { value: "priceHighToLow", placeholder: "Price: High to Low" },
                { value: "aA-zZ", placeholder: "A → Z" },
                { value: "zZ-aA", placeholder: "Z → A" },
              ],
              selectedValue: sort,
              changeSelectedValue: setSort,
            },
          ]}
          clearFilters={() => {
            setCategory("all");
            setDifficulty("all");
            setPrice("all");
            setSort("popularity");
          }}
        />
      </div>

      <div className="flex justify-center mt-10 lg:block sm:px-14 lg:px-24">
        <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: PAGE_SIZE }, (_, i) => i).map((index) => (
                <CourseCardSkeleton key={index} />
              ))
            : paginatedData.map((course) => (
                <CourseCard
                  linkPrefix="/courses"
                  averageRating={course.averageRating}
                  _id={course._id}
                  key={course._id}
                  category={course.category.categoryName}
                  noOfEnrolled={course.noOfEnrolled}
                  noOfModules={course.moduleCount}
                  price={course.price}
                  thumbnail={course.thumbnail}
                  title={course.title}
                />
              ))}
        </div>
      </div>

      {!!paginatedData.length && (
        <Pagination
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      )}

      <Footer />
    </UserLayout>
  );
};

export default Courses;
