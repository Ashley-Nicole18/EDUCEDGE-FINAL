'use client';

import { useState, useEffect } from 'react';

export interface Session {
  id: string;
  tutorId: string;
  date: string;
  time: string;
  subject: string;
  isDone: boolean;
  reference?: string; // <- Add this if it's missing
  status: 'upcoming' | 'done' | 'cancelled';
}

interface SessionsListProps {
  tutorId: string;
}

const SessionsList: React.FC<SessionsListProps> = ({ tutorId }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await (await import('../lib/api')).mockAPI.fetchSessions(tutorId);
      setSessions(data);
    } catch (err) {
      console.error("Error loading sessions", err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const markAsDone = async (id: string) => {
    try {
      await (await import('../lib/api')).mockAPI.markSessionAsDone(id);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'done' } : s))
      );
    } catch (err) {
      console.error("Error marking session as done", err);
    }
  };

  const cancelSession = async (id: string) => {
    try {
      await (await import('../lib/api')).mockAPI.cancelSession(id);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s))
      );
    } catch (err) {
      console.error("Error cancelling session", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [tutorId]);

  if (loading) return <p>Loading sessions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">My Sessions</h2>
      {sessions.length === 0 ? (
        <p>No sessions booked yet.</p>
      ) : (
        sessions.map((session) => (
          <div
            key={session.id}
            className="border rounded p-4 shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <p><strong>Student:</strong> {session.studentName}</p>
              <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {session.timeSlot}</p>
              <p><strong>Status:</strong> {session.status}</p>
            </div>
            <div className="flex gap-2">
              {session.status === 'upcoming' && (
                <>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => markAsDone(session.id)}
                  >
                    Mark as Done
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => cancelSession(session.id)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SessionsList;
