"use client";
import { auth, db } from "../firebase/config";
// hello use one firesbase nga config only
// use either the one on lib/firebase or the one on app/firebase/config

import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

// check role based on the user's role
// then render the correct components based on the role

const Page = () => {
  const [role, setRole] = React.useState<string | null>(null);

  useEffect(() => {
    const subscription = onAuthStateChanged(auth, (user) => {
      console.log(user);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setRole(data?.role || null);
          } else {
            console.log("No such document!");
          }
        });
      }
    });

    return () => subscription();
  }, []);
  return <div>{role}
  {
    role === "tutor" ? (
      <div>Tutor Dashboard</div>
    ) : role === "student" ? (
      <div>Student Dashboard</div>
    ) : (
      <div>Please select a role</div>
    )
  }
  
  </div>;
};

export default Page;
