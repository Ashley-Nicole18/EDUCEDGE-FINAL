'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '@/app/firebase/config';
import ProfileHeader from '@/components/profile-component/ProfileTutor';
import ProfileTutee from '@/components/profile-component/ProfileTutee';

interface FirestoreUser {
  name?: string;
  role?: 'tutor' | 'tutee';
}

export default function ProfilePage() {
  const { id } = useParams() as { id: string };

  const [profileUser, setProfileUser] = useState<FirestoreUser | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initialize as true

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });

    const fetchUser = async () => {
      try {
        const docRef = doc(db, 'users', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as FirestoreUser;
          setProfileUser(data);
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set to false when fetching is complete (success or error)
      }
    };

    if (id) fetchUser();
    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        User not found
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center overflow-auto min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white shadow-md p-6 rounded-lg">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <Image
            src={authUser?.photoURL || '/default-avatar.png'}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full object-cover border"
          />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800">{profileUser?.name}</h2>
            {authUser?.email && <p className="text-sm text-gray-500">{authUser.email}</p>}
          </div>
        </div>

        {/* Role-Based Section */}
        {profileUser?.role === 'tutor' ? (
          <ProfileHeader userId={id} />
        ) : profileUser?.role === 'tutee' ? (
          <ProfileTutee />
        ) : (
          <div className="text-center text-xl text-gray-700">
            No valid role found
          </div>
        )}
      </div>
    </div>
  );
}
