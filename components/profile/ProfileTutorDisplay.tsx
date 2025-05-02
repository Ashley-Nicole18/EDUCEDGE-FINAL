// import React from 'react';
// import { useParams } from 'next/navigation';
// import { useUser } from '@/lib/hooks/useUser';
// import { getTutorById } from '@/lib/firebase/fetchData';
// import { useEffect, useState } from 'react';

// const TutorProfile = () => {
//   const { id } = useParams();
//   const { user } = useUser();
//   const [tutor, setTutor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (id) {
//       getTutorById(id).then((data) => {
//         setTutor(data);
//         setLoading(false);
//       });
//     }
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (!tutor) return <p>Tutor not found.</p>;

//   const isOwnProfile = user?.uid === tutor.id;

//   return (
//     <div className="p-4 space-y-6">
//       {/* Tutor Information */}
//       <section>
//         <h2 className="text-xl font-bold">Tutor Information</h2>
//         <p><strong>Name:</strong> {tutor.name}</p>
//         <p><strong>School:</strong> {tutor.school}</p>
//         <p><strong>Bio:</strong> {tutor.bio}</p>
//         {isOwnProfile && <button className="text-blue-500 underline">Edit Profile</button>}
//       </section>

//       {/* Courses and Lessons */}
//       <section>
//         <h2 className="text-xl font-bold">Courses Offered</h2>
//         {tutor.courses?.length === 0 ? (
//           <p>No courses available.</p>
//         ) : (
//           tutor.courses.map((course) => (
//             <div key={course.id || course.name} className="border rounded p-3 my-2">
//               <h3 className="font-semibold">{course.name}</h3>
//               {course.lessons?.map((lesson) => (
//                 <div key={lesson.id || lesson.name} className="ml-4">
//                   <p>Lesson: {lesson.name}</p>
//                   <p>Price: {lesson.price ? `$${lesson.price}/hour` : 'Not set'}</p>
//                 </div>
//               ))}
//             </div>
//           ))
//         )}
//       </section>

//       {/* Reviews Section */}
//       <section>
//         <h2 className="text-xl font-bold">Reviews</h2>
//         {tutor.reviews?.length > 0 ? (
//           tutor.reviews.map((review, index) => (
//             <div key={review.id || index} className="border rounded p-3 my-2">
//               <p className="font-semibold">Rating: {review.rating} ★</p>
//               <p>{review.comment}</p>
//             </div>
//           ))
//         ) : (
//           <p>No reviews yet.</p>
//         )}
//       </section>
//     </div>
//   );
// };

// export default TutorProfile;
