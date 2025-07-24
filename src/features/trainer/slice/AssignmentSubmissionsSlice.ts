import { IViewAssignment } from "@/types/courseType";
import { createSlice } from "@reduxjs/toolkit";
import {
  getTrainerAssignmentSubmissionsApi,
  TrainerChangeAssignmentSubmissionStatus,
} from "../api/AssignmentSubmissionsApi";
import { errorPopup, successPopup } from "@/utils/popup";

interface IAssignmentSubmission extends IViewAssignment {
  user: { _id: string; email: string };
  course: { _id: string; title: string };
}

type initialStateType = {
  assignmentSubmissions: IAssignmentSubmission[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
};

const initialState: initialStateType = {
  assignmentSubmissions: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

const AssignmentSubmissionSlice = createSlice({
  name: "trainerAssignmentSubmissions",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTrainerAssignmentSubmissionsApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getTrainerAssignmentSubmissionsApi.fulfilled,
      (state, action) => {
        const data: initialStateType = action.payload.data;
        if (data.currentPage == 1) {
          state.assignmentSubmissions = data.assignmentSubmissions;
        } else {
          state.assignmentSubmissions = [
            ...state.assignmentSubmissions,
            ...data.assignmentSubmissions,
          ];
        }
        state.currentPage = data.currentPage;
        state.totalPages = data.totalPages;
        state.loading = false;
      }
    );

    builder.addCase(
      TrainerChangeAssignmentSubmissionStatus.fulfilled,
      (state, action) => {
        const { status, _id } = action.payload.data;

        console.log(action.payload.data);

        state.assignmentSubmissions = state.assignmentSubmissions.map(
          (assignment) =>
            assignment._id == _id ? { ...assignment, status } : assignment
        );

        successPopup(
          action.payload.message || "assignment status has been changed"
        );
      }
    );

    builder.addCase(
      TrainerChangeAssignmentSubmissionStatus.rejected,
      (_, action) => {
        const err = action.payload as string;
        errorPopup(err);
      }
    );
  },
});

export const { changePage } = AssignmentSubmissionSlice.actions;
export default AssignmentSubmissionSlice.reducer;
