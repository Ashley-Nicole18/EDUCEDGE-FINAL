"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { UserCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import { db, auth } from "@/app/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface FormData {
  firstName: string;
  lastName: string;
  college: string;
  courseYear: string;
  schoolEmail: string;
  achievements: string;
}

const ProfileTutee: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    college: "",
    courseYear: "",
    schoolEmail: "",
    achievements: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setFormData(docSnap.data() as FormData);
            setIsSubmitted(true);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.college) newErrors.college = "College is required.";
    if (!formData.courseYear)
      newErrors.courseYear = "Course & Year is required.";
    if (!formData.schoolEmail)
      newErrors.schoolEmail = "School Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.schoolEmail)) {
      newErrors.schoolEmail = "Invalid email format.";
    }
    if (!formData.achievements)
      newErrors.achievements = "Achievements are required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const user = auth.currentUser;
        if (user) {
          await updateDoc(doc(db, "users", user.uid), {
            ...formData,
            lastUpdated: new Date().toISOString(),
          });
          console.log("Profile saved successfully");
          setErrors({});
          setIsSubmitted(true);
          alert("Profile saved successfully!");
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        alert("Error saving profile.");
      }
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8 max-w-6xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {formData.firstName} {formData.lastName}
                  </h1>
                  <p className="text-gray-600">{formData.college}</p>
                </div>
              </div>
              <button
                onClick={handleEdit}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">First Name</p>
                    <p className="text-gray-800">{formData.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Last Name</p>
                    <p className="text-gray-800">{formData.lastName}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Academic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">College</p>
                    <p className="text-gray-800">{formData.college}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Course & Year</p>
                    <p className="text-gray-800">{formData.courseYear}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">School Email</p>
                    <p className="text-gray-800">{formData.schoolEmail}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  About Me & Learning Goals
                </h2>
                <div className="prose max-w-none text-gray-800 whitespace-pre-line">
                  {formData.achievements}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-100">
                <UserCircleIcon className="h-16 w-16 text-gray-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
                <p className="text-gray-600">Update your personal information</p>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Academic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                    College <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="college"
                    name="college"
                    type="text"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter college name"
                  />
                  {errors.college && (
                    <p className="mt-1 text-sm text-red-600">{errors.college}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="courseYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Course & Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="courseYear"
                    name="courseYear"
                    type="text"
                    value={formData.courseYear}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Computer Science, 3rd Year"
                  />
                  {errors.courseYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.courseYear}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    School Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="schoolEmail"
                    name="schoolEmail"
                    type="email"
                    value={formData.schoolEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter school email"
                  />
                  {errors.schoolEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.schoolEmail}</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Additional Information
              </h2>
              <div>
                <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 mb-1">
                  About Me/Learning Goals <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="achievements"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                  placeholder="Tell potential tutors about yourself and what you hope to achieve through tutoring..."
                />
                {errors.achievements && (
                  <p className="mt-1 text-sm text-red-600">{errors.achievements}</p>
                )}
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileTutee;