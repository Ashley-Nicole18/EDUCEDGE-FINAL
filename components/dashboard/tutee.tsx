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
  name: string
}

const TutorCard: React.FC<Tutor> = ({ id, name }) => {
  return (
    <div className="tutor-card border rounded-xl shadow-md p-4 bg-white">
      <div className="tutor-image flex justify-center items-center h-32 bg-blue-50 rounded-md mb-4">
        <UserCircleIcon className="h-16 w-16 text-blue-400" />
      </div>
      <div className="tutor-info text-center">
        <div className="tutor-name text-lg font-semibold text-gray-800 mb-1">{name}</div>
        <Link
          href={`/profile/${id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

const TuteeDashboard: React.FC = () => {
  const [allTutors, setAllTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const tutorsQuery = query(collection(db, 'users'), where('role', '==', 'tutor'));
        const querySnapshot = await getDocs(tutorsQuery);
        const fetchedTutors: Tutor[] = [];
        querySnapshot.forEach((doc) => {
          fetchedTutors.push({ id: doc.id, ...doc.data() } as Tutor);
        });
        setAllTutors(fetchedTutors);
        setFilteredTutors(fetchedTutors);

        console.log(fetchedTutors)
      } catch (e: unknown) {
        console.error("Error fetching tutors:", e);
        let errorMessage = "Failed to load tutors. Please try again later.";
        if (e instanceof Error) {
          errorMessage = `Failed to load tutors: ${e.message}. Please try again later.`;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    const filtered = allTutors.filter((tutor) =>
      tutor.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredTutors(filtered);
  };

  const handleSearchButtonClick = () => {
    const filtered = allTutors.filter((tutor) =>
     tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTutors(filtered);
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 dashboard p-8" style={{ marginLeft: '250px' }}>
          <div className="text-center">Loading tutors...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 dashboard p-8" style={{ marginLeft: '250px' }}>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tutee Dashboard - Search for Tutor</title>
        <meta
          name="description"
          content="Find tutors and get personalized learning support"
        />
      </Head>

      <div className="flex">
        <Sidebar />
        <div className="flex-1 dashboard p-8" style={{ marginLeft: '250px' }}>
          <div className="header">
            <div className="logo">Find Your Tutor</div>
          </div>

          <div className="welcome-section">
            <h2>Welcome!</h2>
            <p>
              Search for tutors or check out our recommendations below to
              continue your learning journey.
            </p>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search for tutors or subjects..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button className="search-button" onClick={handleSearchButtonClick}>
                Search
              </button>
            </div>
          </div>

          <div className="tutors-section">
            <div className="section-title">Available Tutors</div>
            <div className="tutors-grid">
              {filteredTutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  id={tutor.id}
                  name={tutor.name}
                />
              ))}
              {filteredTutors.length === 0 && !loading && <p>No tutors found matching your search.</p>}
            </div>
          </div>
        </div>
      </div> {/* ✅ This was the missing closing tag */}

      <style jsx>{`
        .dashboard {
          padding: 40px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 20px;
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }

        .welcome-section {
          background-color: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .welcome-section h2 {
          margin-top: 0;
          color: #1f2937;
        }

        .welcome-section p {
          color: #4b5563;
          margin-bottom: 0;
        }

        .search-section {
          margin-bottom: 40px;
        }

        .search-bar {
          display: flex;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          color: #374151;
        }

        .search-input {
          flex: 1;
          padding: 14px 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px 0 0 8px;
          font-size: 16px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .search-input:focus {
          outline: none;
          border-color: #2563eb;
        }

        .search-button {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
        }

        .search-button:hover {
          background-color: #1d4ed8;
        }

        .tutors-section {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 12px;
        }

        .tutors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        .tutor-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .tutor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .tutor-image {
          height: 160px;
          background-color: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0284c7;
          font-weight: 600;
        }

        .tutor-info {
          padding: 20px;
          background-color: #f9fafb;
        }

        .tutor-name {
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 8px;
          color: #111827;
        }

        .tutor-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .star {
          color: #f59e0b;
        }

        .view-profile {
          display: block;
          text-align: center;
          background-color: #2563eb;
          color: white;
          padding: 10px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .view-profile:hover {
          background-color: #1d4ed8;
        }
      `}</style>
    </>
  );
};

export default TuteeDashboard;
