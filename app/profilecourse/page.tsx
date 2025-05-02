"use client";

import React from "react";
import ProfileTutorCourse from "@/components/ProfileTutorCourse";
import { useSearchParams } from "next/navigation";

const ProfileCoursePage = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get("course");

  return <ProfileTutorCourse course={course} />;
};

export default ProfileCoursePage;
