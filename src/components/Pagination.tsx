import { FC } from "react";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";

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
  return (
    <div className="flex justify-center my-10">
      <div className="flex items-center gap-5 ">
        <button
          className="text-3xl disabled:text-app-border"
          onClick={previousPage}
          disabled={currentPage == 1}
        >
          <GrFormPreviousLink />
        </button>
        <div className="text-xl text-white">
          {currentPage} of {totalPages}
        </div>
        <button
          className="text-3xl disabled:text-app-border"
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
