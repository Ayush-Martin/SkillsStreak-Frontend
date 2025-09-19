import { RootReducer } from "@/store";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  BookOpen,
  CalendarClock,
  ClipboardList,
  Video,
  Download,
  ArrowRight,
} from "lucide-react";
import { JSX, FC, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import certificateTemplate from "@/assets/images/certificateTemplate.jpg";

interface ICourseCardLinkProps {
  to: string;
  title: string;
  subtitle: string;
  icon: JSX.Element;
  color: string;
}

interface ICourseCardLink {
  courseId: string;
}

interface ILessonsCardProps {
  completed: number;
  total: number;
}

interface IAssignmentsCardProps {
  submitted: number;
  total: number;
}

interface ICertificateCardProps {
  progress: number;
  getCourseCertificateDetails: (
    setCertificateDetails: (data: {
      courseName: string;
      trainerName: string;
    }) => void
  ) => void;
}

export const CourseCardLink: FC<ICourseCardLinkProps> = ({
  to,
  title,
  subtitle,
  icon,
  color,
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

export const RecordedClassesCard: FC<ICourseCardLink> = ({ courseId }) => (
  <CourseCardLink
    to={`/user/enrolledCourses/${courseId}/recorded`}
    title="Recorded Classes"
    subtitle="Watch at your own pace"
    icon={<BookOpen className="w-6 h-6 text-indigo-400" />}
    color="bg-indigo-500/20"
  />
);

export const LiveSessionsCard: FC<ICourseCardLink> = ({ courseId }) => (
  <CourseCardLink
    to={`/user/enrolledCourses/${courseId}/live`}
    title="Live Sessions"
    subtitle="Join real-time classes"
    icon={<CalendarClock className="w-6 h-6 text-sky-400" />}
    color="bg-sky-500/20"
  />
);

export const AssignmentsOverviewCard: FC<ICourseCardLink> = ({ courseId }) => (
  <CourseCardLink
    to={`/user/enrolledCourses/${courseId}/assignments`}
    title="Assignments"
    subtitle="View and submit tasks"
    icon={<ClipboardList className="w-6 h-6 text-emerald-400" />}
    color="bg-emerald-500/20"
  />
);

export const LessonsCard: FC<ILessonsCardProps> = ({ completed, total }) => {
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

export const AssignmentsCard: FC<IAssignmentsCardProps> = ({
  submitted,
  total,
}) => {
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

export const CertificateCard: FC<ICertificateCardProps> = ({
  progress,
  getCourseCertificateDetails,
}) => {
  const [certificateDetails, setCertificateDetails] = useState<{
    courseName: string;
    trainerName: string;
  }>({ courseName: "", trainerName: "" });

  useEffect(() => {
    if (progress >= 100) {
      getCourseCertificateDetails(setCertificateDetails);
    }
  }, [progress]);

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
              {certificateDetails.courseName}
            </h2>
            <h2 className="absolute top-[615px] right-0 transform -translate-x-1/2 text-lg text-app-accent text-center">
              {certificateDetails.trainerName}
            </h2>
          </div>
        </div>

        <button
          onClick={generatePdf}
          disabled={!isCompleted}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white px-4 py-2 font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          Download Certificate
        </button>
      </div>
    </div>
  );
};

interface IQuickLinksCardProps {
  courseId: string;
}

export const QuickLinksCard: FC<IQuickLinksCardProps> = ({ courseId }) => {
  const navigate = useNavigate();

  const links = [
    {
      label: "View Course",
      icon: <Video className="w-5 h-5 text-indigo-400" />,
      onClick: () => navigate(`/courses/${courseId}`),
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
