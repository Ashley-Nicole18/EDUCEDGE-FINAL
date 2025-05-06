"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCircleIcon,
  HomeIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const {user}= useAuth()

  const links = [
    { href: `/profile/${user?.uid}`, label: "Profile", Icon: UserCircleIcon },
    { href: "/dashboard", label: "Dashboard", Icon: HomeIcon },
    { href: "/booking", label: "Booking", Icon: CalendarIcon },
    { href: "/home", label: "Sign Out", Icon: ArrowRightOnRectangleIcon, className: "mt-auto" },
  ];

  return (
    <div
      className="fixed top-0 left-0 h-full w-48 text-black flex flex-col px-6 py-8 space-y-6 bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: 'url("/img/Background.png")' }}
    >
      <div className="mb-8">
        <Image
          src="/img/logow.PNG"
          alt="Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      {links.map(({ href, label, Icon, className }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center space-x-2 group hover:bg-gray-100 rounded px-2 py-1 ${isActive ? 'bg-gray-200 font-semibold text-blue-600' : ''} ${className || ''}`}
          >
            <Icon
              className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'group-hover:text-blue-500'}`}
            />
            <span className={`${isActive ? 'text-blue-600' : 'group-hover:text-blue-500'}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
