"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface Lesson {
  name: string;
}

interface Course {
  name: string;
  lessons: Lesson[];
}

const CourseForm: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { name: "", lessons: [{ name: "" }] },
  ]);
  const [userId] = useState("user123");

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "user_courses", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCourses(docSnap.data().courses);
      }
    };
    fetchData();
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

  const addCourse = () => {
    setCourses([...courses, { name: "", lessons: [{ name: "" }] }]);
  };

  const removeCourse = (index: number) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
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
    try {
      const docRef = doc(db, "user_courses", userId);
      await setDoc(docRef, { courses });
      alert("Courses saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving data.");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6 text-black">Courses & Lessons</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {courses.map((course, courseIndex) => (
          <div key={courseIndex} className="border-b pb-6 mb-6">
            <div className="mb-4 flex justify-between items-center">
              <label className="block font-semibold text-sm text-black">
                Course Name
              </label>
              {courses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCourse(courseIndex)}
                  className="text-red-500 text-xs"
                >
                  Remove Course
                </button>
              )}
            </div>
            <input
              type="text"
              value={course.name}
              onChange={(e) =>
                handleCourseChange(courseIndex, e.target.value)
              }
              className="w-full border-2 px-3 py-2 rounded text-gray-700 mb-3"
              placeholder="Enter course name"
              required
            />

            <div className="space-y-3">
              <label className="block font-medium text-sm text-black">
                Lessons
              </label>
              {course.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={lesson.name}
                    onChange={(e) =>
                      handleLessonChange(courseIndex, lessonIndex, e.target.value)
                    }
                    className="w-full border-2 px-3 py-2 rounded text-gray-700"
                    placeholder={`Lesson ${lessonIndex + 1}`}
                    required
                  />
                  {course.lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeLesson(courseIndex, lessonIndex)
                      }
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addLesson(courseIndex)}
                className="text-blue-600 text-sm mt-2"
              >
                + Add another lesson
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCourse}
          className="text-green-600 text-sm"
        >
          + Add another course
        </button>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;


