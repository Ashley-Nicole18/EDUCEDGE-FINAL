"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/app/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaPlus, FaMinus } from "react-icons/fa";
import BookingSystem from "../create-booking/BookingSystem";

interface Lesson {
  name: string;
  price?: number;
}

interface Course {
  name: string;
  lessons: Lesson[];
}

interface ManageCoursesProps {
  userId: string | null;
}

const TutorCourses: React.FC<ManageCoursesProps> = ({ userId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [selectedTutorIdForBooking, setSelectedTutorIdForBooking] = useState<string | null>(null);
  const [bookingSubject, setBookingSubject] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const userDocRef = doc(db, "users", userId);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setProfileRole(docSnap.data()?.role as string | null);
          }
        } catch (e: unknown) {
          console.error("Error fetching user data:", e);
        }
      }
    };

    const fetchCourses = async () => {
      if (userId) {
        setLoading(true);
        setError(null);
        const docRef = doc(db, "user_courses", userId);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data()?.courses) {
            setCourses(docSnap.data().courses as Course[]);
          } else {
            setCourses([{ name: "", lessons: [{ name: "" }] }]);
          }
        } catch (e: unknown) {
          if (e instanceof Error) {
            console.error("Error fetching courses:", e.message);
            setError(`Failed to load courses: ${e.message}`);
          } else {
            console.error("An unknown error occurred while fetching courses:", e);
            setError("Failed to load courses due to an unknown error.");
          }
          setCourses([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("User ID not available.");
        setCourses([]);
      }
    };

    fetchUserData();
    fetchCourses();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setCurrentUserRole(docSnap.data()?.role as string | null);
          }
        } catch (e) {
          console.error("Error fetching current user role", e);
        }
      } else {
        setCurrentUserRole(null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const handleCourseChange = (index: number, value: string) => {
    const updated = [...courses];
    updated[index].name = value;
    setCourses(updated);
  };

  const handleLessonChange = (
    courseIndex: number,
    lessonIndex: number,
    value: string
  ) => {
    const updated = [...courses];
    updated[courseIndex].lessons[lessonIndex].name = value;
    setCourses(updated);
  };

  const handleLessonPriceChange = (
    courseIndex: number,
    lessonIndex: number,
    value: string
  ) => {
    const updated = [...courses];
    const price = parseFloat(value);
    updated[courseIndex].lessons[lessonIndex].price = isNaN(price) ? 0 : price;
    setCourses(updated);
  };

  const addCourse = () => {
    setCourses([...courses, { name: "", lessons: [{ name: "" }] }]);
  };


  const addLesson = (courseIndex: number) => {
    const updated = [...courses];
    updated[courseIndex].lessons.push({ name: "" });
    setCourses(updated);
  };

  const removeLesson = (courseIndex: number, lessonIndex: number) => {
    const updated = [...courses];
    updated[courseIndex].lessons = updated[courseIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setCourses(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      try {
        const docRef = doc(db, "user_courses", userId);
        await setDoc(docRef, { courses });
        alert("Courses saved successfully!");
        setIsEditing(false);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error("Error saving:", e.message);
          alert(`Error saving data: ${e.message}`);
        } else {
          console.error("An unknown error occurred while saving:", e);
          alert("Error saving data due to an unknown error.");
        }
      }
    } else {
      alert("User ID not available. Cannot save courses.");
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleBookNow = (courseName: string, lessonName: string) => {
    setSelectedTutorIdForBooking(userId);
    setBookingSubject(lessonName);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedTutorIdForBooking(null);
    setBookingSubject(null);
  };

  if (loading) {
    return <p className="p-4 text-gray-600">Loading courses...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Courses</h2>
        {profileRole === "tutor" &&
          currentUserRole === "tutor" && (
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-md text-sm ${
                isEditing
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
            >
              {isEditing ? "View Courses" : "Add Courses"}
            </button>
          )}
      </div>

      {!isEditing ? (
        courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index} className="mb-6 p-4 border rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {course.name}
              </h3>
              <ul className="list-none pl-0">
                {course.lessons?.length > 0 ? (
                  course.lessons.map((lesson, lessonIndex) => (
                    <li
                      key={lessonIndex}
                      className="text-gray-700 mb-2 flex items-center rounded-md bg-gray-50 py-2 px-3"
                    >
                      <span className="flex-grow">{lesson.name}</span>
                      <div className="flex items-center space-x-4">
                        {lesson.price && lesson.price > 0 && (
                          <span className="text-sm text-gray-600">
                            ₱{lesson.price.toFixed(2)}
                          </span>
                        )}
                        {profileRole === "tutor" &&
                          currentUserRole !== "tutor" && (
                            <button
                              onClick={() =>
                                handleBookNow(
                                  course.name,
                                  lesson.name,
                                )
                              }
                              className="bg-green-500 text-white py-2 px-4 rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              Book Now
                            </button>
                          )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600">
                    No lessons in this course yet.
                  </li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No courses added yet.</p>
        )
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {courses.map((course, courseIndex) => (
            <div key={courseIndex} className="border-b pb-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black sm:text-sm"
                  value={course.name}
                  onChange={(e) => handleCourseChange(courseIndex, e.target.value)}
                />
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-800 mt-2 mb-2">Lessons:</h4>
                {course.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="mb-2 flex items-center space-x-2">
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-700">Lesson Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black sm:text-sm"
                        value={lesson.name}
                        onChange={(e) => handleLessonChange(courseIndex, lessonIndex, e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700">Price (₱)</label>
                      <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black sm:text-sm"
                        value={lesson.price || ''}
                        onChange={(e) => handleLessonPriceChange(courseIndex, lessonIndex, e.target.value)}
                      />
                    </div>
                    {course.lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(courseIndex, lessonIndex)}
                        className="p-2 rounded-md text-red-500 hover:bg-red-100"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLesson(courseIndex)}
                  className="inline-flex items-center mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="mr-2" /> Add Lesson
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addCourse}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2" /> Add Course
          </button>
          <button
            type="submit"
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Courses
          </button>
        </form>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedTutorIdForBooking && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 relative">
            <button
              onClick={closeBookingModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Book Your Session</h2>
            <BookingSystem tutorId={selectedTutorIdForBooking} initialSubject={bookingSubject} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorCourses;