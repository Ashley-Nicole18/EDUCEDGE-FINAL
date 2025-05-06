"use client";

// import BookingSystem from '@/components/Booking';
import Sidebar from '@/components/Sidebar';

export default function BookingPage() {
  return (
    <div className="flex min-h-screen ">
      <div className="flex-grow p-8 flex justify-center overflow-auto">
        <div className="w-full max-w-5xl">
          {/* <BookingSystem tutorId="12345" /> */}
        </div>
      </div>

      <div className="w-1/16 bg-gray-100">
        <Sidebar />
      </div>
    </div>
  );
}
