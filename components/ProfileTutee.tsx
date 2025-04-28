import React from "react";

const ProfileTutee: React.FC = () => {
  return (
    <div className="relative h-full p-13">
      <div className="flex items-center mb-1 ml-25">
        <div className="w-20 h-20 bg-gray-300 rounded-full mr-10 flex items-center justify-center">
          <span className="text-black text-2xl">+</span>
        </div>
        <h1 className="text-black text-xs whitespace-nowrap">Personal Information</h1>
      </div>

      <div className="flex items-center space-x-10 mb-5">
        <div className="flex items-center space-x-5">
          <button className="text-blue-500 text-xs border border-blue-500 px-5 py-1 rounded text-center ml-25">
            Upload
          </button>
        </div>
        <div className="flex space-x-5">
          <div>
            <label className="block text-black text-xs mb-1 whitespace-nowrap">First Name</label>
            <input
              type="text"
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-50"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-black text-xs mb-1 whitespace-nowrap">Last Name</label>
            <input
              type="text"
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-50"
              placeholder="Enter last name"
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-black text-xs font-base px-55">Academic Information</h2>
      </div>

      <div className="mt-10 flex flex-col space-y-5 ml-55"> 
        <div>
          <label className="block text-black text-xs mb-1">College</label>
          <input
            type="text"
            className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-45"
            placeholder="Enter college name"
          />
        </div>

        <div>
          <label className="block text-black text-xs mb-1">Course & Year</label>
          <input
            type="text"
            className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-45"
            placeholder="Enter course and year"
          />
        </div>

        <div>
          <label className="block text-black text-xs mb-1">School Email</label>
          <input
            type="email"
            className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-full"
            placeholder="Enter school email"
            required
          />
        </div>
      </div>
     
      <button className="absolute bottom-13 right-15 bg-blue-500 text-white py-1 px-5 rounded hover:bg-blue-700">
        Submit
      </button>
    </div>
  );
};

export default ProfileTutee;
