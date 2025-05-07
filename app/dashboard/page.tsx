"use client";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import TutorDashboard from "@/components/dashboard/tutor";
import { useRouter } from "next/navigation";
import TuteeDashboard from "@/components/dashboard/tutee";

type UserRole = "tutor" | "tutee" | null;

const DashboardPage = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/sign-in");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (!docSnap.exists()) {
          router.push("/role-selection");
          return;
        }

        const userRole = docSnap.data()?.role as UserRole;
        if (!userRole) {
          router.push("/role-selection");
          return;
        }

        setRole(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {role === "tutor" ? (
        <TutorDashboard />
      ) : role === "tutee" ? (
        <TuteeDashboard/>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div>Invalid role configuration</div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;