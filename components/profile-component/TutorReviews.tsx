'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/app/firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

interface Review {
  id: string;
  comment: string;
  rating: number;
  tuteeId: string;
  timestamp: any; // Keep as 'any' to handle Firestore Timestamp
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ))}
  </div>
);

const formatDate = (timestamp: any) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } else {
    console.error("Invalid timestamp format:", timestamp);
    return 'Date unavailable';
  }
};

interface TutorReviewsProps {
  userId?: string;
}

export default function TutorReviews({ userId }: TutorReviewsProps) {
  const { tutorId: routeTutorId } = useParams();
  const tutorIdToUse = routeTutorId || userId;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!tutorIdToUse || typeof tutorIdToUse !== 'string') {
      setLoading(false);
      setFetchError('Invalid Tutor ID.');
      return;
    }

    const fetchReviews = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const q = query(
          collection(db, 'users', tutorIdToUse, 'reviews'),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Review[];
        setReviews(fetched);
      } catch (error: unknown) {
        console.error('Failed to fetch reviews:', error);
        if (error instanceof Error) {
          setFetchError(`Failed to fetch reviews: ${error.message}`);
        } else {
          setFetchError('An unexpected error occurred while fetching reviews.');
        }
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tutorIdToUse]);

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tutor Reviews</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : fetchError ? (
        <p className="text-center text-red-500">{fetchError}</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-400">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="mb-4 p-4 bg-gray-100 border border-gray-200 rounded-xl shadow-sm"
          >
            <StarRating rating={review.rating} />
            <p className="mt-3 text-black">{review.comment}</p>
            <div className="text-sm text-gray-500 mt-2">
              <p>Tutee ID: {review.tuteeId}</p>
              <p>Reviewed on: {formatDate(review.timestamp)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}