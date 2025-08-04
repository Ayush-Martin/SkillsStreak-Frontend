import { EnrolledCourseLayout } from "@/layouts";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import {
  LessonsCard,
  AssignmentsCard,
  CertificateCard,
  RecordedClassesCard,
  LiveSessionsCard,
  AssignmentsOverviewCard,
  QuickLinksCard,
} from "@/components";
import {
  getEnrolledCourseCertificateDetails,
  getEnrolledCourseCompletionStatus,
} from "@/api";

const UserEnrolledCoursePage = () => {
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
      const data = await getEnrolledCourseCompletionStatus(courseId!);
      if (!data) return;
      setEnrolledCourseCompletionStatus(data);
    };

    fetchCompletionStatus();
  }, []);

  const getCourseCertificateDetails = async (
    setCertificateDetails: (data: {
      courseName: string;
      trainerName: string;
    }) => void
  ) => {
    const data = await getEnrolledCourseCertificateDetails(courseId!);
    if (!data) return;
    setCertificateDetails(data);
  };

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
        <CertificateCard
          progress={completionProgress}
          getCourseCertificateDetails={getCourseCertificateDetails}
        />
        <RecordedClassesCard courseId={courseId!} />
        <LiveSessionsCard courseId={courseId!} />
        <AssignmentsOverviewCard courseId={courseId!} />
      </div>
      <div className="flex gap-2">
        <div className="w-2/3">
          <QuickLinksCard />
        </div>
      </div>
    </EnrolledCourseLayout>
  );
};

export default UserEnrolledCoursePage;
