import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants";
import { IAssignment, ILiveSession, ModuleType } from "@/types/courseType";
import { successPopup } from "@/utils/popup";
import {
  ICourseBasicDetailsSchema,
  CourseBasicDetailsSchema,
  ICourseLiveSessionSchema,
} from "@/validation/course.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const useNewEditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<
    {
      categoryName: string;
      _id: string;
    }[]
  >([]);

  const {
    formState: { errors },
    setValue,
    register,
    watch,
    trigger,
    handleSubmit,
    reset,
  } = useForm<ICourseBasicDetailsSchema>({
    resolver: zodResolver(CourseBasicDetailsSchema),
    defaultValues: {
      title: "",
      price: 0,
      skillsCovered: [],
      requirements: [],
      difficulty: "beginner",
      description: "",
      categoryId: "",
    },
    mode: "onChange",
  });

  const [courseStatus, setCourseStatus] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [modules, setModules] = useState<Array<ModuleType>>([]);
  const [assignments, setAssignments] = useState<Array<IAssignment>>([]);
  const [liveSessions, setLiveSessions] = useState<Array<ILiveSession>>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosGetRequest("/categories");
      if (!res) return;
      setCategories(res.data);
    };

    const fetchCourseBasicDetails = async () => {
      const res = await axiosGetRequest(`/trainer/courses/${courseId}`);
      if (!res) return;
      setPreviewThumbnail(res.data.thumbnail);
      setCourseStatus(res.data.status);
      reset(res.data);
    };

    fetchCategories();
    fetchCourseBasicDetails();
  }, []);

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const formData = new FormData();

      formData.append("image", selectedFile);

      const res = await axiosPatchRequest(
        `${TRAINER_COURSES_API}/${courseId}/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!res) return;
      setPreviewThumbnail(res.data);
      console.log(res);
      successPopup(res.message || "Thumbnail changed");
    }
  };

  const EditBasicDetails = handleSubmit(async (data) => {
    const res = await axiosPutRequest(
      `${TRAINER_COURSES_API}/${courseId}`,
      data
    );
    if (!res) return;
    successPopup(res.message || "updated");
  });

  const fetchModules = async () => {
    const res = await axiosGetRequest(
      `${TRAINER_COURSES_API}/${courseId}/modules`
    );
    if (!res) return;
    setModules(res.data);
  };

  const addModule = async (title: string) => {
    const res = await axiosPostRequest(
      `${TRAINER_COURSES_API}/${courseId}/modules`,
      {
        title,
      }
    );

    if (!res) return;
    setModules([...modules, { ...res.data, lessons: [] }]);
    console.log(res);
    successPopup(res.message || "added");
  };

  const deleteModule = async (moduleId: string) => {
    const res = await axiosDeleteRequest(
      `${TRAINER_COURSES_API}/${courseId}/modules/${moduleId}`
    );

    if (!res) return;
    successPopup(res.message || "deleted");
    const updatedModules = modules.filter((module) => module._id != moduleId);
    setModules(updatedModules);
  };

  const editModule = (moduleId: string) => {
    navigate(`/trainer/courses/${courseId}/${moduleId}`);
  };

  const fetchAssignments = async () => {
    const res = await axiosGetRequest(
      `${TRAINER_COURSES_API}/${courseId}/assignments`
    );
    if (!res) return;
    console.log(res.data);
    setAssignments(res.data);
  };

  const addAssignment = async (
    title: string,
    description: string,
    task: string
  ) => {
    const res = await axiosPostRequest(
      `${TRAINER_COURSES_API}/${courseId}/assignments`,
      {
        title,
        description,
        task,
      }
    );

    if (!res) return;
    setAssignments([...assignments, res.data]);
    successPopup(res.message || "added");
  };

  const deleteAssignment = async (assignmentId: string) => {
    const res = await axiosDeleteRequest(
      `${TRAINER_COURSES_API}/${courseId}/assignments/${assignmentId}`
    );

    if (!res) return;
    successPopup(res.message || "deleted");
    const updatedAssignments = assignments.filter(
      (assignment) => assignment._id != assignmentId
    );
    setAssignments(updatedAssignments);
  };

  const editAssignment = async (
    assignmentId: string,
    title: string,
    description: string,
    task: string
  ) => {
    const res = await axiosPutRequest(
      `${TRAINER_COURSES_API}/${courseId}/assignments/${assignmentId}`,
      {
        title,
        description,
        task,
      }
    );

    if (!res) return;
    successPopup(res.message || "updated");
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment._id === assignmentId) {
        return { ...assignment, title, description, task };
      }
      return assignment;
    });
    setAssignments(updatedAssignments);
  };

  const fetchLiveSessions = async () => {
    const res = await axiosGetRequest(
      `${TRAINER_COURSES_API}/${courseId}/liveSessions`
    );
    if (!res) return;
    setLiveSessions(res.data);
  };

  const scheduleLiveSession = async (data: ICourseLiveSessionSchema) => {
    const res = await axiosPostRequest(
      `${TRAINER_COURSES_API}/${courseId}/liveSessions`,
      data
    );
    if (!res) return;
    successPopup(res.message || "added");
    const updatedLiveSessions = [...liveSessions, res.data];
    setLiveSessions(updatedLiveSessions);
  };

  const editLiveSession = async (
    liveSessionId: string,
    data: ICourseLiveSessionSchema
  ) => {
    const res = await axiosPutRequest(
      `${TRAINER_COURSES_API}/${courseId}/liveSessions/${liveSessionId}`,
      data
    );
    if (!res) return;
    successPopup(res.message || "updated");
    const updatedLiveSessions = liveSessions.map((liveSession) => {
      if (liveSession._id === liveSessionId) {
        return { ...liveSession, ...data };
      }
      return liveSession;
    });
    setLiveSessions(updatedLiveSessions);
  };

  const deleteLiveSession = async (liveSessionId: string) => {
    const res = await axiosDeleteRequest(
      `${TRAINER_COURSES_API}/${courseId}/liveSessions/${liveSessionId}`
    );
    if (!res) return;
    successPopup(res.message || "deleted");
    const updatedLiveSessions = liveSessions.filter(
      (liveSession) => liveSession._id != liveSessionId
    );
    setLiveSessions(updatedLiveSessions);
  };

  const viewLiveSession = (liveSessionId: string) => {
    console.log(liveSessionId);
    navigate(`/trainer/newCourse/${courseId}/live/${liveSessionId}`);
  };

  return {
    categories,
    errors,
    setValue,
    register,
    watch,
    trigger,
    handleThumbnailChange,
    previewThumbnail,
    EditBasicDetails,
    modules,
    fetchModules,
    addModule,
    deleteModule,
    editModule,
    assignments,
    addAssignment,
    deleteAssignment,
    editAssignment,
    fetchAssignments,
    liveSessions,
    fetchLiveSessions,
    editLiveSession,
    scheduleLiveSession,
    deleteLiveSession,
    courseStatus,
    viewLiveSession,
  };
};

export default useNewEditCourse;
