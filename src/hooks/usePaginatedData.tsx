/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { RECORDS_PER_PAGE } from "@/constants/general";
import { AppDispatch } from "@/store";
import { IResponse } from "@/types/responseType";
import { AsyncThunk, UnknownAction } from "@reduxjs/toolkit";

interface IUsePaginatedData<T> {
  data: Array<T>;
  currentPage: number;
  getDataApi: AsyncThunk<IResponse, any, any>;
  changePageApi: (data: unknown) => UnknownAction;
  extraData?: Record<string, unknown>;
}

const usePaginatedData = <T,>({
  data,
  currentPage,
  extraData = {},
  getDataApi,
  changePageApi,
}: IUsePaginatedData<T>) => {
  const dispatch: AppDispatch = useDispatch();
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const [search, setSearch] = useState("");


  useEffect(() => {
    if (!data.length) {
      dispatch(getDataApi({ page: 1, search, ...extraData }));
    }
  }, [search, data.length]);

  useEffect(() => {
    dispatch(getDataApi({ page: 1, search, ...extraData }));
  }, [search]);

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, startIndex + RECORDS_PER_PAGE);
  }, [data, startIndex]);

  const previousPage = () => {
    if (currentPage > 1) dispatch(changePageApi(currentPage - 1));
  };

  const nextPage = () => {
    if (data.length > startIndex + RECORDS_PER_PAGE) {
      dispatch(changePageApi(currentPage + 1));
    } else {
      dispatch(
        getDataApi({
          page: currentPage + 1,
          search,
          ...extraData,
        })
      );
    }
  };

  const searchHandler = (searchInput: string) => {
    setSearch(searchInput);
  };

  return {
    paginatedData,
    previousPage,
    nextPage,
    searchHandler,
    search,
  };
};

export default usePaginatedData;
