import { Footer, LiveStreamCard, Pagination, SearchBox } from "@/components";
import { CourseCardSkeleton } from "@/components/skeletons";
import { getUserLiveStreams } from "@/features/user/api/liveStreamApi";
import { changePage } from "@/features/user/slice/liveStreamSlice";
import { usePaginatedData } from "@/hooks";
import { UserLayout } from "@/layouts";
import { RootReducer } from "@/store";
import { useSelector } from "react-redux";

const LIveStreams = () => {
  const { currentPage, liveStreams, loading, totalPages } = useSelector(
    (state: RootReducer) => state.userStream
  );


  const { nextPage, paginatedData, previousPage, search, searchHandler } =
    usePaginatedData({
      data: liveStreams,
      currentPage,
      getDataApi: getUserLiveStreams,
      changePageApi: changePage,
    });

  console.log(paginatedData);

  return (
    <UserLayout>
      <div className="my-5 px-7">
        <SearchBox
          placeholder="search ..."
          search={search}
          searchHandler={searchHandler}
        />

        <div className="flex justify-center gap-2 px-8 mt-5 sm:px-0">
          <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 5 }, (_, i) => i).map((index) => (
                  <CourseCardSkeleton key={index} />
                ))
              : paginatedData.map((stream) => (
                  <LiveStreamCard
                    key={stream._id}
                    description={stream.description}
                    streamId={stream._id}
                    thumbnail={stream.thumbnail}
                    title={stream.title}
                  />
                ))}
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        previousPage={previousPage}
        nextPage={nextPage}
      />
      <Footer />
    </UserLayout>
  );
};

export default LIveStreams;
