'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { db, auth } from '@/app/firebase/config';
import ProfileHeader from '@/components/profile-component/ProfileHeader';
import ProfileTutee from '@/components/profile-component/ProfileTutee';

interface FirestoreUser {
  name?: string;
  role?: 'tutor' | 'tutee';
}

export default function ProfilePage() {
  const { id } = useParams() as { id: string };

  const [profileUser, setProfileUser] = useState<FirestoreUser | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

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
          setNewName(data.name || '');
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
    return () => unsubscribe();
  }, [id]);

  const isOwnProfile = authUser?.uid === id;

  const handleSave = async () => {
    if (!authUser || !newName.trim()) return;

    try {
      // Update Auth
      await updateProfile(authUser, { displayName: newName });

      // Update Firestore
      await updateDoc(doc(db, 'users', authUser.uid), { name: newName });

      setProfileUser((prev) => (prev ? { ...prev, name: newName } : null));
      setEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
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
          <img
            src={authUser?.photoURL || '/default-avatar.png'}
            alt="Profile Picture"
            className="w-20 h-20 rounded-full object-cover border"
          />

          {isOwnProfile ? (
            editing ? (
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label htmlFor="name-input" className="sr-only">
                    Edit Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border px-3 py-1 rounded"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNewName(profileUser.name || '');
                  }}
                  className="text-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{profileUser.name}</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            )
          ) : (
            <h2 className="text-2xl font-semibold">{profileUser.name}</h2>
          )}
        </div>

        {/* Role-Based Section */}
        {profileUser.role === 'tutor' ? (
          <ProfileHeader userId={id} />
        ) : profileUser.role === 'tutee' ? (
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
