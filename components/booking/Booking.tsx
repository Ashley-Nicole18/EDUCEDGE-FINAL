"use client";

import { useState, useEffect } from "react";
import { Calendar } from "../CalendarForBooking";
import TimeSlotPicker from "../TimeSlotPicker";
import BookingForm from "../BookingForm";
import BookingConfirmation from "../BookingConfirmation";
import { mockAPI } from "../../lib/api";
import SessionsList from "../SessionList";
import React from "react";

// TypeScript interface for the mockAPI
interface MockAPI {
  fetchAvailableDates: (tutorId: string) => Promise<string[]>;
  fetchAvailableSlots: (tutorId: string, date: string) => Promise<string[]>;
  createBooking: (bookingData: any) => Promise<any>;
  fetchSessions: (tutorId: string) => Promise<any[]>;
  markSessionAsDone: (sessionId: string) => Promise<void>;
  cancelSession: (sessionId: string) => Promise<void>;
}

// Cast mockAPI to the correct type
const typedMockAPI = mockAPI as unknown as MockAPI;

const fetchAvailableDates = typedMockAPI.fetchAvailableDates;
const fetchAvailableSlots = typedMockAPI.fetchAvailableSlots;
const createBooking = typedMockAPI.createBooking;

interface BookingSystemProps {
  tutorId: string;
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
  tutorId: string;
  date: string;
  timeSlot: string;
  reference: string;
}

const BookingSystem: React.FC<BookingSystemProps> = ({ tutorId }) => {
  const [activeTab, setActiveTab] = useState<'booking' | 'sessions'>('booking');
  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);


  useEffect(() => {
    const loadAvailableDates = async (): Promise<void> => {
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
        setError("Failed to load available dates");
        console.error(err);
        console.error("Error fetching available dates:", err);
        setError('Failed to load available dates');
        
        // Provide fallback dates for development/testing
        if (process.env.NODE_ENV === 'development') {
          const today = new Date();
          const nextWeek: string[] = Array(7).fill(null).map((_, i) => {
            const date = new Date();
            date.setDate(today.getDate() + i + 1);
            return date.toISOString().split('T')[0];
          });
          setAvailableDates(nextWeek);
          setError(null); // Clear error in development mode and use fallback data
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (tutorId && activeTab === 'booking') {
      loadAvailableDates();
    }
  }, [tutorId, activeTab]);

  useEffect(() => {
    const loadTimeSlots = async (): Promise<void> => {
      if (!selectedDate) return;

      try {
        setIsLoading(true);
        // Format the date to ISO string format (YYYY-MM-DD)
        const formattedDate: string = new Date(selectedDate).toISOString().split('T')[0];
        console.log(`Fetching time slots for tutor ${tutorId} on date ${formattedDate}`);
        
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
        setError("Failed to load available time slots");
        console.error(err);
        console.error("Error fetching time slots:", err);
        setError('Failed to load available time slots');
        
        // Provide fallback slots for development/testing
        if (process.env.NODE_ENV === 'development') {
          setAvailableSlots(["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"]);
          setError(null); // Clear error in development mode and use fallback data
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedDate && activeTab === 'booking') {
      loadTimeSlots();
    }
  }, [tutorId, selectedDate, activeTab]);

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
      const bookingData = {
        tutorId,
        date: selectedDate!,
        timeSlot: selectedTimeSlot!,
        ...formData,
      };

      const response = await createBooking(bookingData);
      setBookingDetails(response);
      setStep(4);
    } catch (err) {
      setError("Failed to create booking");
      console.error(err);
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
    // <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
    //   <div className="mb-8">
    //     <div className="flex items-center justify-between relative">
    //       {[1, 2, 3, 4].map((s) => (
    //         <div key={s} className="flex flex-col items-center">
    //           <div
    //             className={`w-8 h-8 rounded-full flex items-center justify-center ${
    //               s === step
    //                 ? "bg-blue-600 text-white"
    //                 : s < step
    //                 ? "bg-green-500 text-white"
    //                 : "bg-gray-200 text-gray-500"
    //             }`}
    //           >
    //             {s < step ? "✓" : s}
    //           </div>
    //           <span className="text-xs mt-1 text-gray-500">
    //             {s === 1
    //               ? "Select Date"
    //               : s === 2
    //               ? "Choose Time"
    //               : s === 3
    //               ? "Details"
    //               : "Confirmation"}
    //           </span>
    //         </div>
    //       ))}

    //       <div className="absolute left-0 right-0 h-1 bg-gray-200 -z-10">
    //         <div
    //           className="h-full bg-blue-600 transition-all"
    //           style={{ width: `${((step - 1) / 3) * 100}%` }}
    //         ></div>
    //       </div>
    //     </div>
    //   </div>


    //   {step === 1 && (
    //     <div className="space-y-6">
    //       <h2 className="text-xl font-semibold text-gray-800">Select a Date</h2>
    //       <Calendar
    //         availableDates={availableDates}
    //         onSelectDate={handleDateSelect}
    //         selectedDate={selectedDate}
    //       />
    //     </div>
    //   )}

    //   {step === 2 && (
    //     <div className="space-y-6">
    //       <div className="flex justify-between items-center">
    //         <h2 className="text-xl font-semibold text-gray-800">
    //           Choose a Time
    //         </h2>
    //         <button
    //           onClick={() => setStep(1)}
    //           className="text-blue-600 hover:text-blue-800"
    //         >
    //           Back to calendar
    //         </button>
    //       </div>
    //       <TimeSlotPicker
    //         availableSlots={availableSlots}
    //         onSelectTimeSlot={handleTimeSlotSelect}
    //         selectedTimeSlot={selectedTimeSlot}
    //       />
    //     </div>
    //   )}

    //   {step === 3 && (
    //     <div className="space-y-6">
    //       <div className="flex justify-between items-center">
    //         <h2 className="text-xl font-semibold text-gray-800">
    //           Complete Your Booking
    //         </h2>
    //         <button
    //           onClick={() => setStep(2)}
    //           className="text-blue-600 hover:text-blue-800"
    //         >
    //           Back to time selection
    //         </button>
    //       </div>
    //       <div className="bg-blue-50 p-4 rounded-md">
    //         <p className="font-medium">
    //           Selected Date:{" "}
    //           {selectedDate && new Date(selectedDate).toLocaleDateString()}
    //         </p>
    //         <p className="font-medium">Selected Time: {selectedTimeSlot}</p>
    //       </div>
    //       <BookingForm onSubmit={handleFormSubmit} />
    //     </div>
    //   )}

    //   {step === 4 && bookingDetails && (
    //     <BookingConfirmation
    //       bookingDetails={bookingDetails}
    //       onNewBooking={resetBooking}
    //     />
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('booking')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'booking' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Create Booking
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'sessions' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Sessions
        </button>
      </div>

      {activeTab === 'booking' ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      s === step ? 'bg-blue-600 text-white' :
                      s < step ? 'bg-green-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s < step ? '✓' : s}
                  </div>
                  <span className="text-xs mt-1 text-gray-500">
                    {s === 1 ? 'Select Date' : 
                    s === 2 ? 'Choose Time' : 
                    s === 3 ? 'Details' : 'Confirmation'}
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

          {/* Step Content */}
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
                <button 
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-800"
                >
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
                <button 
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Back to time selection
                </button>
              </div>
              <div className="bg-blue-50 text-black p-4 rounded-md">
                <p className="font-medium">Selected Date: {selectedDate && new Date(selectedDate).toLocaleDateString()}</p>
                <p className="font-medium">Selected Time: {selectedTimeSlot}</p>
              </div>
              <BookingForm onSubmit={handleFormSubmit} />
            </div>
          )}

          {step === 4 && bookingDetails && (
            <BookingConfirmation 
              bookingDetails={bookingDetails} 
              onNewBooking={resetBooking}
            />
          )}
        </div>
      ) : (
        <SessionsList tutorId={tutorId} />
      )}
    </div>
  );
};

export default BookingSystem;
