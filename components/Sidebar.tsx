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
    <div className="fixed top-0 left-0 h-full w-48 bg-transparent text-black flex flex-col py-35 ml-6 px-6 space-y-6">
      <a href="/profile" className="flex items-center space-x-2 group hover:bg-gray-100 rounded px-2 py-1">
        <UserCircleIcon className="h-5 w-5 group-hover:text-blue-500" />
        <span className="group-hover:text-blue-500">Profile</span>
      </a>
      <a href="/dashboard" className="flex items-center space-x-2 group hover:bg-gray-100 rounded px-2 py-1">
        <HomeIcon className="h-5 w-5 group-hover:text-blue-500" />
        <span className="group-hover:text-blue-500">Dashboard</span>
      </a>
      <a href="/booking" className="flex items-center space-x-2 group hover:bg-gray-100 rounded px-2 py-1">
        <CalendarIcon className="h-5 w-5 group-hover:text-blue-500" />
        <span className="group-hover:text-blue-500">Booking</span>
      </a>
      <a href="/signout" className="flex items-center space-x-2 group hover:bg-gray-100 rounded px-2 py-1 mt-100">
        <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:text-blue-500" />
        <span className="group-hover:text-blue-500">Sign Out</span>
      </a>
    </div>
  );
};

export default Sidebar;
