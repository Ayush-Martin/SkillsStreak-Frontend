import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  Separator,
} from "@/components";
import { axiosGetRequest } from "@/config/axios";
import { AdminLayout } from "@/layouts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export interface CourseDocument {
  _id: string;
  title: string;
  price: number;
  skillsCovered: string[];
  requirements: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  description: string;
  isListed: boolean;
  status: "pending" | "approved" | "rejected";

  modules: ModuleWithLessons[];
  liveSessions: LiveSession[];
  assignments: Assignment[];
  category: Category;
  trainer: Trainer;
}

export interface ModuleWithLessons {
  _id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  _id: string;
  title: string;
  type: "video" | "pdf";
  path: string;
}

export interface LiveSession {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: "live" | "upcoming" | "completed";
  liveSrc: string;
  recordedSrc: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  task: string;
}

export interface Category {
  _id: string;
  categoryName: string;
}

export interface Trainer {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "live":
        return "bg-red-100 text-red-800 border-red-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}
    >
      {status}
    </span>
  );
};

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-50 text-green-700 ring-green-600/20";
      case "intermediate":
        return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
      case "advanced":
        return "bg-red-50 text-red-700 ring-red-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getDifficultyColor()}`}
    >
      {difficulty}
    </span>
  );
};

const AdminCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseDocument | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axiosGetRequest(`/admin/courses/${courseId}`);
      if (!res) return;
      setCourse(res.data);
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="md:flex">
            {/* Course Thumbnail */}
            <div className="md:w-1/3">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>

            {/* Course Info */}
            <div className="md:w-2/3 p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {course.title}
                </h1>
                <StatusBadge status={course.status} />
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Category:</span>{" "}
                {course.category.categoryName}
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{course.price.toLocaleString()}
                  </span>
                </div>
                <DifficultyBadge difficulty={course.difficulty} />
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Listed:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      course.isListed
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {course.isListed ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Skills and Requirements */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Skills Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skillsCovered.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Requirements
                  </h3>
                  <ul className="space-y-1">
                    {course.requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {course.modules.length}
                  </div>
                  <div className="text-sm text-gray-600">Modules</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {course.liveSessions.length}
                  </div>
                  <div className="text-sm text-gray-600">Live Sessions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {course.assignments.length}
                  </div>
                  <div className="text-sm text-gray-600">Assignments</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trainer Info */}
        <Card className="p-6 bg-white shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Course Trainer
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={course.trainer.profileImage}
              alt={course.trainer.username}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {course.trainer.username}
              </h3>
              <p className="text-gray-600">{course.trainer.email}</p>
            </div>
          </div>
        </Card>

        {/* Course Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Accordion type="multiple" className="divide-y divide-gray-200">
            {/* Recorded Sessions */}
            <AccordionItem value="recorded" className="border-0">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold text-gray-900 hover:bg-gray-50">
                📚 Recorded Sessions (
                {course.modules.reduce(
                  (total, module) => total + module.lessons.length,
                  0
                )}{" "}
                lessons)
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  {course.modules.map((module) => (
                    <Card key={module._id} className="border border-gray-200">
                      <Accordion type="multiple">
                        <AccordionItem value={module._id} className="border-0">
                          <AccordionTrigger className="px-4 py-3 text-lg font-medium text-gray-800 hover:bg-gray-50">
                            📁 {module.title} ({module.lessons.length} lessons)
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-3">
                              {module.lessons.map((lesson) => (
                                <Card
                                  key={lesson._id}
                                  className="border border-gray-100 bg-gray-50"
                                >
                                  <Accordion type="single" collapsible>
                                    <AccordionItem
                                      value={lesson._id}
                                      className="border-0"
                                    >
                                      <AccordionTrigger className="px-4 py-3 text-gray-700 hover:bg-white">
                                        <div className="flex items-center gap-3">
                                          <span className="text-lg">
                                            {lesson.type === "video"
                                              ? "🎥"
                                              : "📄"}
                                          </span>
                                          <span>{lesson.title}</span>
                                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                            {lesson.type}
                                          </span>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="px-4 pb-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                          <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                              {lesson.type === "video" ? (
                                                <video
                                                  src={lesson.path}
                                                  controls
                                                  className="w-full rounded-lg shadow-sm"
                                                />
                                              ) : (
                                                <iframe
                                                  src={lesson.path}
                                                  className="w-full h-64 rounded-lg shadow-sm"
                                                />
                                              )}
                                            </div>
                                            <div className="space-y-3">
                                              <h4 className="font-semibold text-gray-900">
                                                {lesson.title}
                                              </h4>
                                              <div className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                  Type:
                                                </span>{" "}
                                                {lesson.type.toUpperCase()}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </Card>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Live Sessions */}
            <AccordionItem value="live" className="border-0">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold text-gray-900 hover:bg-gray-50">
                🎯 Live Sessions ({course.liveSessions.length})
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  {course.liveSessions.map((session) => (
                    <Card key={session._id} className="border border-gray-200">
                      <Accordion type="single" collapsible>
                        <AccordionItem value={session._id} className="border-0">
                          <AccordionTrigger className="px-4 py-3 text-gray-800 hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">🎥</span>
                              <span>{session.title}</span>
                              <StatusBadge status={session.status} />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <video
                                    src={
                                      session.status === "completed"
                                        ? session.recordedSrc
                                        : session.liveSrc
                                    }
                                    controls
                                    className="w-full rounded-lg shadow-sm"
                                  />
                                </div>
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-gray-900">
                                    {session.title}
                                  </h4>
                                  <p className="text-gray-600 text-sm leading-relaxed">
                                    {session.description}
                                  </p>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-700">
                                        Status:
                                      </span>
                                      <StatusBadge status={session.status} />
                                    </div>
                                    <div className="text-gray-600">
                                      <span className="font-medium">Date:</span>{" "}
                                      {session.date}
                                    </div>
                                    <div className="text-gray-600">
                                      <span className="font-medium">Time:</span>{" "}
                                      {session.time}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Assignments */}
            <AccordionItem value="assignments" className="border-0">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold text-gray-900 hover:bg-gray-50">
                📝 Assignments ({course.assignments.length})
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid gap-4">
                  {course.assignments.map((assignment) => (
                    <Card
                      key={assignment._id}
                      className="p-6 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          📋 {assignment.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {assignment.description}
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-medium text-blue-900 mb-2">
                            Task:
                          </h5>
                          <p className="text-blue-800 text-sm">
                            {assignment.task}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCoursePage;
