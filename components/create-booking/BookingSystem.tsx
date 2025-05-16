'use client';

import { useState, useEffect } from "react";
import { Calendar } from "./CalendarForBooking";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingForm from "./BookingForm";
import BookingConfirmation from "./BookingConfirmation";
import { mockAPI } from "../../lib/api";
import { auth, db } from "@/app/firebase/config"; // Import Firebase auth and db
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

// TypeScript interface for the mockAPI
interface MockAPI {
  fetchAvailableDates: (tutorId: string) => Promise<string[]>;
  fetchAvailableSlots: (tutorId: string, date: string) => Promise<string[]>;
  createBooking: (bookingData: any) => Promise<any>;
}

// Cast mockAPI to the correct type
const typedMockAPI = mockAPI as unknown as MockAPI;

const fetchAvailableDates = typedMockAPI.fetchAvailableDates;
const fetchAvailableSlots = typedMockAPI.fetchAvailableSlots;
// const createBooking = typedMockAPI.createBooking; // We'll handle this with Firestore

interface BookingSystemProps {
  tutorId: string | null; // Make tutorId potentially null
  initialSubject?: string | null; // Optional initial subject
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface BookingDetails extends FormData {
  tutorId: string | null;
  date: string | null;
  timeSlot: string | null;
  studentId: string | null; // Add studentId
  createdAt: any;
  // reference: string; // We'll use Firestore document ID
}

const BookingSystem: React.FC<BookingSystemProps> = ({ tutorId, initialSubject }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [currentUserData, setCurrentUserData] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCurrentUserData({
              firstName: data?.firstName || "",
              lastName: data?.lastName || "",
              email: data?.email || "",
            });
          }
        } catch (error: any) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, []);

  // Fetch available dates when component mounts or tutorId changes
  useEffect(() => {
    const loadAvailableDates = async (): Promise<void> => {
      if (!tutorId) return;
      try {
        setIsLoading(true);
        console.log(`Fetching available dates for tutor ${tutorId}`);
        const dates = await fetchAvailableDates(tutorId);
        console.log("Fetched dates:", dates);

        if (Array.isArray(dates) && dates.length > 0) {
          setAvailableDates(dates);
        } else {
          setAvailableDates([]);
          console.warn("No available dates returned from API");
        }
      } catch (err) {
        console.error("Error fetching available dates:", err);
        setError("Failed to load available dates");

        // Provide fallback dates for development/testing
        if (process.env.NODE_ENV === "development") {
          const today = new Date();
          const nextWeek: string[] = Array(7)
            .fill(null)
            .map((_, i) => {
              const date = new Date();
              date.setDate(today.getDate() + i + 1);
              return date.toISOString().split("T")[0];
            });
          setAvailableDates(nextWeek);
          setError(null); // Clear error in development mode and use fallback data
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (tutorId) {
      loadAvailableDates();
    }
  }, [tutorId]);

  // Load available time slots when a date is selected
  useEffect(() => {
    const loadTimeSlots = async (): Promise<void> => {
      if (!tutorId || !selectedDate) return;

      try {
        setIsLoading(true);
        // Format the date to ISO string format (YYYY-MM-DD)
        const formattedDate: string = new Date(selectedDate)
          .toISOString()
          .split("T")[0];
        console.log(
          `Fetching time slots for tutor ${tutorId} on date ${formattedDate}`
        );

        const slots = await fetchAvailableSlots(tutorId, formattedDate);
        console.log("Fetched slots:", slots);

        if (Array.isArray(slots) && slots.length > 0) {
          setAvailableSlots(slots);
        } else {
          // If no slots are returned, set a default message or handle empty state
          setAvailableSlots([]);
          console.warn("No available time slots returned from API");
        }
      } catch (err) {
        console.error("Error fetching time slots:", err);
        setError("Failed to load available time slots");

        // Provide fallback slots for development/testing
        if (process.env.NODE_ENV === "development") {
          setAvailableSlots([
            "09:00 AM",
            "10:00 AM",
            "11:00 AM",
            "01:00 PM",
            "02:00 PM",
          ]);
          setError(null); // Clear error in development mode and use fallback data
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedDate) {
      loadTimeSlots();
    }
  }, [tutorId, selectedDate]);

  const handleDateSelect = (date: string): void => {
    setSelectedDate(date);
    setStep(2);
    setError(null); // Clear any previous errors when selecting a new date
  };

  const handleTimeSlotSelect = (slot: string): void => {
    setSelectedTimeSlot(slot);
    setStep(3);
  };

  const handleFormSubmit = async (formData: FormData): Promise<void> => {
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (!user || !tutorId || !selectedDate || !selectedTimeSlot) {
        console.error("Missing user, tutor ID, date, or time slot");
        setError("Could not submit booking. Missing information.");
        return;
      }

      const bookingData = {
        tutorId: tutorId,
        studentId: user.uid,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        ...formData,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      console.log("Booking created with ID: ", docRef.id);
      setBookingDetails({ ...bookingData, studentId: user.uid, createdAt: serverTimestamp() } as BookingDetails); // Adjust type as needed
      setStep(4);
    } catch (err: any) {
      setError("Failed to create booking: " + err.message);
      console.error("Error creating booking:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetBooking = (): void => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setBookingDetails(null);
    setStep(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p>{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  s === step
                    ? "bg-blue-600 text-white"
                    : s < step
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              <span className="text-xs mt-1 text-gray-500">
                {s === 1
                  ? "Select Date"
                  : s === 2
                  ? "Choose Time"
                  : s === 3
                  ? "Details"
                  : "Confirmation"}
              </span>
            </div>
          ))}

          <div className="absolute left-0 right-0 h-1 bg-gray-200 -z-10">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Select a Date</h2>
          <Calendar
            availableDates={availableDates}
            onSelectDate={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Choose a Time</h2>
            <button onClick={() => setStep(1)} className="text-blue-600 hover:text-blue-800">
              Back to calendar
            </button>
          </div>
          {availableSlots.length > 0 ? (
            <TimeSlotPicker
              availableSlots={availableSlots}
              onSelectTimeSlot={handleTimeSlotSelect}
              selectedTimeSlot={selectedTimeSlot}
            />
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
              <p>No time slots available for the selected date. Please select another date.</p>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Complete Your Booking</h2>
            <button onClick={() => setStep(2)} className="text-blue-600 hover:text-blue-800">
              Back to time selection
            </button>
          </div>
          <div className="bg-blue-50 text-black p-4 rounded-md">
            <p className="font-medium">Selected Date: {selectedDate && new Date(selectedDate).toLocaleDateString()}</p>
            <p className="font-medium">Selected Time: {selectedTimeSlot}</p>
          </div>
          <BookingForm
            onSubmit={handleFormSubmit}
            initialSubject={initialSubject}
            defaultFirstName={currentUserData?.firstName}
            defaultLastName={currentUserData?.lastName}
            defaultEmail={currentUserData?.email}
          />
        </div>
      )}

      {step === 4 && bookingDetails && (
        <BookingConfirmation bookingDetails={bookingDetails} onNewBooking={resetBooking} />
      )}
    </div>
  );
};

export default BookingSystem;