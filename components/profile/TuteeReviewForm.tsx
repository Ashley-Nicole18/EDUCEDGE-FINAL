// Review Page for Tutee
'use client';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ReviewForm() {
  const router = useRouter();
  const params = useParams();
  const tutorId = Array.isArray(params?.tutorId) ? params.tutorId[0] : params?.tutorId;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user || !tutorId) return;

    await addDoc(collection(db, 'users', tutorId, 'reviews'), {
      tuteeId: user.uid,
      comment,
      rating,
      timestamp: serverTimestamp(),
    });

    router.push('/dashboard/student');
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
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
