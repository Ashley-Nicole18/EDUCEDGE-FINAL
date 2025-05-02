"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";

const ProfileTutor: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    college: "",
    courseYear: "",
    schoolEmail: "",
    achievements: "",
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(
    "/img/default-profile.png" 
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.college) newErrors.college = "College is required.";
    if (!formData.courseYear) newErrors.courseYear = "Course & Year is required.";
    if (!formData.schoolEmail) newErrors.schoolEmail = "School Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.schoolEmail)) {
      newErrors.schoolEmail = "Invalid email format.";
    }
    if (!formData.achievements) newErrors.achievements = "Achievements are required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully", formData);
      setErrors({});
    }
  };

  return (
    <div className="relative h-screen flex">
      <Sidebar />
      <div className="p-17 px-10 max-w-7xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="absolute top-6 left-0 right-200 flex justify-center space-x-10 items-center">
            <Link href="/Information">
              <p className="text-based text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
                Information
              </p>
            </Link>
            <Link
              href={{
                pathname: "/profilecourse",
                query: { course: formData.college },
              }}
            >
              <p className="text-based text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
                Course
              </p>
            </Link>
            <Link href="/reviews">
              <p className="text-based text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
                Reviews
              </p>
            </Link>
          </div>

          
          <div className="flex items-center space-x-6">
            <div className="w-30 h-30 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
              <img
                src={profilePicture || "/img/default-profile.png"}
                alt="Profile Picture"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <label
                htmlFor="profilePictureUpload"
                className="block text-sm text-blue-500 cursor-pointer">
                Upload Photo
              </label>
              <input
                id="profilePictureUpload"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </div>
          </div>

          
          <h1 className="text-black text-based whitespace-nowrap mb-1">Personal Information</h1>
          <div className="flex space-x-10">
            <div>
              <label htmlFor="firstName" className="block text-black text-xs mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-64"
                placeholder="Enter first name"
              />
              {errors.firstName && <p className="text-red-600 text-xs">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-black text-xs mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-64"
                placeholder="Enter last name"
              />
              {errors.lastName && <p className="text-red-600 text-xs">{errors.lastName}</p>}
            </div>
          </div>

          
          <h2 className="text-black text-based font-medium mb-1">Academic Information</h2>
          <div className="flex space-x-10">
            <div>
              <label htmlFor="college" className="block text-black text-xs mb-1">
                College <span className="text-red-500">*</span>
              </label>
              <input
                id="college"
                name="college"
                type="text"
                value={formData.college}
                onChange={handleChange}
                className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-64"
                placeholder="Enter college name"
              />
              {errors.college && <p className="text-red-600 text-xs">{errors.college}</p>}
            </div>

            <div>
              <label htmlFor="courseYear" className="block text-black text-xs mb-1">
                Course & Year <span className="text-red-500">*</span>
              </label>
              <input
                id="courseYear"
                name="courseYear"
                type="text"
                value={formData.courseYear}
                onChange={handleChange}
                className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-64"
                placeholder="Enter course and year"
              />
              {errors.courseYear && <p className="text-red-600 text-xs">{errors.courseYear}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="schoolEmail" className="block text-black text-xs mb-1">
              School Email <span className="text-red-500">*</span>
            </label>
            <input
              id="schoolEmail"
              name="schoolEmail"
              type="email"
              value={formData.schoolEmail}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-100"
              placeholder="Enter school email"

            />
            {errors.schoolEmail && <p className="text-red-600 text-xs">{errors.schoolEmail}</p>}
          </div>

          
          <h2 className="text-black text-based font-medium mb-1">Credentials</h2>
          <div>
            <label htmlFor="achievements" className="block text-black text-xs mb-1">
              Achievements <span className="text-red-500">*</span>
            </label>
            <textarea
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-full h-25 resize-none"
              placeholder="Enter achievements (e.g., Graduated with honors in Senior High School)"
            ></textarea>
            {errors.achievements && <p className="text-red-600 text-xs">{errors.achievements}</p>}
          </div>

          <div className="relative h-64">
            <button
              type="submit"
              className="absolute top-0 right-4 bg-blue-500 text-white py-1 px-5 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileTutor;
