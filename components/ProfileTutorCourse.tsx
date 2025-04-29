'use client';
import { useState } from 'react';

interface Lesson {
  name: string;
}

interface Course {
  name: string;
  lessons: Lesson[];
}

const CourseForm: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { name: '', lessons: [{ name: '' }] },
  ]);

  const handleCourseChange = (index: number, value: string) => {
    const newCourses = [...courses];
    newCourses[index].name = value;
    setCourses(newCourses);
  };

  const handleLessonChange = (courseIndex: number, lessonIndex: number, value: string) => {
    const newCourses = [...courses];
    newCourses[courseIndex].lessons[lessonIndex].name = value;
    setCourses(newCourses);
  };

  const addLesson = (courseIndex: number) => {
    const newCourses = [...courses];
    newCourses[courseIndex].lessons.push({ name: '' });
    setCourses(newCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { name: '', lessons: [{ name: '' }] }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted data:', courses);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6 text-black">Courses & Lesson</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {courses.map((course, courseIndex) => (
          <div key={courseIndex} className="border-b pb-6 mb-6">
            <div className="mb-4">
              <label className="block font-semibold text-sm text-black">Course Name</label>
              <input
                type="text"
                value={course.name}
                onChange={(e) => handleCourseChange(courseIndex, e.target.value)}
                className="w-full border-2 px-3 py-2 rounded text-gray-700"
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block font-medium text-sm text-black">Lessons</label>
              {course.lessons.map((lesson, lessonIndex) => (
                <input
                  key={lessonIndex}
                  type="text"
                  value={lesson.name}
                  onChange={(e) =>
                    handleLessonChange(courseIndex, lessonIndex, e.target.value)
                  }
                  className="w-full border-2 px-3 py-2 rounded text-gray-700"
                  placeholder={`Lesson ${lessonIndex + 1}`}
                  required
                />
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
