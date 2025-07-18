import { UserSidebar } from "@/components";
import { UserLayout } from "@/layouts";
import {
  FaBookOpen,
  FaVideo,
  FaChalkboardTeacher,
  FaFileAlt,
  FaDownload,
  FaClipboardList,
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress"; // Assume you have a progress component
import React from "react";

const UserNewCoursePage = () => {
  const courseProgress = 72; // example
  const completedAssignments = 6;
  const totalAssignments = 8;

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 md:mt-0 p-6 space-y-8">
          {/* Progress + Certificate + Notebook */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-5 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-2">Course Progress</h2>
              <Progress value={courseProgress} />
              <p className="mt-2 text-sm text-gray-300">
                {courseProgress}% completed
              </p>
            </div>

            <div className="bg-gray-800 p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Certificate</h2>
                <p className="text-sm text-gray-400">
                  Download after completion
                </p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FaDownload /> Download
              </button>
            </div>

            <div className="bg-gray-800 p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Notebook</h2>
                <p className="text-sm text-gray-400">Take your own notes</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Open
              </button>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recorded Lessons */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-2">
                <FaVideo className="text-purple-400 text-xl" />
                <h3 className="text-lg font-medium">Recorded Lessons</h3>
              </div>
              <p className="text-sm text-gray-400">
                Watch your course content anytime
              </p>
            </div>

            {/* Live Sessions */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-2">
                <FaChalkboardTeacher className="text-yellow-400 text-xl" />
                <h3 className="text-lg font-medium">Live Sessions</h3>
              </div>
              <p className="text-sm text-gray-400">
                Join upcoming live classes
              </p>
            </div>

            {/* Assignments */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-2">
                <FaClipboardList className="text-pink-400 text-xl" />
                <h3 className="text-lg font-medium">Assignments</h3>
              </div>
              <p className="text-sm text-gray-400">
                {completedAssignments} of {totalAssignments} completed
              </p>
              <div className="w-full bg-gray-700 h-2 rounded mt-3">
                <div
                  className="h-full bg-pink-500 rounded"
                  style={{
                    width: `${
                      (completedAssignments / totalAssignments) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserNewCoursePage;
