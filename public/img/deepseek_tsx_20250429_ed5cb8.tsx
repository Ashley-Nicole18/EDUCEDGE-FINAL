'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';

export default function SelectRole() {
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/sign-in');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleRoleSelect = (role: 'student' | 'tutor') => {
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Logo Header */}
      <div className="w-full flex justify-center py-8 z-10">
        <div className="max-w-xs">
          <Image
            src="/img/EDUCEDGE.png"
            alt="EducEdge Logo"
            width={300}
            height={100}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Split Screen Selection */}
      <div className="flex flex-1">
        {/* Tutor Section */}
        <div 
          onClick={() => handleRoleSelect('tutor')}
          className="flex-1 relative flex flex-col items-center justify-center p-8 cursor-pointer overflow-hidden"
        >
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <Image
              src="/img/tutor-bg.jpg" // Replace with your tutor background image
              alt="Tutor Background"
              fill
              className="object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-green-900 opacity-30"></div>
          </div>
          
          {/* Content */}
          <div className="relative max-w-md text-center z-10">
            <div className="mb-8">
              <Image
                src="/img/tt.png"
                alt="Tutor"
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Tutor</h2>
            <p className="text-xl text-green-100 mb-8">
              Share your knowledge and help students succeed in their academic journey.
            </p>
            <button className="px-10 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
              Continue as Tutor
            </button>
          </div>
        </div>

        {/* Student Section */}
        <div 
          onClick={() => handleRoleSelect('student')}
          className="flex-1 relative flex flex-col items-center justify-center p-8 cursor-pointer overflow-hidden"
        >
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <Image
              src="/img/student-bg.jpg" // Replace with your student background image
              alt="Student Background"
              fill
              className="object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
          </div>
          
          {/* Content */}
          <div className="relative max-w-md text-center z-10">
            <div className="mb-8">
              <Image
                src="/img/stud.png"
                alt="Student"
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Student</h2>
            <p className="text-xl text-blue-100 mb-8">
              Find expert tutors to guide you through challenging subjects and concepts.
            </p>
            <button className="px-10 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
              Continue as Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}