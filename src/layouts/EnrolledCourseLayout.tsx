import { UserSidebar ,CourseUtils} from "@/components";
import ViewCourseContext from "@/context/ViewCourseContext";
import  { FC, ReactNode, useState } from "react";
import {UserLayout} from "@/layouts";
import useViewCourse from "@/hooks/useViewCourse";

interface IEnrolledCourseLayoutProps {
  children: ReactNode;
}

const EnrolledCourseLayout: FC<IEnrolledCourseLayoutProps> = ({ children }) => {
  const [isUtilityOpen, setIsUtilityOpen] = useState(false);

  const {
    aiChats,
    fetchWelcomeAiChat,
    sendAiChatMessage,
    addNotebook,
    deleteNotebook,
    fetchNotebooks,
    notebooks,
    updateNotebook,
  } = useViewCourse();
  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <ViewCourseContext.Provider
          value={{
            aiChats,
            fetchWelcomeAiChat,
            sendAiChatMessage,
            addNotebook,
            deleteNotebook,
            fetchNotebooks,
            notebooks,
            updateNotebook,
          }}
        >
          <div className="w-full mt-10 ml-0 text-white md:ml-64 md:mt-0 p-6 space-y-8 h-full">
            {children}
          </div>
          <CourseUtils
            isCourseUtilsOpen={isUtilityOpen}
            toggleCourseUtilsOpen={() => setIsUtilityOpen((p) => !p)}
          />
        </ViewCourseContext.Provider>
      </div>
    </UserLayout>
  );
};

export default EnrolledCourseLayout;
