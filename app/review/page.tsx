"use client";
import { useSearchParams } from "next/navigation";
import ProfileNav from "@/components/ProfileNav";
import ProfileTutorReviewDisplay from "@/components/profile/ProfileTutorReviewDisplay";

const ReviewPage = () => {
  const searchParams = useSearchParams();
  const course = searchParams.get("course");

  return (
    <div className="min-h-screen pt-20"> 
      <ProfileNav />

      <div className="flex justify-center items-center p-8">
        <ProfileTutorReviewDisplay />
      </div>
    </div>
  );
};

export default ReviewPage;
