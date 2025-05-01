'use client';
import { useState } from 'react';
import Image from 'next/image';
import ProfileTutorDisplay from '@/components/ProfileTutorInfoDisplay';
import CourseList from '@/components/ProfileTutorCourseDisplay';
import TutorReviews from '@/components/ProfileTutorReviewDisplay';
import { useRouter } from 'next/navigation';

export default function TutorProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'courses' | 'reviews'>('info');
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/img/Background.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />

      {/* Logo */}
      <div className="absolute top-0 left-5 z-20 p-2">
        <Image src="/img/logow.PNG" alt="Logo" width={144} height={50} />
      </div>

      {/* Main Content */}
      <main className="absolute inset-0 z-10 left-40 flex flex-col items-center justify-start p-10 text-white overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl text-black p-8">
          {/* Tabs */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 rounded font-semibold ${
                  activeTab === 'info' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Information
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2 rounded font-semibold ${
                  activeTab === 'courses' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded font-semibold ${
                  activeTab === 'reviews' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Reviews
              </button>
            </div>
            <button
              onClick={() => router.push('/edit-profile')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Edit Profile
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'info' && <ProfileTutorDisplay />}
            {activeTab === 'courses' && <CourseList />}
            {activeTab === 'reviews' && <TutorReviews />}
          </div>
        </div>
      </main>
    </div>
  );
}
