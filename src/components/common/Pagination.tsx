import { FC } from "react";

import { GrFormNextLink, GrFormPreviousLink } from "@/assets/icons";

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  previousPage: () => void;
  nextPage: () => void;
}

const Pagination: FC<IPaginationProps> = ({
  currentPage,
  totalPages,
  previousPage,
  nextPage,
}) => {
  if (totalPages <= 0) {
    return (
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-400 mt-20">
        🚫 No Data Found
      </h1>
    );
  }

  return (
    <div className="flex justify-center my-10">
      <div className="flex items-center gap-5 ">
        <button
          className="text-3xl text-app-neutral disabled:text-app-border"
          onClick={previousPage}
          disabled={currentPage == 1}
        >
          <GrFormPreviousLink />
        </button>
        <div className="text-xl text-white">
          {currentPage} of {totalPages}
        </div>
        <button
          className="text-3xl text-app-neutral disabled:text-app-border"
          onClick={nextPage}
          disabled={currentPage == totalPages}
        >
          <GrFormNextLink />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
