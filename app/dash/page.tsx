"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const [results, setResults] = useState<string[]>([]);

  const totalBookings = 24;
  const totalEarnings = 720;
  const successfulSessions = 20;
  const lessonsTaught = 12;
  const avgRating = 4.8;

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setResults([`Result for "${query}"`]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      
      <div className="flex-1 p-6 ml-48"> 
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

        <SearchBar onSearch={handleSearch} />

        {results.length > 0 && (
          <div className="bg-white mt-4 p-4 rounded shadow">
            {results.map((res, idx) => (
              <p key={idx} className="text-gray-800">{res}</p>
            ))}
          </div>
        )}

        <div className="bg-white mt-6 p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">Upcoming Lessons</h2>
          <ul className="space-y-2 text-gray-700">
            <li>📘 Calculus with John – Monday 10:00 AM</li>
            <li>📗 Data Analysis with Emma – Tuesday 2:00 PM</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white p-6 rounded shadow flex flex-col items-start">
            <ChartBarIcon className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="text-lg font-semibold text-purple-600">Performance</h3>
            <p className="text-gray-800 mt-1">Lessons Taught: {lessonsTaught}</p>
            <p className="text-gray-800">Avg. Rating: {avgRating} ⭐</p>
          </div>

          <div className="bg-white p-6 rounded shadow flex flex-col items-start">
            <CalendarDaysIcon className="h-8 w-8 text-teal-600 mb-2" />
            <h3 className="text-lg font-semibold text-teal-600">Total Bookings</h3>
            <p className="text-gray-800 mt-1 text-lg font-bold">{totalBookings} sessions</p>
          </div>

          <div className="bg-white p-6 rounded shadow flex flex-col items-start">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="text-lg font-semibold text-green-600">Earnings</h3>
            <p className="text-gray-800 mt-1 text-lg font-bold">${totalEarnings}</p>
          </div>

          <div className="bg-white p-6 rounded shadow flex flex-col items-start">
            <CheckCircleIcon className="h-8 w-8 text-indigo-600 mb-2" />
            <h3 className="text-lg font-semibold text-indigo-600">Successful Sessions</h3>
            <p className="text-gray-800 mt-1 text-lg font-bold">{successfulSessions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
