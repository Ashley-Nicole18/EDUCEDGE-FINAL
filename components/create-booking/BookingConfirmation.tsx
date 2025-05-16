'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookingDetails as BookingDetailsType,
} from '../../lib/api';
import { auth, db } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface BookingConfirmationProps {
  bookingDetails: BookingDetailsType & { reference: string };
  onNewBooking: () => void;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingDetails,
  onNewBooking,
}) => {
  const router = useRouter();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Get the currently signed-in user's ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUserId(user?.uid ?? null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile data from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      setIsLoadingProfile(true);
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          console.log("No user profile found!");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleSendEmail = async (): Promise<void> => {
    try {
      setIsSendingEmail(true);
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {isLoadingProfile ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
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
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">
                  {userProfile?.firstName || bookingDetails.firstName} {userProfile?.lastName || bookingDetails.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{userProfile?.email || bookingDetails.email}</p>
              </div>
              {userProfile?.role && (
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-800 capitalize">{userProfile.role}</p>
                </div>
              )}
            </div>
            {bookingDetails.message && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Message</p>
                <p className="italic text-gray-800">{bookingDetails.message}</p>
              </div>
            )}
          </div>

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
        </>
      )}
    </div>
  );
};

export default BookingConfirmation;