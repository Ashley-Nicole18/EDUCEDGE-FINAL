//this is for the booking di pag tanduga ka mockup lang gin gamit ko//

interface BookingData {
  tutorId: string;
  date: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface BookingDetails extends BookingData {
  reference: string;
}

interface Session {
  id: string;
  tutorId: string;
  date: string;
  time: string;
  studentName: string;
  subject: string;
  isDone: boolean;
}

interface Tutor {
  id: string;
  name: string;
  subject: string;
}

// Helper for simulating network delays in mock implementation
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockTutors: Tutor[] = [
  { id: 'tutor1', name: 'John Smith', subject: 'Mathematics' },
  { id: 'tutor2', name: 'Jane Doe', subject: 'Physics' },
];

const mockSessions: Session[] = [
  { 
    id: 'session1', 
    tutorId: 'tutor1', 
    date: '2025-04-26', 
    time: '1:00 pm', 
    studentName: 'Jane Doe', 
    subject: 'Physics',
    isDone: false 
  },
  { 
    id: 'session2', 
    tutorId: 'tutor1', 
    date: '2025-04-26', 
    time: '1:00 pm', 
    studentName: 'Albert Doe', 
    subject: 'Physics',
    isDone: false 
  },
  { 
    id: 'session3', 
    tutorId: 'tutor1', 
    date: '2025-04-26', 
    time: '1:00 pm', 
    studentName: 'Chris Doe', 
    subject: 'Physics',
    isDone: true 
  },
];

// Helper functions for mock API
const generateAvailableDates = (): string[] => {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

const generateTimeSlots = (): string[] => {
  return [
    '9:00 am', '10:00 am', '11:00 am', 
    '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm'
  ];
};

const generateReference = (): string => {
  return 'BOOK-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Real API functions
export async function fetchTutors(): Promise<Tutor[]> {
  try {
    const response = await fetch('/api/tutors');
    
    if (!response.ok) {
      throw new Error(`Error fetching tutors: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.tutors;
  } catch (error) {
    console.error('Failed to fetch tutors:', error);
    throw error;
  }
}

export async function fetchAvailableDates(tutorId: string): Promise<string[]> {
  if (!tutorId) {
    throw new Error('tutorId is required');
  }
  
  try {
    const response = await fetch(`/api/tutors/${tutorId}/availability`);
    
    if (!response.ok) {
      throw new Error(`Error fetching available dates: ${response.statusText}`);
    }
    
    const data: { availableDates: string[] } = await response.json();
    if (!data || !Array.isArray(data.availableDates)) {
      throw new Error('Invalid response format: availableDates array not found');
    }
    return data.availableDates;
  } catch (error) {
    console.error('Failed to fetch available dates:', error);
    throw error;
  }
}

export async function fetchAvailableSlots(tutorId: string, date: string): Promise<string[]> {
  if (!tutorId) {
    throw new Error('tutorId is required');
  }
  
  if (!date) {
    throw new Error('date is required');
  }
  
  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }
  
  try {
    const response = await fetch(`/api/tutors/${tutorId}/slots?date=${encodeURIComponent(date)}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching available slots: ${response.statusText}`);
    }
    
    const data: { availableSlots: string[] } = await response.json();
    if (!data || !Array.isArray(data.availableSlots)) {
      throw new Error('Invalid response format: availableSlots array not found');
    }
    return data.availableSlots;
  } catch (error) {
    console.error('Failed to fetch available time slots:', error);
    throw error;
  }
}

export async function createBooking(bookingData: BookingData): Promise<BookingDetails> {
  // Validate required fields
  if (!bookingData.tutorId) throw new Error('tutorId is required');
  if (!bookingData.date) throw new Error('date is required');
  if (!bookingData.timeSlot) throw new Error('timeSlot is required');
  if (!bookingData.firstName) throw new Error('firstName is required');
  if (!bookingData.lastName) throw new Error('lastName is required');
  if (!bookingData.email) throw new Error('email is required');
  
  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingData.date)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }
  
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating booking: ${response.statusText}`);
    }
    
    const data: { booking: BookingDetails } = await response.json();
    if (!data || !data.booking || !data.booking.reference) {
      throw new Error('Invalid response format: booking details not found');
    }
    
    return data.booking;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
}

export async function cancelBooking(bookingReference: string): Promise<{ success: boolean; message: string }> {
  if (!bookingReference) {
    throw new Error('bookingReference is required');
  }
  
  try {
    const response = await fetch(`/api/bookings/${bookingReference}/cancel`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error canceling booking: ${response.statusText}`);
    }
    
    const data: { success?: boolean; message?: string } = await response.json();
    return {
      success: data.success ?? true,
      message: data.message || 'Booking successfully canceled',
    };
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    throw error;
  }
}

export async function fetchSessions(tutorId: string): Promise<Session[]> {
  if (!tutorId) {
    throw new Error('tutorId is required');
  }
  
  try {
    const response = await fetch(`/api/tutors/${tutorId}/sessions`);
    
    if (!response.ok) {
      throw new Error(`Error fetching sessions: ${response.statusText}`);
    }
    
    const data: { sessions: Session[] } = await response.json();
    if (!data || !Array.isArray(data.sessions)) {
      throw new Error('Invalid response format: sessions array not found');
    }
    return data.sessions;
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    throw error;
  }
}

export async function markSessionAsDone(sessionId: string): Promise<{ success: boolean }> {
  if (!sessionId) {
    throw new Error('sessionId is required');
  }
  
  try {
    const response = await fetch(`/api/sessions/${sessionId}/complete`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error marking session as done: ${response.statusText}`);
    }
    
    const data: { success?: boolean } = await response.json();
    return { success: data.success ?? true };
  } catch (error) {
    console.error('Failed to mark session as done:', error);
    throw error;
  }
}

export async function cancelSession(sessionId: string): Promise<{ success: boolean }> {
  if (!sessionId) {
    throw new Error('sessionId is required');
  }
  
  try {
    const response = await fetch(`/api/sessions/${sessionId}/cancel`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error canceling session: ${response.statusText}`);
    }
    
    const data: { success?: boolean } = await response.json();
    return { success: data.success ?? true };
  } catch (error) {
    console.error('Failed to cancel session:', error);
    throw error;
  }
}

// Mock API implementation for development and testing
export const mockAPI = {
  fetchTutors: async (): Promise<Tutor[]> => {
    await delay(800);
    return [...mockTutors];
  },
  
  fetchAvailableDates: async (tutorId: string): Promise<string[]> => {
    if (!tutorId) {
      throw new Error('tutorId is required');
    }
    await delay(1000);
    return generateAvailableDates();
  },
  
  fetchAvailableSlots: async (tutorId: string, date: string): Promise<string[]> => {
    if (!tutorId) {
      throw new Error('tutorId is required');
    }
    
    if (!date) {
      throw new Error('date is required');
    }
    
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }
    
    await delay(800);
    return generateTimeSlots();
  },
  
  createBooking: async (bookingData: BookingData): Promise<BookingDetails> => {
    // Validate required fields
    if (!bookingData.tutorId) throw new Error('tutorId is required');
    if (!bookingData.date) throw new Error('date is required');
    if (!bookingData.timeSlot) throw new Error('timeSlot is required');
    if (!bookingData.firstName) throw new Error('firstName is required');
    if (!bookingData.lastName) throw new Error('lastName is required');
    if (!bookingData.email) throw new Error('email is required');
    
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingData.date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }
    
    await delay(1500);
    const reference = generateReference();
    
    // In a real app, we would save this to a database
    const newBooking: BookingDetails & { createdAt: string } = {
      ...bookingData,
      reference,
      createdAt: new Date().toISOString()
    };
    
    return newBooking;
  },
  
  fetchSessions: async (tutorId: string): Promise<Session[]> => {
    if (!tutorId) {
      throw new Error('tutorId is required');
    }
    await delay(1000);
    return mockSessions.filter(session => session.tutorId === tutorId);
  },
  
  markSessionAsDone: async (sessionId: string): Promise<{ success: boolean }> => {
    if (!sessionId) {
      throw new Error('sessionId is required');
    }
    
    await delay(500);
    
    // In a real app, we would update this in a database
    const sessionIndex = mockSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error(`Session with id ${sessionId} not found`);
    }
    
    mockSessions[sessionIndex].isDone = true;
    return { success: true };
  },
  
  cancelSession: async (sessionId: string): Promise<{ success: boolean }> => {
    if (!sessionId) {
      throw new Error('sessionId is required');
    }
    
    await delay(500);
    
    // In a real app, we would update this in a database
    const sessionIndex = mockSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error(`Session with id ${sessionId} not found`);
    }
    
    mockSessions.splice(sessionIndex, 1);
    return { success: true };
  },
  
  cancelBooking: async (bookingReference: string): Promise<{ success: boolean; message: string }> => {
    if (!bookingReference) {
      throw new Error('bookingReference is required');
    }
    
    await delay(500);
    
    return {
      success: true,
      message: 'Booking successfully canceled'
    };
  }
}