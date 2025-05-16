"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Sidebar from "../Sidebar";
import { db } from "@/app/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";


interface Tutor {
  id: string;
  name: string;
}

// Component to render each tutor card
const TutorCard: React.FC<Tutor> = ({ id, name }) => {
  return (
    <div className="tutor-card border rounded-xl shadow-md p-4 bg-white">
      {/* Profile icon placeholder */}
      <div className="tutor-image flex justify-center items-center h-32 bg-blue-50 rounded-md mb-4">
        <UserCircleIcon className="h-16 w-16 text-blue-400" />
      </div>
      {/* Tutor name and link to profile */}
      <div className="tutor-info text-center">
        <div className="tutor-name text-lg font-semibold text-gray-800 mb-1">{name}</div>
        <Link
          href={`/profile/${id}`} // Dynamic route to tutor profile
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
          aria-label={`View profile of ${name}`}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

// Main dashboard component for tutees
const TuteeDashboard: React.FC = () => {
  // State variables
  const [allTutors, setAllTutors] = useState<Tutor[]>([]); // all fetched tutors
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]); // tutors filtered by search
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState<string | null>(null); // error state
  const [searchQuery, setSearchQuery] = useState(""); // search input value

  // Fetch tutor data from Firebase Firestore
  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true); // start loading
      setError(null);   // reset error state
      try {
        // Query Firestore for users with role 'tutor'
        const tutorsQuery = query(collection(db, "users"), where("role", "==", "tutor"));
        const querySnapshot = await getDocs(tutorsQuery);

        const fetchedTutors: Tutor[] = [];
        querySnapshot.forEach((doc) => {
          // Extract data and store it in fetchedTutors array
          fetchedTutors.push({ id: doc.id, ...doc.data() } as Tutor);
        });

        // Save to state
        setAllTutors(fetchedTutors);
        setFilteredTutors(fetchedTutors); // default to all tutors

        console.log(fetchedTutors); // Debug
      } catch (e: unknown) {
        console.error("Error fetching tutors:", e);
        setError("Failed to load tutors. Please try again later.");
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchTutors(); // Run the fetch function when component mounts
  }, []);

  // Handle typing in the search input
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // Filter tutors based on lowercase name match
    const filtered = allTutors.filter((tutor) =>
      tutor.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredTutors(filtered);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 dashboard p-8 ml-[250px]">
          <div className="text-center">Loading tutors...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 dashboard p-8 ml-[250px]">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tutee Dashboard - Search for Tutor</title>
        <meta name="description" content="Find tutors and get personalized learning support" />
      </Head>

      <div className="flex">
        <Sidebar />
        <div className="flex-1 dashboard p-8 ml-[250px]">
          {/* Header */}
          <div className="header mb-8">
            <h1 className="text-2xl font-bold text-blue-600">Find Your Tutor</h1>
          </div>

          {/* Welcome message */}
          <div className="welcome-section bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Welcome!</h2>
            <p className="text-gray-600">
              Search for tutors or check out our recommendations below to continue your learning journey.
            </p>
          </div>

          {/* Search bar */}
          <div className="search-section mb-8">
            <div className="search-bar flex">
              <input
                type="text"
                className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Search for tutors or subjects..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                aria-label="Search for tutors"
              />
              <button
                className="bg-blue-600 text-white px-6 py-4 rounded-r-lg hover:bg-blue-700 transition"
                onClick={() => handleSearchInputChange({ target: { value: searchQuery } } as any)}
                aria-label="Search button"
              >
                Search
              </button>
            </div>
          </div>

          {/* Display tutor cards */}
          <div className="tutors-section">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Tutors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  id={tutor.id}
                  name={tutor.name}
                />
              ))}
              {/* No results message */}
              {filteredTutors.length === 0 && (
                <p className="text-gray-600">No tutors found matching your search.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TuteeDashboard;
