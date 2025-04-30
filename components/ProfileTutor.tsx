import React from "react";
import Sidebar from "./Sidebar";

const ProfileTutor: React.FC = () => {
  return (
    <div className="relative h-screen flex">
      <Sidebar />

      
      <div className="absolute top-6 left-0 right-200 flex justify-center space-x-10 items-center">
        <p className="text-based text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
          Information
        </p>
        <p className="text-based text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
          Course
        </p>
        <p className="text-based text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
          Reviews
        </p>
      </div>

      <div className="p-17 px-10 max-w-7xl mx-auto w-full">

        <div className="flex items-center mb-1">
          <div className="w-30 h-30 bg-gray-300 rounded-full mr-6 flex items-center justify-center">
            <span className="text-blue-500 text-5xl font-bold">A</span>
          </div>
          <h1 className="text-black text-based whitespace-nowrap">Personal Information</h1>
        </div>

        <div className="flex items-center space-x-6 mb-10 ml-5">
          <button
            className="text-blue-500 text-xs border border-blue-500 px-5 py-1 rounded text-center hover:bg-blue-100"
            type="button"
          >
            Upload
          </button>

          <div>
            <label
              htmlFor="first-name"
              className="px-10 block text-black text-xs mb-1 whitespace-nowrap"
            >
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              className="ml-10 border border-gray-300 px-2 py-1 text-black text-sm rounded w-64"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label
              htmlFor="last-name"
              className="ml-10 block text-black text-xs mb-1 whitespace-nowrap"
            >
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-64 ml-10"
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="mt-10 ml-35">
          <h2 className="text-black text-based font-medium">Academic Information</h2>
        </div>

        <div className="mt-10 ml-40">
          <div className="flex space-x-10">
            <div className="w-71">
              <label htmlFor="college" className="block text-black text-xs mb-1">
                College
              </label>
              <input
                id="college"
                type="text"
                className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-64"
                placeholder="Enter college name"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="course-year"
                className="block text-black text-xs mb-1"
              >
                Course & Year
              </label>
              <input
                id="course-year"
                type="text"
                className="mr-90 border border-gray-300 px-2 py-1 text-black text-sm rounded w-64 "
                placeholder="Enter course and year"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="school-email"
              className="block text-black text-xs mb-1"
            >
              School Email
            </label>
            <input
              id="school-email"
              type="email"
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-146"
              placeholder="Enter school email"
              required
            />
          </div>
        </div>

        <div className="mt-10 ml-35">
          <h2 className="text-black text-based font-medium">Achievements</h2>
        </div>
        <div className="mt-4 ml-40">
          <label
            htmlFor="achievements"
            className="block text-black text-xs mb-1"
          >
            
          </label>
          <textarea
            id="achievements"
            className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-full h-32 resize-none"
            placeholder="Enter achievements (e.g., Graduated with honors in Senior High School)"
          />
        </div>

        <button
          className="mt-6 ml-205 bg-blue-500 text-white py-2 px-5 rounded hover:bg-blue-700"
          type="submit"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProfileTutor;
