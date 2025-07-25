import { axiosGetRequest } from "@/config/axios";
import { ICategory } from "@/types/categoryType";

export const getCategories = async (): Promise<Array<ICategory> | null> => {
  const res = await axiosGetRequest("/categories");
  return res?.data;
};

