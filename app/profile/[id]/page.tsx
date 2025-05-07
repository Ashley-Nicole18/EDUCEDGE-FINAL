// pages/[id].tsx
import { db } from "@/app/firebase/config";
import ProfileHeader from "@/components/profile-component/ProfileHeader";
import ProfileTutee from "@/components/profile-component/ProfileTutee";
import { doc, getDoc } from "firebase/firestore";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const docRef = doc(db, "users", id);
  const data = await getDoc(docRef);

  if (!data.exists()) {
    throw new Error("No user found");
  }

  const user = data.data();

  console.log(user);
  return (
    <div className="flex-grow flex items-center justify-center overflow-auto min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl">
        {user?.role === "tutor" ? (
          <ProfileHeader userId={id} />
        ) : user?.role === "tutee" ? (
          <ProfileTutee />
        ) : (
          <div className="text-center text-xl text-gray-700">
            No valid role found
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;