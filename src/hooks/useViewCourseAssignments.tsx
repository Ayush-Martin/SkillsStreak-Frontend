import {
  axiosGetRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { COURSES_API } from "@/constants";
import { IViewAssignment } from "@/types/courseType";
import { successPopup } from "@/utils/popup";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useCourseAssignments = () => {
  const [assignments, setAssignments] = useState<IViewAssignment[]>([]);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await axiosGetRequest(
        `${COURSES_API}/${courseId}/assignments`
      );
      if (!res) return;
      console.log("assignments", res.data);
      setAssignments(res.data);
    };

    fetchAssignments();
  }, []);

  const completeAssignment = async (
    assignmentId: string,
    type: "pdf" | "text" | "image",
    file?: File, // file is optional
    textContent?: string // for text type
  ) => {
    let res;

    if (type === "text") {
      // Send as JSON
      res = await axiosPostRequest(
        `${COURSES_API}/${courseId}/assignments/${assignmentId}`,
        {
          type: "text",
          content: textContent || "", // send the actual content here
        }
      );
    } else {
      // Send as FormData (for file-based types)
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("type", type);
      res = await axiosPostRequest(
        `${COURSES_API}/${courseId}/assignments/${assignmentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

    if (!res) return;
    successPopup(res.message || "updated");

    // Update state with new assignment
    setAssignments((assignments) =>
      assignments.map((assignment) =>
        assignment._id === res.data._id ? res.data : assignment
      )
    );
  };

  const redoAssignment = async (
    assignmentId: string,
    assignmentSubmissionId: string,
    type: "pdf" | "text" | "image",
    file?: File, // file is optional
    textContent?: string // for text type
  ) => {
    let res;

    if (type === "text") {
      // Send as JSON
      res = await axiosPutRequest(
        `${COURSES_API}/${courseId}/assignments/${assignmentId}?assignmentSubmissionId=${assignmentSubmissionId}`,
        {
          type: "text",
          content: textContent || "", // send the actual content here
        }
      );
    } else {
      // Send as FormData (for file-based types)
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("type", type);
      res = await axiosPutRequest(
        `${COURSES_API}/${courseId}/assignments/${assignmentId}?assignmentSubmissionId=${assignmentSubmissionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

    if (!res) return;
    successPopup(res.message || "updated");

    // Update state with new assignment
    setAssignments((assignments) =>
      assignments.map((assignment) =>
        assignment._id === res.data._id ? res.data : assignment
      )
    );
  };

  // const redoAssignment = async (
  //   assignmentId: string,
  //   type: "pdf" | "text" | "image",
  //   file: File
  // ) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("type", type);
  //   const res = await axiosPutRequest(
  //     `${COURSES_API}/${courseId}/assignments/${assignmentId}`,
  //     formData
  //   );
  //   if (!res) return;
  //   successPopup(res.message || "updated");
  //   setAssignments(
  //     assignments.map((assignment) => {
  //       if (assignment._id === res.data._id) {
  //         return res.data;
  //       }
  //       return assignment;
  //     })
  //   );
  // };

  return { assignments, completeAssignment, redoAssignment };
};

export default useCourseAssignments;
