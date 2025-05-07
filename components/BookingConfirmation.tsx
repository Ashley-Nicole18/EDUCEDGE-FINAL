'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookingDetails,
  Session,
  fetchSessions as fetchSessionsReal,
} from '../lib/api';
import { mockAPI } from '../lib/mockApi';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/firebase/config';

interface BookingConfirmationProps {
  bookingDetails: BookingDetails;
  onNewBooking: () => void;
  sessions?: Session[];
  useMock?: boolean;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingDetails,
  onNewBooking,
  sessions: initialSessions,
  useMock = false,
}) => {
  const router = useRouter();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(initialSessions || []);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const fetchSessions = useMock ? mockAPI.fetchSessions : fetchSessionsReal;

  // Get the currently signed-in user's email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUserEmail(user?.email ?? null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch sessions once user email is known
  useEffect(() => {
    const loadSessions = async (): Promise<void> => {
      if (!initialSessions && bookingDetails.tutorId && userEmail) {
        setIsLoadingSessions(true);
        try {
          const fetchedSessions = await fetchSessions(bookingDetails.tutorId, userEmail);
          setSessions(fetchedSessions);
        } catch (error) {
          console.error('Failed to fetch sessions:', error);
        } finally {
          setIsLoadingSessions(false);
        }
      }
    };

    loadSessions();
  }, [bookingDetails.tutorId, userEmail, initialSessions, fetchSessions]);

  // Add current booking as session if not already included
  useEffect(() => {
    if (bookingDetails && bookingDetails.reference) {
      const sessionExists = sessions.some(
        (session) => session.reference === bookingDetails.reference
      );

      if (!sessionExists) {
        const newSession: Session = {
          id: `new-${bookingDetails.reference}`,
          tutorId: bookingDetails.tutorId,
          date: bookingDetails.date,
          time: bookingDetails.timeSlot,
          subject: bookingDetails.subject,
          isDone: false,
          reference: bookingDetails.reference,
          status: 'upcoming',
          studentName: `${bookingDetails.firstName} ${bookingDetails.lastName}`,
        };
        setSessions((prev) => [newSession, ...prev]);
      }
    }
  }, [bookingDetails, sessions]);

  const handleSendEmail = async (): Promise<void> => {
    try {
      setIsSendingEmail(true);

      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setEmailSent(true);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDashboard = (): void => {
    router.push('/dashboard');
  };

  const handleViewSessions = (): void => {
    router.push('/sessions');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Your session has been successfully booked.</p>
      </div>

      {/* Booking Details */}
      <div className="bg-gray-50 p-6 rounded-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Booking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Reference</p>
            <p className="font-medium text-gray-800">{bookingDetails.reference}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-800">{formatDate(bookingDetails.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium text-gray-800">{bookingDetails.timeSlot}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-medium text-gray-800">{bookingDetails.subject}</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 p-6 rounded-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-800">{bookingDetails.firstName} {bookingDetails.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{bookingDetails.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-800">{bookingDetails.phone}</p>
          </div>
        </div>
        {bookingDetails.message && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Message</p>
            <p className="italic text-gray-800">{bookingDetails.message}</p>
          </div>
        )}
      </div>

      {/* Sessions */}
      {sessions && sessions.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-blue-100 pb-2">
            Your Upcoming Sessions
          </h3>

          {isLoadingSessions ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions
                .filter((session) => !session.isDone)
                .slice(0, 2)
                .map((session) => (
                  <div key={session.id} className="flex justify-between items-center p-2 border-b border-blue-100">
                    <div>
                      <p className="font-medium">{formatDate(session.date)}, {session.time}</p>
                      <p className="text-sm text-gray-600">{session.subject}</p>
                    </div>
                  </div>
                ))}
              {sessions.filter((session) => !session.isDone).length > 2 && (
                <div className="text-center pt-2">
                  <button
                    onClick={handleViewSessions}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all {sessions.filter((s) => !s.isDone).length} upcoming sessions
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        {!emailSent ? (
          <button
            onClick={handleSendEmail}
            disabled={isSendingEmail}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-70"
          >
            {isSendingEmail ? 'Sending...' : 'Send Confirmation Email'}
          </button>
        ) : (
          <button
            disabled
            className="bg-green-600 text-white font-medium py-2 px-6 rounded-md"
          >
            Email Sent ✓
          </button>
        )}

        <button
          onClick={onNewBooking}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md"
        >
          Book Another Session
        </button>

        <button
          onClick={handleDashboard}
          className="border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2 px-6 rounded-md"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
