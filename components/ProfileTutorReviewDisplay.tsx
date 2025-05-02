'use client';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Review {
  id: string;
  comment: string;
  rating: number;
  tuteeId: string;
}

export default function TutorReviews() {
  const { tutorId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!tutorId || typeof tutorId !== 'string') return;

    const fetchReviews = async () => {
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
      }
    };

    fetchReviews();
  }, [tutorId]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-black text-center">Tutor Reviews</h1>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="mb-6 p-5 border rounded-lg shadow-sm bg-gray-50"
            >
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={s <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-black">{review.comment}</p>
              <p className="text-sm text-gray-400 mt-2">Tutee ID: {review.tuteeId}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

