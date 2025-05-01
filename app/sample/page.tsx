'use client';
import { useState } from 'react';
import TutorInfo from '@/components/ProfileTutorInfoDisplay';
import CourseList from '@/components/ProfileTutorCourseDisplay';
import TutorReviews from '@/components/ProfileTutorReviewDisplay';

const TABS = ['Information', 'Courses', 'Reviews'];

export default function TutorProfilePage() {
  const [activeTab, setActiveTab] = useState('Information');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row border-b px-6 pt-6">
          <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r mb-4 md:mb-0">
            <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 w-full text-left text-sm font-medium rounded ${
                    activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-3/4 px-6 pb-6">
            {activeTab === 'Information' && <TutorInfo />}
            {activeTab === 'Courses' && <CourseList />}
            {activeTab === 'Reviews' && <TutorReviews />}
          </div>
        </div>
      </div>
    </div>
  );
}
