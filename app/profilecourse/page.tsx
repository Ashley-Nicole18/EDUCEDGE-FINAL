"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ProfileNav from "@/components/ProfileNav";
import ProfileTutorCourse from "@/components/profile/ProfileTutorCourse";

const ProfileCoursePage = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get("course");

  return (
    <div>
      <ProfileNav course={course} />
      <ProfileTutorCourse course={course} />
    </div>
  );
};

export default ProfileCoursePage;
