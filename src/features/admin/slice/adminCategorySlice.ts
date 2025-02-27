import { createSlice } from "@reduxjs/toolkit";
import {
  adminCategoryAddApi,
  adminCategoryEditApi,
  adminCategoryListUnListApi,
  getAdminCategoriesApi,
} from "../api/adminCategoryApi";
import { errorPopup, successPopup } from "@/utils/popup";

type CategoryType = {
  categoryName: string;
  isListed: boolean;
  _id: string;
};

type CategoriesType = Array<CategoryType>;

type initialStateType = {
  categories: CategoriesType;
  currentPage: number;
  totalPages: number;
};

const initialState: initialStateType = {
  categories: [],
  currentPage: 1,
  totalPages: 1,
};

const AdminCategorySlice = createSlice({
  name: "adminCategory",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminCategoriesApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
      console.log(data);
      if (data.currentPage == 1) {
        state.categories = data.categories;
      } else {
        state.categories = [...state.categories, ...data.categories];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
    });

    builder.addCase(getAdminCategoriesApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(adminCategoryAddApi.fulfilled, (state, action) => {
      const category: CategoryType = action.payload.data;

      state.categories = [category, ...state.categories];
      state.currentPage = 1;
      state.totalPages = 1;
      successPopup(action.payload.message || "new category added");
    });

    builder.addCase(adminCategoryAddApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(adminCategoryEditApi.fulfilled, (state, action) => {
      const category: CategoryType = action.payload.data;
      console.log(category);
      state.categories = state.categories.map((oldCategory) =>
        oldCategory._id == category._id ? category : oldCategory
      );

      successPopup(action.payload.message || "category updated");
    });

    builder.addCase(adminCategoryEditApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(adminCategoryListUnListApi.fulfilled, (state, action) => {
      const {
        categoryId,
        isListed,
      }: { categoryId: string; isListed: boolean } = action.payload.data;

      console.log(isListed);
      state.categories = state.categories.map((oldCategory) =>
        oldCategory._id == categoryId
          ? { ...oldCategory, isListed }
          : oldCategory
      );

      successPopup(action.payload.message || "category list status changed");
    });

    builder.addCase(adminCategoryListUnListApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = AdminCategorySlice.actions;
export default AdminCategorySlice.reducer;
