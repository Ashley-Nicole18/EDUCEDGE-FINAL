'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Sidebar from '../Sidebar';


interface Review {
  id: string;
  comment: string;
  rating: number;
  tuteeId: string;
  timestamp: number;
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

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export default function TutorReviews() {
  const { tutorId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tutorId || typeof tutorId !== 'string') return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'users', tutorId, 'reviews'),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Review[];
        setReviews(fetched);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tutorId]);

  return (
    
    <div className="relative flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-white px-4 py-10 flex justify-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-black">
            Tutor Reviews
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-400">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="mb-6 p-6 bg-gray-100 border border-gray-200 rounded-xl shadow-sm"
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
      </div>
    </div>
  );
}
;