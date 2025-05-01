'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface TutorInfoType {
  name: string;
  bio: string;
  email: string;
  // Add more fields if needed
}

const TutorInfo = () => {
  const [info, setInfo] = useState<TutorInfoType | null>(null);
  const userId = "user123"; // Replace with dynamic ID later

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInfo(docSnap.data() as TutorInfoType);
      }
    };
    fetchData();
  }, []);

  if (!info) return <p>Loading...</p>;

  return (
    <div className="text-black">
      <h1 className="text-xl font-bold mb-4">Tutor Information</h1>
      <p><strong>Name:</strong> {info.name}</p>
      <p><strong>Bio:</strong> {info.bio}</p>
      <p><strong>Email:</strong> {info.email}</p>
    </div>
  );
};

export default TutorInfo;
