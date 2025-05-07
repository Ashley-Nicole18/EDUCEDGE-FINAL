import { Session } from './api';

let sessions: Session[] = [];

export const mockAPI = {
  fetchSessions: async (tutorId: string): Promise<Session[]> => {
    return sessions.filter((s) => s.tutorId === tutorId);
  },

  markSessionAsDone: async (id: string): Promise<void> => {
    sessions = sessions.map((s) =>
      s.id === id ? { ...s, status: 'done', isDone: true } : s
    );
  },

  cancelSession: async (id: string): Promise<void> => {
    sessions = sessions.map((s) =>
      s.id === id ? { ...s, status: 'cancelled' } : s
    );
  },

  addSession: async (session: Session): Promise<void> => {
    sessions.push(session);
  },
};