// src/pages/ProfilePage.tsx
"use client";

import ProfileTutorDisplay from "@/components/profile/ProfileTutorDisplay";
import { useAuth } from "@/hooks/useAuth"; // Importing the mock useAuth hook

import React from "react";

export default function ProfilePage() {
  const { user } = useAuth(); // Now using the dummy user

  return (
    <div>
      {user && <ProfileTutorDisplay tutorId={user.uid} />}{" "}
      {/* Using the dummy tutorId */}
    </div>
  );
}
