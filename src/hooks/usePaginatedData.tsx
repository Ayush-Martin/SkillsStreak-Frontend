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
  size?: number;
}

const usePaginatedData = <T,>({
  data,
  currentPage,
  extraData = {},
  getDataApi,
  changePageApi,
  size = RECORDS_PER_PAGE,
}: IUsePaginatedData<T>) => {
  const dispatch: AppDispatch = useDispatch();
  const startIndex = currentPage == 0 ? 0 : (currentPage - 1) * size;
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!data.length) {
      dispatch(getDataApi({ page: 1, search, size, ...extraData }));
    }
  }, [search, data.length]);

  useEffect(() => {
    dispatch(getDataApi({ page: 1, search, size, ...extraData }));
  }, [search]);

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, startIndex + size);
  }, [data, startIndex]);

  const previousPage = () => {
    if (currentPage > 1) dispatch(changePageApi(currentPage - 1));
  };

  const nextPage = () => {
    if (data.length > startIndex + size) {
      dispatch(changePageApi(currentPage + 1));
    } else {
      dispatch(
        getDataApi({
          page: currentPage + 1,
          search,
          size,
          ...extraData,
        })
      );
    }
  };

  const searchHandler = (searchInput: string) => {
    setSearch(searchInput);
  };

  const refreshHandler = () => {
    dispatch(getDataApi({ page: 1, search, size, ...extraData }));
  };

  return {
    paginatedData,
    previousPage,
    nextPage,
    searchHandler,
    search,
    refreshHandler,
  };
};

export default usePaginatedData;
