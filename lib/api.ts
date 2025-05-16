// Interfaces
export interface Session {
  id: string;
  tutorId: string;
  date: string;
  time: string;
  subject: string;
  isDone: boolean;
  reference?: string;
  status: 'upcoming' | 'done' | 'cancelled';
  studentName: string;
}

export interface BookingRequest {
  tutorId: string;
  date: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message?: string;
}

export interface BookingDetails extends BookingRequest {
  reference: string;
}

// Real API functions

/**
 * Fetch all sessions for a specific tutor, optionally filtered by student email.
 * @param tutorId - The ID of the tutor.
 * @param studentEmail - Optional email address to filter sessions by student.
 * @returns A list of sessions for the tutor.
 */
export async function fetchSessions(tutorId: string, studentEmail?: string): Promise<Session[]> {
  try {
    const queryParams = new URLSearchParams({ tutorId });
    if (studentEmail) {
      queryParams.append('studentEmail', studentEmail);
    }

    const response = await fetch(`/api/sessions?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }

    const sessions: Session[] = await response.json();
    return sessions;
  } catch (error) {
    console.error('Error in fetchSessions:', error);
    throw new Error(`Failed to load sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch available dates for a tutor.
 * @param tutorId - The ID of the tutor.
 * @returns A list of available dates.
 */
export async function fetchAvailableDates(tutorId: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/tutors/${tutorId}/availability`);

    if (!response.ok) {
      throw new Error(`Error fetching available dates: ${response.statusText}`);
    }

    const data = await response.json();
    return data.availableDates;
  } catch (error) {
    console.error('Failed to fetch available dates:', error);
    throw error;
  }
}

/**
 * Fetch available time slots for a given date.
 * @param tutorId - The ID of the tutor.
 * @param date - The selected date.
 * @returns A list of available time slots.
 */
export async function fetchAvailableSlots(tutorId: string, date: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/tutors/${tutorId}/slots?date=${encodeURIComponent(date)}`);

    if (!response.ok) {
      throw new Error(`Error fetching available slots: ${response.statusText}`);
    }

    const data = await response.json();
    return data.availableSlots;
  } catch (error) {
    console.error('Failed to fetch available time slots:', error);
    throw error;
  }
}

/**
 * Create a booking for a tutor session.
 * @param bookingRequest - The details of the booking request.
 * @returns The booking details after creation.
 */
export async function createBooking(bookingRequest: BookingRequest): Promise<BookingDetails> {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingRequest),
    });

    if (!response.ok) {
      throw new Error(`Error creating booking: ${response.statusText}`);
    }

    const data = await response.json();
    return data.booking;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
}

/**
 * Cancel a specific booking.
 * @param bookingReference - The reference of the booking to cancel.
 * @returns A success message.
 */
export async function cancelBooking(bookingReference: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/bookings/${bookingReference}/cancel`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Error canceling booking: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Booking successfully canceled',
    };
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    throw error;
  }
}

/**
 * Mark a specific session as done.
 * @param sessionId - The ID of the session to mark as done.
 * @returns Void.
 */
export async function markSessionAsDone(sessionId: string): Promise<void> {
  try {
    const response = await fetch(`/api/sessions/${sessionId}/done`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to mark session as done: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error in markSessionAsDone:', error);
    throw new Error(`Failed to mark session as done: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a specific session.
 * @param sessionId - The ID of the session to cancel.
 * @returns Void.
 */
export async function cancelSession(sessionId: string): Promise<void> {
  try {
    const response = await fetch(`/api/sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel session: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error in cancelSession:', error);
    throw new Error(`Failed to cancel session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Optional: Mock API implementations for development/testing purposes

export const mockAPI = {
  fetchAvailableDates: async (tutorId: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const dates: string[] = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      if (Math.random() > 0.3) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
    }

    return dates;
  },

  fetchAvailableSlots: async (tutorId: string, date: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const timeSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    return timeSlots.filter(() => Math.random() > 0.3);
  },

  createBooking: async (bookingRequest: BookingRequest): Promise<BookingDetails> => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const reference = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      ...bookingRequest,
      reference,
    };
  },

  cancelBooking: async (bookingReference: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      message: `Booking ${bookingReference} has been successfully canceled`,
    };
  },
};
