// app/sessions/page.tsx
'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { auth, db } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import TuteeSessions from '@/components/session/TuteeSession';
import TutorSessions from '@/components/session/TutorSession';
import Sidebar from '@/components/Sidebar';

interface UserProfile {
  role?: 'tutee' | 'tutor';
}

const SessionsPageContent = () => {
  const [userRole, setUserRole] = useState<'tutee' | 'tutor' | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser?.uid) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data() as UserProfile;
            setUserRole(userData.role || null);
          } else {
            setUserRole(null);
            console.log('No user profile found');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        } finally {
          setLoadingRole(false);
        }
      } else {
        setUserRole(null);
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, [currentUser?.uid]);

  if (loadingRole) {
    return <div>Loading...</div>;
  }

  if (userRole === 'tutee') {
    return <TuteeSessions />;
  }

  if (userRole === 'tutor') {
    return <TutorSessions />;
  }

  return <div>You are not authorized to view this page.</div>;
};

const SessionsPage = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-7 overflow-y-auto ml-48"> {/* Added ml-48 to account for sidebar width */}
        <SessionsPageContent />
      </main>
    </div>
  );
};

export default SessionsPage;