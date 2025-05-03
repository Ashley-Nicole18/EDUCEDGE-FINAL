import React from "react";
import Link from "next/link";
import {
  UserCircleIcon,
  HomeIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar: React.FC = () => {
  return (
    <div className="w-48 h-full bg-transparent text-black flex flex-col ml-6 px-6 py-36 space-y-6">
      <Link href="/profile" className="flex items-center space-x-2 group hover:bg-gray-100 rounded px-2 py-1">
        <UserCircleIcon className="h-5 w-5 group-hover:text-blue-500" />
        <span className="group-hover:text-blue-500">Profile</span>
      </Link>
      <Link href="/dashboard" className="flex items-center space-x-2 group hover:bg-gray-100 rounded px-2 py-1">
        <HomeIcon className="h-5 w-5 group-hover:text-blue-500" />
        <span className="group-hover:text-blue-500">Dashboard</span>
      </Link>
      <Link href="/booking" className="flex items-center space-x-2 group hover:bg-gray-100 rounded px-2 py-1">
        <CalendarIcon className="h-5 w-5 group-hover:text-blue-500" />
        <span className="group-hover:text-blue-500">Booking</span>
      </Link>
      <div className="mt-32" /> {/* spacing before sign out */}
      <Link href="/signout" className="flex items-center space-x-2 group hover:bg-gray-100 rounded px-2 py-1">
        <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:text-blue-500" />
        <span className="group-hover:text-blue-500">Sign Out</span>
      </Link>
    </div>
  );
};

export default Sidebar;
