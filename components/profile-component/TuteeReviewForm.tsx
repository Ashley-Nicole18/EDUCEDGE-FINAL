'use client';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { db, auth } from '@/app/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ReviewForm() {
  const router = useRouter();
  const params = useParams();
  const tutorId = Array.isArray(params?.tutorId) ? params.tutorId[0] : params?.tutorId;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user || !tutorId) {
      setSubmissionError('Not authenticated or tutor ID is missing.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      await addDoc(collection(db, 'users', tutorId, 'reviews'), {
        tuteeId: user.uid,
        comment,
        rating,
        timestamp: serverTimestamp(),
      });
      setIsSubmitting(false);
      router.push('/dashboard/student');
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
        <textarea
          className="w-100 border border-gray-300 text-black p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {submissionError && <p className="text-red-500 mb-4">{submissionError}</p>}
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