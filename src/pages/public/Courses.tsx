import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CourseCard,
  CourseFilter,
  Footer,
  Pagination,
  SearchBox,
} from "@/components";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { getCoursesApi } from "@/features/user/api/coursesApi";
import { changePage } from "@/features/user/slice/coursesSlice";
import { usePaginatedData } from "@/hooks";
import { UserLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { CourseCardSkeleton } from "@/components/skeletons";
import { ICourseDifficulty, IPrice, ISort } from "@/types/courseType";

const PAGE_SIZE = 8;

const Courses: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { courses, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.courses
  );

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

  return (
    <UserLayout>
      <div className="mt-5 px-7">
        <SearchBox
          placeholder="search ..."
          search={search}
          searchHandler={searchHandler}
        />
      </div>
      <div className="flex justify-center gap-2 px-8 mt-5 sm:px-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"v1"}>Filter & Sort</Button>
          </SheetTrigger>

          <SheetContent className="text-white bg-black border-app-border">
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
