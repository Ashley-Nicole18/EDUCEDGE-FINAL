"use client";
import { useSearchParams } from "next/navigation";
import ProfileNav from "@/components/ProfileNav";
import ProfileTutorReviewDisplay from "@/components/profile/ProfileTutorReviewDisplay";

const ReviewPage = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get("course");

  return (
    <div>
      <ProfileNav course={course} />
      <ProfileTutorReviewDisplay />
    </div>
  );
};

export default ReviewPage;
