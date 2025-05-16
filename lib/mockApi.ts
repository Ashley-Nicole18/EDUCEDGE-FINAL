export const mockAPI = {
  // ... other methods ...
  
  fetchSessions: async (tutorId: string) => {
    // In a real app, this would be an API call
    return [
      {
        id: '1',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        time: '10:00 AM',
        studentName: 'John Doe',
        subject: 'Mathematics',
        status: 'upcoming'
      },
      {
        id: '2',
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
        time: '02:00 PM',
        studentName: 'Jane Smith',
        subject: 'Physics',
        status: 'upcoming'
      }
    ];
  },

  markSessionAsDone: async (sessionId: string) => {
    console.log(`Marking session ${sessionId} as done`);
    // In a real app, this would be an API call
    return Promise.resolve();
  },

  cancelSession: async (sessionId: string) => {
    console.log(`Canceling session ${sessionId}`);
    // In a real app, this would be an API call
    return Promise.resolve();
  }
};