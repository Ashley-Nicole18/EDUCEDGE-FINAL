
export interface BookingData {
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
  
  export interface BookingDetails extends BookingData {
    reference: string;
  }
  
  export interface Session {
    id: string;
    tutorId: string;
    date: string;
    time: string;
    studentName: string;
    subject: string;
    isDone: boolean;
  }
  
  export interface Tutor {
    id: string;
    name: string;
    subject: string;
  }