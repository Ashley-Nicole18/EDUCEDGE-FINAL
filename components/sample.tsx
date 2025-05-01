"use client";
import { useState } from "react";
import TutorInfo from "./ProfileTutorInfoDisplay"; // you'll create this
import CourseList from "./ProfileTutorCourseDisplay";
import TutorReviews from "./ProfileTutorReviewDisplay";

export default function ProfileTutor() {
  const [activeTab, setActiveTab] = useState<"info" | "courses" | "reviews">("info");

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2 rounded ${activeTab === "info" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
        >
          Info
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded ${activeTab === "courses" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 rounded ${activeTab === "reviews" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
        >
          Reviews
        </button>
      </div>

      {/* Content */}
      {activeTab === "info" && <TutorInfo />}
      {activeTab === "courses" && <CourseList />}
      {activeTab === "reviews" && <TutorReviews />}
    </div>
  );
}
