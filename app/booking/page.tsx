"use client";

import BookingSystem from "@/components/booking/Booking";

export default function BookingPage() {
  return (
    <div className="min-h-screen p-6">
      <BookingSystem tutorId="12345" />
    </div>
  );
}
