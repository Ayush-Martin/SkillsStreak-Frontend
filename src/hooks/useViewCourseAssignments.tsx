import {
  axiosGetRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { COURSES_API } from "@/constants";
import { IAssignmentSubmission } from "@/types/courseType";
import { successPopup } from "@/utils/popup";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useCourseAssignments = () => {
  const [assignments, setAssignments] = useState<IAssignmentSubmission[]>([]);
  const { courseId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<IAssignmentSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (assignment: IAssignmentSubmission) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const res = await axiosGetRequest(
        `${COURSES_API}/${courseId}/assignments`
      );
      if (!res) return;
      setAssignments(res.data);
      setLoading(false);
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
    console.log(
      res.data,
      assignments,
      assignments.map((assignment) =>
        assignment._id === res.data._id ? res.data : assignment
      )
    );
    // Update state with new assignment
    setAssignments((assignments) => {
      const { status, type, path, content, assignmentId, _id } = res.data;
      return assignments.map((assignment) => {
        console.log(assignment);
        return assignment._id === assignmentId
          ? {
              ...assignment,
              status,
              type,
              path,
              content,
              assignmentSubmissionId: _id,
            }
          : assignment;
      });
    });

    closeModal();
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
    setAssignments((assignments) => {
      const { status, type, path, content, assignmentId, _id } = res.data;
      return assignments.map((assignment) => {
        console.log(assignment);
        return assignment._id === assignmentId
          ? {
              ...assignment,
              status,
              type,
              path,
              content,
              assignmentSubmissionId: _id,
            }
          : assignment;
      });
    });
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

  return {
    assignments,
    completeAssignment,
    redoAssignment,
    loading,
    selectedAssignment,
    setSelectedAssignment,
    openModal,
    closeModal,
    isModalOpen,
  };
};

export default useCourseAssignments;
