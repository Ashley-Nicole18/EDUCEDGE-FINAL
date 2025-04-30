'use client';

import { useState } from 'react';

interface TimeSlotPickerProps {
  availableSlots: string[];
  onSelectTimeSlot: (slot: string) => void;
  selectedTimeSlot: string | null;
}

type TimeFilter = 'all' | 'morning' | 'afternoon' | 'evening';

interface GroupedSlots {
  morning: string[];
  afternoon: string[];
  evening: string[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  availableSlots, 
  onSelectTimeSlot, 
  selectedTimeSlot 
}) => {
  const [filter, setFilter] = useState<TimeFilter>('all');

  // Group time slots by period
  const groupedSlots: GroupedSlots = {
    morning: availableSlots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 6 && hour < 12;
    }),
    afternoon: availableSlots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 12 && hour < 17;
    }),
    evening: availableSlots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 17 && hour < 24;
    })
  };

  // Filter slots based on selected filter
  const filteredSlots = filter === 'all' 
    ? availableSlots 
    : groupedSlots[filter];

  // Format time slot for display
  const formatTimeSlot = (slot: string): string => {
    const [hours, minutes] = slot.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Handle no available slots
  if (availableSlots.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Available Time Slots</h3>
        <p className="mt-1 text-sm text-gray-500">There are no available time slots for the selected date. Please select a different date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Time period filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'morning', 'afternoon', 'evening'] as TimeFilter[]).map((period) => (
          <button
            key={period}
            className={`px-4 py-2 text-sm rounded-full ${
              filter === period 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
            {period !== 'all' && (
              <span className="ml-1 text-xs">
                ({groupedSlots[period].length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Time slots grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {filteredSlots.map((slot) => (
          <button
            key={slot}
            className={`p-3 text-center border rounded-md transition-colors ${
              selectedTimeSlot === slot
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
            }`}
            onClick={() => onSelectTimeSlot(slot)}
          >
            {formatTimeSlot(slot)}
          </button>
        ))}
      </div>

      {/* Show message when no slots match the filter */}
      {filteredSlots.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No {filter} time slots available. Try another time period.
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;