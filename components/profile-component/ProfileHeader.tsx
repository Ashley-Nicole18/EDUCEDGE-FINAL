'use client';

import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { FaUserCircle } from "react-icons/fa";
import TutorInfoSection from "./Profile-Tutor-Info";
import TutorCourses from "./Tutor-Course-Section";
import TutorReviews from "./TutorReviews";

interface ProfileHeaderProps {
  userId: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId }) => {
  const [activeSection, setActiveSection] = useState<"info" | "courses" | "reviews">("info");

  return (
    <div className="relative h-screen flex">
      <Sidebar />
      <div className="p-10 px-11 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
              <FaUserCircle className="text-gray-400 text-6xl" />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={() => setActiveSection("info")}
              className={`px-4 py-2 rounded-lg ${
                activeSection === "info"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setActiveSection("courses")}
              className={`px-4 py-2 rounded-lg ${
                activeSection === "courses"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveSection("reviews")}
              className={`px-4 py-2 rounded-lg ${
                activeSection === "reviews"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        <div className="mt-8">
          {activeSection === "info" && (
            <TutorInfoSection userId={userId} />
          )}

          {activeSection === "courses" && (
            <TutorCourses userId={userId} />
          )}

          {activeSection === "reviews" && (
            <div>
              <TutorReviews userId={userId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;