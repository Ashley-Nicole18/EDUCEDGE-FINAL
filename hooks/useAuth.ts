'use client';
// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase"; // adjust based on your setup

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return { user };
};

// src/hooks/useAuth.ts
// import { useState } from "react";

// // Dummy user for testing purposes
// const useAuth = () => {
//   const [user] = useState({
//     uid: "dummy-tutor-id", // Use a hardcoded UID for testing
//     firstName: "John",
//     lastName: "Doe",
//     schoolEmail: "johndoe@example.com",
//     // Any other data you want to mock
//   });

//   return { user };
// };

// export { useAuth };
