"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/app/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaPlus, FaMinus } from "react-icons/fa";

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

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
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

  const handleBookNow = (courseName: string, lessonName: string, price?: number) => {
    alert(
      `Book Now clicked for: ${courseName} - ${lessonName} (Price: ₱${
        price?.toFixed(2) || "Free"
      })`
    );
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
                      className="text-gray-700 mb-2 flex items-center justify-between rounded-md bg-gray-50 py-2 px-3"
                    >
                      <span className="flex-grow">{lesson.name}</span>
                      <div className="flex items-center justify-center space-x-4">
                        {lesson.price && lesson.price > 0 && (
                          <span className="text-sm text-gray-600 mr-120">
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
                                  lesson.price
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
              <div className="flex justify-between items-center mb-2">
                <label className="block font-semibold text-sm text-gray-800">
                  Course Name
                </label>
                {courses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCourse(courseIndex)}
                    className="text-red-500 text-xs hover:underline focus:outline-none"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                maxLength={25}
                value={course.name}
                onChange={(e) => handleCourseChange(courseIndex, e.target.value)}
                className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter course name"
                required
              />

              <div className="mt-3 space-y-2">
                <label className="block font-medium text-sm text-gray-800">
                  Lessons
                </label>
                {course.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="flex items-center space-x-3">
                    <input
                      type="text"
                      maxLength={35}
                      value={lesson.name}
                      onChange={(e) =>
                        handleLessonChange(
                          courseIndex,
                          lessonIndex,
                          e.target.value
                        )
                      }
                      className="w-1/2 border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder={`Lesson ${lessonIndex + 1}`}
                      required
                    />
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor={`price-${courseIndex}-${lessonIndex}`}
                        className="text-sm text-gray-700"
                      >
                        Price (₱):
                      </label>
                      <input
                        id={`price-${courseIndex}-${lessonIndex}`}
                        type="number"
                        value={
                          lesson.price !== undefined
                            ? lesson.price.toString()
                            : ""
                        }
                        onChange={(e) =>
                          handleLessonPriceChange(
                            courseIndex,
                            lessonIndex,
                            e.target.value
                          )
                        }
                        className="w-24 border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    {course.lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(courseIndex, lessonIndex)}
                        className="text-red-500 text-xs hover:underline focus:outline-none"
                        title="Remove Lesson"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLesson(courseIndex)}
                  className="text-blue-600 text-sm hover:underline focus:outline-none flex items-center space-x-1"
                >
                  <FaPlus /> <span>Add Lesson</span>
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCourse}
            className="text-green-600 text-sm hover:underline focus:outline-none flex items-center space-x-1"
          >
            <FaPlus /> <span>Add Course</span>
          </button>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              Save Courses
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TutorCourses;