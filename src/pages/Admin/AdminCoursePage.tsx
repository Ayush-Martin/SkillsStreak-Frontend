import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AdminCourseDifficultyBadge,
  AdminCourseStatusBadge,
} from "@/components";
import { AdminLayout } from "@/layouts";
import { Link, useParams } from "react-router-dom";
import {
  Play,
  FileText,
  Clock,
  Calendar,
  Video,
  BookOpen,
  CheckCircle,
  Tag,
  Globe,
  TrendingUp,
  User,
  Mail,
} from "lucide-react";
import { IAdminCourseDetail } from "@/types/courseType";
import { getAdminCourse } from "@/api/course.api";

const AdminCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<IAdminCourseDetail | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await getAdminCourse(courseId!);
      if (!data) return;
      setCourse(data);
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-400 font-medium">
              Loading course details...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  return (
    <AdminLayout>
      <div className="min-h-screen text-gray-100">
        <div className="max-w-7xl mx-auto px-6 pb-5 space-y-8">
          {/* Header Section */}
          <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />

              {/* Course Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <AdminCourseStatusBadge status={course.status} />
                    <span className="bg-gray-900/70 text-gray-300 px-3 py-1 rounded-md text-sm font-medium border border-white/10 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {course.category.categoryName}
                    </span>
                    <AdminCourseDifficultyBadge
                      difficulty={course.difficulty}
                    />
                    <span className="bg-gray-900/70 text-gray-300 px-3 py-1 rounded-md text-sm font-medium border border-white/10 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {course.isListed ? "Public" : "Private"}
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold text-white leading-tight">
                    {course.title}
                  </h1>

                  <div className="text-3xl font-bold text-green-400">
                    ₹{course.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {course.modules.length}
                  </div>
                  <div className="text-gray-400 text-sm">Modules</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <Play className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {totalLessons}
                  </div>
                  <div className="text-gray-400 text-sm">Total Lessons</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="bg-red-900/50 p-3 rounded-lg">
                  <Video className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {course.liveSessions.length}
                  </div>
                  <div className="text-gray-400 text-sm">Live Sessions</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="bg-amber-900/50 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {course.assignments.length}
                  </div>
                  <div className="text-gray-400 text-sm">Assignments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              Course Description
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Skills and Requirements */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-lg p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Skills Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.skillsCovered.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-900/30 text-blue-400 px-3 py-2 rounded-md text-sm font-medium border border-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Requirements
              </h3>
              <ul className="space-y-3">
                {course.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trainer Info */}
          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <User className="w-5 h-5 text-purple-400" />
              Course Trainer
            </h2>
            <div className="flex items-center gap-6 bg-white/5  rounded-lg p-6">
              <img
                src={course.trainer.profileImage}
                alt={course.trainer.username}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
              />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  {course.trainer.username}
                </h3>
                <p className="text-gray-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {course.trainer.email}
                </p>
                <Link to={`/admin/users/${course.trainer._id}`}>
                  View Trainer
                </Link>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
            <Accordion type="multiple" className="divide-y divide-gray-700">
              {/* Recorded Sessions */}
              <AccordionItem value="recorded" className="border-0">
                <AccordionTrigger className="px-8 py-6 text-lg font-semibold text-white hover:bg-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-900/50 p-2 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>
                    <span>Recorded Sessions</span>
                    <span className="text-sm text-gray-400 font-normal bg-gray-700 px-3 py-1 rounded-md">
                      {totalLessons} lessons
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8">
                  <div className="space-y-6">
                    {course.modules.map((module, moduleIndex) => (
                      <div
                        key={module._id}
                        className="bg-white/5  border border-white/10 rounded-lg p-6"
                      >
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                          <div className="bg-amber-900/50 p-2 rounded-lg">
                            <BookOpen className="w-4 h-4 text-amber-400" />
                          </div>
                          <span>{module.title}</span>
                          <span className="text-sm text-gray-400 font-normal bg-gray-600 px-3 py-1 rounded-md">
                            {module.lessons.length} lessons
                          </span>
                        </h3>

                        <div className="grid gap-4">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson._id}
                              className="bg-white/5 border border-white/10 rounded-lg p-6"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-purple-900/50 p-2 rounded-lg">
                                    {lesson.type === "video" ? (
                                      <Play className="w-4 h-4 text-purple-400" />
                                    ) : (
                                      <FileText className="w-4 h-4 text-purple-400" />
                                    )}
                                  </div>
                                  <h4 className="font-medium text-white">
                                    {lesson.title}
                                  </h4>
                                  <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-700">
                                    {lesson.type.toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-gray-400 text-sm">
                                  {moduleIndex + 1}.{lessonIndex + 1}
                                </span>
                              </div>

                              <div className="grid lg:grid-cols-2 gap-6">
                                <div className="bg-gray-900 rounded-lg overflow-hidden">
                                  {lesson.type === "video" ? (
                                    <video
                                      src={lesson.path}
                                      controls
                                      className="w-full aspect-video"
                                    />
                                  ) : (
                                    <iframe
                                      src={lesson.path}
                                      className="w-full h-64"
                                    />
                                  )}
                                </div>
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3 text-sm">
                                    <span className="font-medium text-gray-300">
                                      Type:
                                    </span>
                                    <span className="bg-gray-700 px-2 py-1 rounded text-gray-400">
                                      {lesson.type.toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm">
                                    <span className="font-medium text-gray-300">
                                      Module:
                                    </span>
                                    <span className="text-gray-400">
                                      {module.title}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Live Sessions */}
              <AccordionItem value="live" className="border-0">
                <AccordionTrigger className="px-8 py-6 text-lg font-semibold text-white hover:bg-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-900/50 p-2 rounded-lg">
                      <Video className="w-5 h-5 text-red-400" />
                    </div>
                    <span>Live Sessions</span>
                    <span className="text-sm text-gray-400 font-normal bg-gray-700 px-3 py-1 rounded-md">
                      {course.liveSessions.length} sessions
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8">
                  <div className="space-y-6">
                    {course.liveSessions.map((session) => (
                      <div
                        key={session._id}
                        className="bg-white/5  border border-white/10 rounded-lg overflow-hidden"
                      >
                        <Accordion type="single" collapsible>
                          <AccordionItem
                            value={session._id}
                            className="border-0"
                          >
                            <AccordionTrigger className="px-6 py-4 text-white hover:bg-gray-700">
                              <div className="flex items-center gap-4 w-full">
                                <div className="bg-red-900/50 p-2 rounded-lg">
                                  <Video className="w-4 h-4 text-red-400" />
                                </div>
                                <span className="flex-1 text-left font-medium">
                                  {session.title}
                                </span>
                                <AdminCourseStatusBadge
                                  status={session.status}
                                />
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                <div className="grid lg:grid-cols-2 gap-8">
                                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                                    <video
                                      src={
                                        session.status === "completed"
                                          ? session.recordedSrc
                                          : session.liveSrc
                                      }
                                      controls
                                      className="w-full aspect-video"
                                    />
                                  </div>
                                  <div className="space-y-6">
                                    <h4 className="font-semibold text-white text-lg">
                                      {session.title}
                                    </h4>
                                    <p className="text-gray-300 leading-relaxed">
                                      {session.description}
                                    </p>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-3">
                                        <span className="font-medium text-gray-300 flex items-center gap-2">
                                          <CheckCircle className="w-4 h-4" />
                                          Status:
                                        </span>
                                        <AdminCourseStatusBadge
                                          status={session.status}
                                        />
                                      </div>
                                      <div className="flex items-center gap-3 text-gray-300">
                                        <span className="font-medium flex items-center gap-2">
                                          <Calendar className="w-4 h-4" />
                                          Date:
                                        </span>
                                        <span className="bg-gray-700 px-3 py-1 rounded">
                                          {session.date}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 text-gray-300">
                                        <span className="font-medium flex items-center gap-2">
                                          <Clock className="w-4 h-4" />
                                          Time:
                                        </span>
                                        <span className="bg-gray-700 px-3 py-1 rounded">
                                          {session.time}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Assignments */}
              <AccordionItem value="assignments" className="border-0">
                <AccordionTrigger className="px-8 py-6 text-lg font-semibold text-white hover:bg-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-900/50 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-green-400" />
                    </div>
                    <span>Assignments</span>
                    <span className="text-sm text-gray-400 font-normal bg-gray-700 px-3 py-1 rounded-md">
                      {course.assignments.length} assignments
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8">
                  <div className="space-y-6">
                    {course.assignments.map((assignment) => (
                      <div
                        key={assignment._id}
                        className="bg-white/5  border border-white/10 rounded-lg p-6"
                      >
                        <h4 className="font-semibold text-white text-lg mb-3">
                          {assignment.title}
                        </h4>
                        <p className="text-gray-300 mb-4">
                          {assignment.description}
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <h5 className="font-medium text-white mb-2">Task:</h5>
                          <p className="text-gray-300">{assignment.task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCoursePage;
