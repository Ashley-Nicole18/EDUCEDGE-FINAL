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
    <>
      {user?.role === "tutor" ? (
        <ProfileHeader userId={id} /> 
      ) : user?.role === "tutee" ? (
        <ProfileTutee/>
      ) : (
        <div>no valid role found</div>
      )}
    </>
  );
};

export default Page;