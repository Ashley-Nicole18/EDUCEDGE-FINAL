'use client';
import { useEffect , useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Lesson {
    name: string;
    price: number;
}

interface Course {
    name: string;
    lessons: Lesson[];
}

const CourseList: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const userId = 'user123';

    useEffect(() => {
        const fetchCourses = async () => {
            const docRef = doc(db, "user_courses", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setCourses(docSnap.data().courses);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div>
            <h1 className="text-xl font-bold mb-6 text-black">Courses</h1>
            {courses.map((course, i) => (
                <div key={i} className="mb-4 p-4 border rounded shadow-sm">
                    <h2 className="text-lg font-semibold text-blue-600">{course.name}</h2>
                    <ul className="list-disc ml-6 mt-2 space-y-4">
                    {course.lessons.map((lesson, j) => (
                        <li key={j} className="text-gray-700 flex justify-between">
                        <span className="w-1/3">{lesson.name}</span>
                        <span className="w-1/3 text-center text-sm text-gray-500">
                            ₱{lesson.price?.toFixed(2)}
                        </span>
                        <span className="w-1/3 text-right">
    <                   button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            Book Now
                        </button>
                        </span>
                        </li>
            ))}
            </ul>
            </div>
            ))}
        </div>
    );
};

export default CourseList;