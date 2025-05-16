"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/app/firebase/config"; // Firebase authentication and Firestore DB instance
import { useRouter } from "next/navigation"; // For programmatic navigation
import Sidebar from "@/components/Sidebar"; // Sidebar component
import Image from "next/image"; // Next.js optimized image component
import {
  CurrencyDollarIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon, // Icon for displaying review count
} from "@heroicons/react/24/solid";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"; // Firestore operations

// Booking interface type definition
interface Booking {
  id: string;
  tutorId: string | null;
  studentId: string | null;
  date: string | null;
  timeSlot: string | null;
  subject: string;
  status?: "upcoming" | "completed" | "cancelled";
  price?: number;
  rating?: number;
  firstName?: string;
  lastName?: string;
}

// Main dashboard component
export default function TutorDashboard() {
  // State declarations
  const [user, setUser] = useState<any>(null);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [successfulSessions, setSuccessfulSessions] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      // Redirect to sign-in if user is not logged in
      if (!auth.currentUser) {
        router.push("/sign-in");
        setLoading(false);
        return;
      }

      setUser(auth.currentUser);
      const tutorId = auth.currentUser.uid;

      try {
        const bookingsRef = collection(db, "bookings");

        // Query all bookings for this tutor
        const allBookingsQuery = query(
          bookingsRef,
          where("tutorId", "==", tutorId)
        );
        const allBookingsSnap = await getDocs(allBookingsQuery);
        setTotalBookings(allBookingsSnap.size); // Total bookings count

        // Query completed sessions
        const successfulQuery = query(
          bookingsRef,
          where("tutorId", "==", tutorId),
          where("status", "==", "completed")
        );
        const successfulSnap = await getDocs(successfulQuery);
        setSuccessfulSessions(successfulSnap.size); // Completed sessions count

        // Calculate total earnings from completed bookings
        let totalEarningsAmount = 0;
        const completedBookingsQuery = query(
          bookingsRef,
          where("tutorId", "==", tutorId),
          where("status", "==", "completed")
        );
        const completedBookingsSnap = await getDocs(completedBookingsQuery);
        completedBookingsSnap.forEach((doc) => {
          const booking = doc.data() as Booking;
          if (booking.price) {
            totalEarningsAmount += booking.price;
          }
        });
        setTotalEarnings(totalEarningsAmount);

        // Fetch number of reviews for the tutor
        const reviewsRef = collection(db, "users", tutorId, "reviews");
        const reviewsSnap = await getDocs(reviewsRef);
        setReviewCount(reviewsSnap.size);

      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false); // Always stop loading indicator
      }
    };

    fetchDashboardData();
  }, [router]);

  // Loading state UI
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-6 ml-48">Loading dashboard data...</div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-6 ml-48 text-red-500">{error}</div>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 ml-48">
        {/* Tutor Profile Section */}
        <div className="flex items-center space-x-4 mb-6">
          {user?.photoURL && (
            <Image
              src={user.photoURL}
              alt="Profile Picture"
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {user?.displayName || "Tutor"}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* Review Count */}
          <div className="bg-white p-6 rounded shadow flex flex-col items-start">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h3 className="text-lg font-semibold text-yellow-500">Reviews</h3>
            <p className="text-gray-800 mt-1 text-lg font-bold">
              {reviewCount} Reviews
            </p>
          </div>

          {/* Total Bookings */}
          <div className="bg-white p-6 rounded shadow flex flex-col items-start">
            <CalendarDaysIcon className="h-8 w-8 text-teal-600 mb-2" />
            <h3 className="text-lg font-semibold text-teal-600">
              Total Bookings
            </h3>
            <p className="text-gray-800 mt-1 text-lg font-bold">
              {totalBookings} sessions
            </p>
          </div>

          {/* Earnings */}
          <div className="bg-white p-6 rounded shadow flex flex-col items-start">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="text-lg font-semibold text-green-600">Earnings</h3>
            <p className="text-gray-800 mt-1 text-lg font-bold">
              ₱{totalEarnings.toFixed(2)}
            </p>
          </div>

          {/* Completed Sessions */}
          <div className="bg-white p-6 rounded shadow flex flex-col items-start">
            <CheckCircleIcon className="h-8 w-8 text-indigo-600 mb-2" />
            <h3 className="text-lg font-semibold text-indigo-600">
              Successful Sessions
            </h3>
            <p className="text-gray-800 mt-1 text-lg font-bold">
              {successfulSessions}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
