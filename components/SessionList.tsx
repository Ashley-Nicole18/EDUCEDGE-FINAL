'use client';

import { useState, useEffect } from 'react';
import { mockAPI } from '../lib/api';

interface Session {
  id: string;
  date: string;
  time: string;
  studentName: string;
  subject: string;
  isDone: boolean;
}

interface SessionsListProps {
  tutorId: string;
}

const SessionsList: React.FC<SessionsListProps> = ({ tutorId }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        // Assuming mockAPI has a method to fetch sessions
        const sessionsData = await mockAPI.fetchSessions(tutorId);
        setSessions(sessionsData);
      } catch (err) {
        setError('Failed to load sessions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (tutorId) {
      fetchSessions();
    }
  }, [tutorId]);

  const markSessionAsDone = async (sessionId: string) => {
    try {
      await mockAPI.markSessionAsDone(sessionId);
      
      // Update local state
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId 
            ? { ...session, isDone: true } 
            : session
        )
      );
    } catch (err) {
      setError('Failed to update session status');
      console.error(err);
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      await mockAPI.cancelSession(sessionId);
      
      // Remove the session from local state
      setSessions(prevSessions => 
        prevSessions.filter(session => session.id !== sessionId)
      );
    } catch (err) {
      setError('Failed to cancel session');
      console.error(err);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p>{error}</p>
        <button 
          onClick={() => setError(null)} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const upcomingSessions = sessions.filter(session => !session.isDone);
  const pastSessions = sessions.filter(session => session.isDone);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upcoming Sessions */}
      <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
      <div className="border-t border-b border-gray-200 mb-8">
        {upcomingSessions.length === 0 ? (
          <p className="py-4 text-gray-500">No upcoming sessions</p>
        ) : (
          upcomingSessions.map(session => (
            <div key={session.id} className="border-b border-gray-100 p-4 flex items-center">
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-gray-600">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{formatDate(session.date)}</div>
                  <div className="text-gray-500">{session.time}</div>
                </div>
              </div>
              
              <div className="text-right flex-1">
                <div className="font-semibold">{session.studentName}</div>
                <div className="text-gray-500">{session.subject}</div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => markSessionAsDone(session.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Mark as Done
                </button>
                <button
                  onClick={() => cancelSession(session.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Past Sessions */}
      <h2 className="text-2xl font-bold mb-4">Past Sessions</h2>
      <div className="border-t border-b border-gray-200">
        {pastSessions.length === 0 ? (
          <p className="py-4 text-gray-500">No past sessions</p>
        ) : (
          pastSessions.map(session => (
            <div key={session.id} className="border-b border-gray-100 p-4 flex items-center">
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-gray-600">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{formatDate(session.date)}</div>
                  <div className="text-gray-500">{session.time}</div>
                </div>
              </div>
              
              <div className="text-right flex-1">
                <div className="font-semibold">{session.studentName}</div>
                <div className="text-gray-500">{session.subject}</div>
              </div>
              
              <div className="ml-4">
                <button
                  disabled
                  className="px-4 py-2 bg-blue-400 text-white rounded cursor-default"
                >
                  Done
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionsList;