import { EnrolledCourseLayout } from "@/layouts";
import certificateTemplate from "@/assets/images/certificateTemplate.jpg";
import { FC, JSX, useEffect, useRef, useState } from "react";

import {
  AlarmClock,
  ArrowRight,
  BookOpen,
  CalendarClock,
  ClipboardList,
  Download,
  Flag,
  MessageSquare,
  User,
  Video,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosGetRequest } from "@/config/axios";

import { RootReducer } from "@/store";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import { FaDownload } from "react-icons/fa6";

const UserEnrolledCoursePage = () => {
  const canCancel = false;
  const { courseId } = useParams();
  const [enrolledCourseCompletionStatus, setEnrolledCourseCompletionStatus] =
    useState<{
      totalLessons: number;
      completedLessons: number;
      totalAssignments: number;
      completedAssignments: number;
    }>({
      totalLessons: 0,
      completedLessons: 0,
      totalAssignments: 0,
      completedAssignments: 0,
    });

  const totalItems =
    enrolledCourseCompletionStatus.totalLessons +
    enrolledCourseCompletionStatus.totalAssignments;

  const completedItems =
    enrolledCourseCompletionStatus.completedLessons +
    enrolledCourseCompletionStatus.completedAssignments;

  const completionProgress =
    totalItems > 0 ? Math.floor((completedItems / totalItems) * 100) : 0;

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      const res = await axiosGetRequest(`/enrolledCourses/${courseId}`);
      if (!res) return;
      setEnrolledCourseCompletionStatus(res.data);
    };

    fetchCompletionStatus();
  }, []);

  return (
    <EnrolledCourseLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <LessonsCard
          completed={enrolledCourseCompletionStatus.completedLessons}
          total={enrolledCourseCompletionStatus.totalLessons}
        />
        <AssignmentsCard
          submitted={enrolledCourseCompletionStatus.completedAssignments}
          total={enrolledCourseCompletionStatus.totalAssignments}
        />
        <CertificateCard progress={completionProgress} />
        <RecordedClassesCard courseId={courseId!} />
        <LiveSessionsCard courseId={courseId!} />
        <AssignmentsOverviewCard courseId={courseId!} />
      </div>
      <div className="flex gap-2">
        <div className="w-2/3">
          <QuickLinksCard />
        </div>
        <div className="w-1/3">
          {canCancel ? <CancelCourseCard /> : <ReportIssueCard />}
        </div>
      </div>
    </EnrolledCourseLayout>
  );
};

// 🔁 Reusable Card Template
const CourseCardLink = ({
  to,
  title,
  subtitle,
  icon,
  color,
}: {
  to: string;
  title: string;
  subtitle: string;
  icon: JSX.Element;
  color: string;
}) => {
  return (
    <Link
      to={to}
      className="block rounded-2xl p-6 bg-white/5 border border-white/10 shadow-lg backdrop-blur-xl hover:shadow-2xl transition"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-300">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
};

interface ICourseCardLink {
  courseId: string;
}
const RecordedClassesCard: FC<ICourseCardLink> = ({ courseId }) => (
  <CourseCardLink
    to={`/user/enrolledCourses/${courseId}/recorded`}
    title="Recorded Classes"
    subtitle="Watch at your own pace"
    icon={<BookOpen className="w-6 h-6 text-indigo-400" />}
    color="bg-indigo-500/20"
  />
);

const LiveSessionsCard: FC<ICourseCardLink> = ({ courseId }) => (
  <CourseCardLink
    to={`/user/enrolledCourses/${courseId}/live`}
    title="Live Sessions"
    subtitle="Join real-time classes"
    icon={<CalendarClock className="w-6 h-6 text-sky-400" />}
    color="bg-sky-500/20"
  />
);

const AssignmentsOverviewCard: FC<ICourseCardLink> = ({ courseId }) => (
  <CourseCardLink
    to={`/user/enrolledCourses/${courseId}/assignments`}
    title="Assignments"
    subtitle="View and submit tasks"
    icon={<ClipboardList className="w-6 h-6 text-emerald-400" />}
    color="bg-emerald-500/20"
  />
);

interface ILessonsCardProps {
  completed: number;
  total: number;
}
const LessonsCard: FC<ILessonsCardProps> = ({ completed, total }) => {
  const progress = (completed / total) * 100;

  return (
    <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video className="w-6 h-6 text-violet-400" />
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">
              Lessons Completed
            </h2>
            <p className="text-sm text-gray-300">Track your course progress</p>
          </div>
        </div>
        <div className="text-xl font-bold text-white">
          {completed}/{total}
        </div>
      </div>
      <div className="w-full mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

interface IAssignmentsCardProps {
  submitted: number;
  total: number;
}
const AssignmentsCard: FC<IAssignmentsCardProps> = ({ submitted, total }) => {
  const progress = (submitted / total) * 100;

  return (
    <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">
            Assignments Submitted
          </h2>
          <p className="text-sm text-gray-300">Submission progress overview</p>
        </div>
        <div className="text-xl font-bold text-emerald-400">
          {submitted}/{total}
        </div>
      </div>
      <div className="w-full mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

interface ICertificateCardProps {
  progress: number;
}
const CertificateCard: FC<ICertificateCardProps> = ({ progress }) => {
  const isCompleted = progress >= 100;
  const certificateRef = useRef<HTMLDivElement>(null);
  const { username } = useSelector((state: RootReducer) => state.user);

  const generatePdf = async () => {
    const canvas = await html2canvas(certificateRef.current as HTMLElement);

    const imgData = canvas.toDataURL("image/png");

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [imgWidth, imgHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("certificate.pdf");
  };

  return (
    <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Certificate</h2>
          <p className="text-sm text-gray-300">
            Unlock after completing the course
          </p>
        </div>
        <div className="relative w-16 h-16">
          <svg className="transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-700"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-purple-500"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${progress}, 100`}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
            {progress}%
          </span>
        </div>
      </div>

      <div>
        {/* Hidden div for the certificate template but rendered*/}
        <div
          className="absolute opacity-0 pointer-events-none"
          style={{
            position: "absolute",
            zIndex: -1,
            width: 0,
            height: 0,
            overflow: "hidden",
          }}
        >
          <div
            ref={certificateRef}
            className="w-[1280px] h-[720px] relative text-center bg-cover"
            style={{
              background: `url(${certificateTemplate}) no-repeat center center`,
            }}
          >
            <h1 className="absolute top-[485px] left-[50%] transform -translate-x-1/2 text-4xl text-white font-mono font-semibold">
              {username}
            </h1>
            <h2 className="absolute top-[600px] left-[50%] transform -translate-x-1/2 text-2xl text-app-accent">
              {"dfdf"}
            </h2>
            <h2 className="absolute top-[615px] right-0 transform -translate-x-1/2 text-lg text-app-accent text-center">
              {"dfdf"}
            </h2>
          </div>
        </div>

        <button onClick={generatePdf} className="text-2xl text-app-secondary">
          <FaDownload />
        </button>
      </div>

      {/* <button
        disabled={!isCompleted}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white px-4 py-2 font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        Download Certificate
      </button> */}
    </div>
  );
};

const CancelCourseCard = () => {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/20 shadow-lg backdrop-blur-lg w-full">
      <h3 className="text-red-300 text-lg font-semibold mb-2 flex items-center gap-2">
        <XCircle className="w-5 h-5 text-red-400" />
        Cancel Course Purchase
      </h3>

      <p className="text-sm text-red-200 mb-4">
        You can cancel your course purchase{" "}
        <span className="font-medium text-white">before July 20, 2025</span> to
        receive a full refund.
      </p>

      <div className="flex items-center gap-2 text-sm text-red-300 mb-4">
        <AlarmClock className="w-4 h-4" />
        Deadline:{" "}
        <span className="font-semibold text-white ml-1">11:59 PM IST</span>
      </div>

      <button
        onClick={() => console.log("Cancel requested")}
        className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 transition text-white font-medium"
      >
        Cancel Purchase
      </button>
    </div>
  );
};

const ReportIssueCard = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-rose-900/20 to-rose-800/10 border border-rose-500/20 shadow-lg backdrop-blur-lg w-full">
      <h3 className="text-rose-300 text-lg font-semibold mb-2 flex items-center gap-2">
        <Flag className="w-5 h-5 text-rose-400" />
        Report a Problem
      </h3>

      <p className="text-sm text-rose-200 mb-4">
        Having an issue with your course experience? Let us know and we'll help
        resolve it quickly.
      </p>

      <button
        onClick={() => navigate("/user/report")}
        className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 transition text-white font-medium"
      >
        Report Issue
      </button>
    </div>
  );
};

const QuickLinksCard = () => {
  const navigate = useNavigate();

  const links = [
    {
      label: "View Course",
      icon: <Video className="w-5 h-5 text-indigo-400" />,
      onClick: () => navigate("/user/view-course"),
    },
    {
      label: "Course Chat",
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
      onClick: () => navigate("/user/course-chat"),
    },
    {
      label: "Trainer Chat",
      icon: <User className="w-5 h-5 text-yellow-400" />,
      onClick: () => navigate("/user/trainer-chat"),
    },
  ];

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-lg backdrop-blur-lg">
      <h3 className="text-white text-lg font-semibold mb-4 tracking-wide">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {links.map(({ label, icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition transform hover:scale-[1.02] group"
          >
            <div className="flex items-center gap-3 text-white">
              {icon}
              <span className="font-medium group-hover:text-white/90">
                {label}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserEnrolledCoursePage;
