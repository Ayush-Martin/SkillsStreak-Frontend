import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CourseCardSkeleton,
  CourseCard,
  CourseFilter,
  Footer,
  Pagination,
  SearchBox,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components";
import { getCoursesApi } from "@/features/user/api/coursesApi";
import { changePage } from "@/features/user/slice/coursesSlice";
import { usePaginatedData } from "@/hooks";
import { UserLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { ICourseDifficulty, IPrice, ISort } from "@/types/courseType";
import { TbFilterSearch } from "@/assets/icons";
import { axiosGetRequest } from "@/config/axios";
import { CATEGORY_API } from "@/constants";

const PAGE_SIZE = 4;

const Courses: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { courses, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.courses
  );

  const [categories, SetCategories] = useState<
    Array<{ _id: string; categoryName: string }>
  >([]);
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

  const fetchCategories = async () => {
    const res = await axiosGetRequest(CATEGORY_API);
    if (!res) return;

    SetCategories(res.data);
  };

  return (
    <UserLayout>
      <div className="mt-5 px-7">
        <SearchBox
          placeholder="search by course title"
          search={search}
          searchHandler={searchHandler}
        />
      </div>
      <div className="flex justify-center gap-2 px-8 mt-5 sm:px-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="hover:bg-app-secondary hover:scale-110 transition-all duration-300 ease-in-out  text-white rounded-full px-4 py-2 flex items-center gap-2">
              <TbFilterSearch />
              Filter & Sort
            </Button>
          </SheetTrigger>
          <SheetContent className="text-white backdrop-blur-md backdrop-saturate-150 bg-[#0b0819]/10 border-[#031019]/20 shadow-[#031019]/10 border-app-primary">
            <SheetHeader>
              <SheetTitle className="text-2xl text-white">
                Filter & Sort
              </SheetTitle>
              <SheetDescription>
                Apply filters and sorting options to refine the courses list.
              </SheetDescription>
              <CourseFilter
                setCategory={setCategory}
                setDifficulty={setDifficulty}
                setPrice={setPrice}
                setSort={setSort}
                category={category}
                difficulty={difficulty}
                price={price}
                sort={sort}
                categories={categories}
                fetchCategories={fetchCategories}
              />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex justify-center mt-10 lg:block sm:px-14 lg:px-24">
        <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: PAGE_SIZE }, (_, i) => i).map((index) => (
                <CourseCardSkeleton key={index} />
              ))
            : paginatedData.map((course) => (
                <CourseCard
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
