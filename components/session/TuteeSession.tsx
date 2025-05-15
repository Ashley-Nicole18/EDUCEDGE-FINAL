'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { auth, db } from '@/app/firebase/config';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface FirestoreBooking {
  id: string;
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
  status?: 'upcoming' | 'completed' | 'cancelled';
  createdAt: any;
}

interface SessionDisplay {
  id: string;
  date: string;
  time: string;
  tutorName: string;
  subject: string;
  status?: 'upcoming' | 'completed' | 'cancelled';
}

const TuteeSessions = () => {
  const [upcomingSessions, setUpcomingSessions] = useState<SessionDisplay[]>([]);
  const [pastSessions, setPastSessions] = useState<SessionDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = auth.currentUser;
  const router = useRouter();

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
        const upcoming: SessionDisplay[] = [];
        const past: SessionDisplay[] = [];

        for (const docSnapshot of querySnapshot.docs) {
          const bookingData = docSnapshot.data() as FirestoreBooking;
          const tutorDocRef = doc(db, 'users', bookingData.tutorId || '');
          const tutorDocSnap = await getDoc(tutorDocRef);
          const tutorData = tutorDocSnap.data();
          const tutorName = tutorData?.firstName ? `${tutorData.firstName} ${tutorData.lastName || ''}` : 'Tutor Info Unavailable';

          const sessionDisplay: SessionDisplay = {
            id: docSnapshot.id,
            date: bookingData.date || '',
            time: bookingData.timeSlot || '',
            tutorName: tutorName,
            subject: bookingData.subject,
            status: bookingData.status || 'upcoming', // Default to upcoming if no status
          };

          if (sessionDisplay.status === 'completed' || sessionDisplay.status === 'cancelled') {
            past.push(sessionDisplay);
          } else {
            upcoming.push(sessionDisplay);
          }
        }
        setUpcomingSessions(upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setPastSessions(past.sort((a, b) => new Date(b.date).getTime() - new Date(b.date).getTime()));
      } catch (err: any) {
        console.error('Failed to load sessions:', err);
        setError('Failed to load sessions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [currentUser?.uid]);

  const handleCancelSession = async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) {
      return;
    }
    try {
      const bookingDocRef = doc(db, 'bookings', sessionId);
      await updateDoc(bookingDocRef, { status: 'cancelled' });
      setUpcomingSessions(upcomingSessions.filter(session => session.id !== sessionId));
    } catch (error: any) {
      console.error('Error cancelling session:', error);
      setError('Failed to cancel session.');
    }
  };

  const handleMarkAsDone = async (sessionId: string) => {
    try {
      const bookingDocRef = doc(db, 'bookings', sessionId);
      await updateDoc(bookingDocRef, { status: 'completed' });
      const completedSession = upcomingSessions.find(session => session.id === sessionId);
      if (completedSession) {
        setUpcomingSessions(upcomingSessions.filter(session => session.id !== sessionId));
        router.push(`/review/${sessionId}`);
      }
    } catch (error: any) {
      console.error('Error marking session as done:', error);
      setError('Failed to mark session as done.');
    }
  };

  if (loading) {
    return <div className="p-8">Loading sessions...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>;
  }

  return (
    <div className="space-y-10 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Upcoming Sessions</h2>
        {upcomingSessions.length === 0 ? (
          <p className="text-gray-600">No upcoming sessions.</p>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map(session => (
              <div key={session.id} className="bg-white rounded-md shadow-md p-5 border">
                <p className="font-semibold text-gray-800">{session.subject} with {session.tutorName}</p>
                <p className="text-gray-600 text-sm">
                  <FiCalendar className="inline-block mr-1" /> {new Date(session.date).toLocaleDateString()} at {session.time}
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => handleCancelSession(session.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm flex items-center gap-1 hover:bg-red-600 transition"
                  >
                    <FiXCircle /> Cancel
                  </button>
                  <button
                    onClick={() => handleMarkAsDone(session.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm flex items-center gap-1 hover:bg-green-600 transition"
                  >
                    <FiCheckCircle /> Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-t border-gray-300 my-8" /> {/* Separator line */}

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Past Sessions</h2>
        {pastSessions.length === 0 ? (
          <p className="text-gray-600">No past sessions.</p>
        ) : (
          <div className="space-y-4">
            {pastSessions.map(session => (
              <div key={session.id} className="bg-gray-100 rounded-md shadow-sm p-5 border">
                <p className="font-semibold text-gray-800">{session.subject} with {session.tutorName}</p>
                <p className="text-gray-600 text-sm">
                  <FiCalendar className="inline-block mr-1" /> {new Date(session.date).toLocaleDateString()} at {session.time}
                </p>
                <div className="mt-2">
                  {session.status === 'cancelled' && (
                    <span className="text-red-500 text-sm italic">Cancelled</span>
                  )}
                  {session.status === 'completed' && (
                    <span className="text-green-500 text-sm italic">Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TuteeSessions;