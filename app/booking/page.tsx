"use client";

import BookingSystem from "@/components/create-booking/BookingSystem";
import Sidebar from "@/components/Sidebar";

export default function BookingPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the right */}
      <div className="w-1/6">
        <Sidebar />
      </div>

      {/* Main content aligned to top */}
      <div className="flex-grow flex justify-center overflow-auto py-8">
        <div className="w-full max-w-5xl">
          <BookingSystem tutorId="12345" />
        </div>
      </div>
    </div>
  );
}
