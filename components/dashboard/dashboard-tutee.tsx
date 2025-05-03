"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/solid"; 
import Sidebar from "../Sidebar"; // make sure the path is correct

interface TutorProps {
  id: string;
  name: string;
  rating: number;
  fullStars: number;
}

const tutors: TutorProps[] = [
  { id: "1", name: "Tutor Name", rating: 5.0, fullStars: 5 },
  { id: "2", name: "Tutor Name", rating: 4.8, fullStars: 4 },
  { id: "3", name: "Tutor Name", rating: 4.9, fullStars: 5 },
  { id: "4", name: "Tutor Name", rating: 4.7, fullStars: 4 },
  { id: "5", name: "Tutor Name", rating: 5.0, fullStars: 5 },
  { id: "6", name: "Tutor Name", rating: 4.6, fullStars: 4 },
];

const TutorCard: React.FC<TutorProps> = ({ id, name, rating, fullStars }) => {
  return (
    <div className="tutor-card border rounded-xl shadow-md p-4 bg-white">
      <div className="tutor-image flex justify-center items-center h-32 bg-blue-50 rounded-md mb-4">
        <UserCircleIcon className="h-16 w-16 text-blue-400" />
      </div>
      <div className="tutor-info text-center">
        <div className="tutor-name text-lg font-semibold text-gray-800 mb-1">{name}</div>
        <div className="tutor-rating flex items-center justify-center gap-2 text-yellow-500 text-sm mb-4">
          <span>{'★'.repeat(fullStars)}{'☆'.repeat(5 - fullStars)}</span>
          <span className="text-gray-700">{rating.toFixed(1)}</span>
        </div>
        <Link
          href={`/tutor/${id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

const TuteeDashboard: React.FC = () => {
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
        <div className="flex-1 dashboard p-8">
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
              />
              <button className="search-button">Search</button>
            </div>
          </div>

          <div className="tutors-section">
            <div className="section-title">Recommended Tutors</div>
            <div className="tutors-grid">
              {tutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  id={tutor.id}
                  name={tutor.name}
                  rating={tutor.rating}
                  fullStars={tutor.fullStars}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

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
