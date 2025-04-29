import React from "react";
import Sidebar from "./Sidebar";


const ProfileTutee: React.FC = () => {
  return (
    <div className="relative h-full flex">
      <Sidebar />

      <div className="p-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center mb-1">
          <div className="w-30 h-30 bg-gray-300 rounded-full mr-10 flex items-center justify-center">
            <span className="text-blue-40 text-5xl font-bold">A</span>
          </div>
          <h1 className="text-black text-s whitespace-nowrap">Personal Information</h1>
        </div>

        
        <div className="flex items-center space-x-15 mb-10 ml-5">
          <button
            className="text-blue-500 text-xs border border-blue-500 px-5 py-1 rounded text-center hover:bg-blue-100"
            type="button"
          >
            Upload
          </button>

          <div>
            <label
              htmlFor="first-name"
              className="block text-black text-xs mb-1 whitespace-nowrap"
            >
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-64"
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
        <div className="mt-10 ml-40">
          <h2 className="text-black text-s font-base">Academic Information</h2>
        </div>

        <div className="mt-10 ml-40">
          <div className="flex space-x-10">
            <div className="w-1/2">
              <label
                htmlFor="college"
                className="block text-black text-xs mb-1"
              >
                College
              </label>
              <input
                id="college"
                type="text"
                className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-65"
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
                className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-65"
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
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-154"
              placeholder="Enter school email"
              required
            />
          </div>
        </div>

        <div className="mt-10 ml-40">
          <h2 className="text-black text-s font-base">Additional Information</h2>
        </div>
        <div className="mt-4 ml-40">
          <label
            htmlFor="achievements"
            className="block text-black text-xs mb-1"
          ></label>
          <textarea
            className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-154 h-25 resize-none"
            placeholder="Tell potential tutors about yourself and what you hope to achieve through tutoring..."
          />
        </div>
        <button
          className="absolute top-163 right-5 bg-blue-500 text-white py-2 px-5 rounded hover:bg-blue-700"
          type="submit"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProfileTutee;
