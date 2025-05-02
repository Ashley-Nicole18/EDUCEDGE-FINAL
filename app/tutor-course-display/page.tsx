// app/tutor-profile/page.tsx
'use client';

import React from 'react';
import TutorProfileDisplay from '@/components/TutorProfileDisplay'; // Adjust the import path as needed
import Sidebar from '@/components/Sidebar'; // Your Sidebar component

const TutorProfilePage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <TutorProfileDisplay />
      </main>
    </div>
  );
};

export default TutorProfilePage;
