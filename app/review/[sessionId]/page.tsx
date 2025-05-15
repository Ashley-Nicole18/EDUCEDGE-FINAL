// app/review/[sessionId]/page.tsx
'use client';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db, auth } from '@/app/firebase/config';
import { doc, collection, addDoc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';

export default function ReviewForm() {
  const router = useRouter();
  const params = useParams();
  console.log("useParams() in ReviewForm:", params); // Reverted log
  const sessionId = Array.isArray(params?.sessionId) ? params.sessionId[0] : params?.sessionId;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [tutorId, setTutorId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Auth state changed in ReviewForm:", user?.uid);
      } else {
        console.log("Auth state changed in ReviewForm: User is null");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTutorId = async () => {
      if (sessionId) {
        try {
          const bookingDocRef = doc(db, 'bookings', sessionId);
          const bookingDocSnap = await getDoc(bookingDocRef);

          if (bookingDocSnap.exists()) {
            const bookingData = bookingDocSnap.data();
            setTutorId(bookingData?.tutorId || null);
          } else {
            setSubmissionError("Booking not found.");
          }
        } catch (error) {
          console.error("Error fetching booking data:", error);
          setSubmissionError("Failed to load session details.");
        }
      }
    };

    fetchTutorId();
  }, [sessionId]);

  console.log("Current auth.currentUser on render:", auth.currentUser?.uid);
  console.log("Current sessionId on render:", sessionId);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    console.log("Current auth.currentUser on submit:", user?.uid);
    console.log("Current sessionId on submit:", sessionId);
    if (!user) {
      console.log("handleSubmit: User is null at the time of submission.");
      setSubmissionError('Not authenticated. Please log in again.');
      return;
    }
    if (!sessionId) {
      console.log("handleSubmit: Session ID is missing at the time of submission.");
      setSubmissionError('Session ID is missing.');
      return;
    }

    if (!tutorId) {
      setSubmissionError('Tutor ID not yet loaded. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      await addDoc(collection(db, 'users', tutorId, 'reviews'), {
        sessionId: sessionId, // Link the review to the session
        tuteeId: user.uid, // Use the user fetched at the time of submission
        comment,
        rating,
        timestamp: serverTimestamp(),
      });

      // Update the booking status to 'reviewed'
      await updateDoc(doc(db, 'bookings', sessionId), {
        status: 'reviewed',
      });

      setIsSubmitting(false);
      router.push('/dashboard'); // Redirect after review
    } catch (error: unknown) {
      setIsSubmitting(false);
      if (error instanceof Error) {
        setSubmissionError(`Failed to submit review: ${error.message}`);
      } else {
        setSubmissionError('An unexpected error occurred while submitting the review.');
      }
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-10">
      <div className="w-full max-w-lg bg-gray-100 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">Write a Review</h1>
        {submissionError && <p className="text-red-500 mb-4">{submissionError}</p>}
        <textarea
          className="w-full border border-gray-300 text-black p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={10}
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              } focus:outline-none`}
              type="button"
            >
              ★
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className={`w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}