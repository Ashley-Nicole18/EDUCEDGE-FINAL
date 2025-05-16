'use client';

import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek,
  isToday,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

interface CalendarProps {
  availableDates: string[];
  onSelectDate: (date: string) => void;
  selectedDate: string | null;
}

export const Calendar: React.FC<CalendarProps> = ({ availableDates = [], onSelectDate, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  
  // Generate calendar days when month changes
  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    setCalendarDays(days);
  }, [currentMonth]);

  // Check if a date is available for booking
  const isDateAvailable = (date: Date): boolean => {
    return availableDates.some(availableDate => 
      isSameDay(new Date(availableDate), date)
    );
  };

  // Navigate to previous month
  const prevMonth = (): void => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = (): void => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Previous month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Next month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isAvailable = isDateAvailable(day);
            const isSelected = selectedDate && isSameDay(new Date(selectedDate), day);
            const dayInCurrentMonth = isSameMonth(day, currentMonth);
            
            return (
              <div 
                key={day.toString()}
                className={`
                  relative aspect-square p-1 flex items-center justify-center rounded-md
                  ${dayInCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isToday(day) ? 'border border-blue-400' : ''}
                  ${isSelected ? 'bg-blue-600 text-white' : isAvailable && dayInCurrentMonth ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' : 'hover:bg-gray-50'}
                  ${!isAvailable || !dayInCurrentMonth ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => {
                  if (isAvailable && dayInCurrentMonth) {
                    onSelectDate(day.toISOString());
                  }
                }}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                {isAvailable && dayInCurrentMonth && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 px-4 py-3 border-t text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-500 mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-white border border-blue-400 mr-2"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};