import { EnrolledCourseLayout } from "@/layouts";

import { JSX } from "react";

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
import { Link, useNavigate } from "react-router-dom";

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

// 👇 Specific Cards using the template
const RecordedClassesCard = () => (
  <CourseCardLink
    to="/user/course/recorded"
    title="Recorded Classes"
    subtitle="Watch at your own pace"
    icon={<BookOpen className="w-6 h-6 text-indigo-400" />}
    color="bg-indigo-500/20"
  />
);

const LiveSessionsCard = () => (
  <CourseCardLink
    to="/user/course/live"
    title="Live Sessions"
    subtitle="Join real-time classes"
    icon={<CalendarClock className="w-6 h-6 text-sky-400" />}
    color="bg-sky-500/20"
  />
);

const AssignmentsOverviewCard = () => (
  <CourseCardLink
    to="/user/course/assignments"
    title="Assignments"
    subtitle="View and submit tasks"
    icon={<ClipboardList className="w-6 h-6 text-emerald-400" />}
    color="bg-emerald-500/20"
  />
);

// 📘 Existing Cards
const LessonsCard = () => {
  const completed = 12;
  const total = 20;
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

const AssignmentsCard = () => {
  const submitted = 4;
  const total = 6;
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

const CertificateCard = () => {
  const progress = 75;
  const isCompleted = progress >= 100;

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

      <button
        disabled={!isCompleted}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white px-4 py-2 font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        Download Certificate
      </button>
    </div>
  );
};

// 🧠 Page Component
const UserNewCoursePage = () => {
  const canCancel = false;

  return (
    <EnrolledCourseLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <LessonsCard />
        <AssignmentsCard />
        <CertificateCard />
        <RecordedClassesCard />
        <LiveSessionsCard />
        <AssignmentsOverviewCard />
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

export default UserNewCoursePage;
