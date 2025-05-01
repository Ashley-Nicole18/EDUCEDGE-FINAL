'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingDetails {
  reference: string;
  date: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message?: string;
  tutorId: string;
}

interface BookingConfirmationProps {
  bookingDetails: BookingDetails;
  onNewBooking: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ bookingDetails, onNewBooking }) => {
  const router = useRouter();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      // Implement email sending logic here
      // For example: await fetch('/api/send-confirmation-email', { method: 'POST', body: JSON.stringify(bookingDetails) });
      
      setEmailSent(true);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Your session has been successfully booked.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-md mb-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Booking Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Reference</p>
            <p className="font-medium">{bookingDetails.reference}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{bookingDetails.date}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{bookingDetails.timeSlot}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-medium">{bookingDetails.subject}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-md mb-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{bookingDetails.firstName} {bookingDetails.lastName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{bookingDetails.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{bookingDetails.phone}</p>
          </div>
        </div>
        
        {bookingDetails.message && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Message</p>
            <p className="italic">{bookingDetails.message}</p>
          </div>
        )}
      </div>
      
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