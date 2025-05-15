'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { auth, db } from '@/app/firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface FirestoreBooking {
  id: string; // Firestore document ID
  tutorId: string | null;
  studentId: string | null;
  date: string | null;
  timeSlot: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: any; // Firestore Timestamp
}

interface SessionDisplay {
  id: string;
  date: string;
  time: string;
  studentName: string; // In this context, it's the tutor's info if we fetch from student view
  subject: string;
}

interface SessionsListProps {}

const SessionsList: React.FC<SessionsListProps> = () => {
  const [sessions, setSessions] = useState<SessionDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const loadSessions = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('studentId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedSessions: SessionDisplay[] = [];
        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data() as Omit<FirestoreBooking, 'id'>;
          // We need to fetch the tutor's name based on tutorId
          const tutorDocRef = doc(db, 'users', data.tutorId || '');
          const tutorDocSnap = await getDoc(tutorDocRef);
          const tutorData = tutorDocSnap.data();
          const tutorName = tutorData?.firstName ? `${tutorData.firstName} ${tutorData.lastName || ''}` : 'Tutor Info Unavailable';

          fetchedSessions.push({
            id: docSnapshot.id,
            date: data.date || '',
            time: data.timeSlot || '',
            studentName: tutorName, // Displaying tutor's name for the student
            subject: data.subject,
          });
        }
        setSessions(fetchedSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (err: any) {
        console.error('Failed to load sessions:', err);
        setError('Failed to load sessions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [currentUser?.uid]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reload Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
        <div className="text-sm text-gray-500">
          {sessions.length} booking{sessions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings yet</h3>
          <p className="mt-1 text-gray-500">You haven't booked any sessions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <div
              key={session.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiUser className="text-gray-400" />
                  <p className="font-medium text-lg text-gray-800">{session.studentName}</p> {/* Tutor's Name */}
                </div>
                <p className="text-gray-800 font-semibold">{session.subject}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FiCalendar />
                    <span>
                      {new Date(session.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {session.time && (
                    <div className="flex items-center gap-1">
                      <span>Time: {session.time}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsList;