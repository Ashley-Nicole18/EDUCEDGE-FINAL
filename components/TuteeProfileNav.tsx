"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ProfileNav = ({ course }: { course?: string | null }) => {
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    `text-base transition-colors duration-300 px-2 py-1 rounded cursor-pointer ${
      pathname === href
        ? "text-orange-500 font-semibold"
        : "text-black hover:text-orange-500"
    }`;

  return (
    <nav className="w-full bg-gray-100 shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-center items-center py-4 px-6 space-x-10">
        <Link href="/profile-tutee">
          <span className={linkClasses("/profile-tutor")}>Information</span>
        </Link>
      </div>
    </nav>
  );
};

export default ProfileNav;
