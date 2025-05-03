'use client';

import React from 'react';
import TutorProfileDisplay from '@/components/profile/ProfileTutorReviewDisplay'; 
import Sidebar from '@/components/Sidebar'; 

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
