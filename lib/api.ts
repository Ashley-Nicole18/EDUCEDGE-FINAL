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
  
  export async function createBooking(bookingData: BookingData): Promise<BookingDetails> {
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
      
      const data = await response.json();
      return data.booking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  }
  
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
    
    createBooking: async (bookingData: BookingData): Promise<BookingDetails> => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const reference = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
      
      return {
        ...bookingData,
        reference,
      };
    },
    
    cancelBooking: async (bookingReference: string): Promise<{ success: boolean; message: string }> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: `Booking ${bookingReference} has been successfully canceled`,
      };
    }
  };