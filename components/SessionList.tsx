'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiCalendar, FiUser } from 'react-icons/fi';

interface Session {
  id: string;
  date: string;
  time: string;
  studentName: string;
  subject: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

interface SessionsListProps {
  tutorId: string;
  fetchSessions: (tutorId: string) => Promise<Session[]>;
  markSessionAsDone: (sessionId: string) => Promise<void>;
  cancelSession: (sessionId: string) => Promise<void>;
}

const SessionsList: React.FC<SessionsListProps> = ({ 
  tutorId, 
  fetchSessions,
  markSessionAsDone,
  cancelSession 
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSessions(tutorId);
        setSessions(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (err) {
        console.error("Failed to load sessions:", err);
        setError("Failed to load sessions. Please try again.");
        
        // Development fallback
        if (process.env.NODE_ENV === 'development') {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          
          setSessions([
            {
              id: '1',
              date: tomorrow.toISOString().split('T')[0],
              time: '10:00 AM',
              studentName: 'John Doe',
              subject: 'Mathematics',
              status: 'upcoming',
              notes: 'Focus on algebra concepts'
            },
            {
              id: '2',
              date: new Date(today.getTime() + 2 * 86400000).toISOString().split('T')[0],
              time: '02:00 PM',
              studentName: 'Jane Smith',
              subject: 'Physics',
              status: 'upcoming'
            }
          ]);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [tutorId, fetchSessions]);

  const handleMarkAsDone = async (sessionId: string) => {
    try {
      await markSessionAsDone(sessionId);
      setSessions(sessions.map(session => 
        session.id === sessionId ? { ...session, status: 'completed' } : session
      ));
    } catch (err) {
      console.error("Failed to mark session as done:", err);
      setError("Failed to update session status");
    }
  };

  const handleCancel = async (sessionId: string) => {
    try {
      await cancelSession(sessionId);
      setSessions(sessions.map(session => 
        session.id === sessionId ? { ...session, status: 'cancelled' } : session
      ));
    } catch (err) {
      console.error("Failed to cancel session:", err);
      setError("Failed to cancel session");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><FiClock /> Upcoming</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><FiCheckCircle /> Completed</span>;
      case 'cancelled':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><FiXCircle /> Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reload Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Sessions</h2>
        <div className="text-sm text-gray-500">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No sessions scheduled</h3>
          <p className="mt-1 text-gray-500">You don't have any upcoming sessions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <div 
              key={session.id} 
              className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                session.status === 'cancelled' ? 'bg-gray-50 opacity-75' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    <p className="font-medium text-lg text-gray-800">{session.studentName}</p>
                  </div>
                  <p className="text-gray-800 font-semibold">{session.subject}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiCalendar />
                      <span>
                        {new Date(session.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock />
                      <span>{session.time}</span>
                    </div>
                  </div>
                  
                  {session.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">Notes:</p>
                      <p>{session.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  {getStatusBadge(session.status)}
                  
                  {session.status === 'upcoming' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleMarkAsDone(session.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm flex items-center gap-1"
                      >
                        <FiCheckCircle /> Done
                      </button>
                      <button 
                        onClick={() => handleCancel(session.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center gap-1"
                      >
                        <FiXCircle /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsList;