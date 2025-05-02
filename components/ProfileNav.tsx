import Link from "next/link";


const ProfileNav = ({ course }: { course?: string | null }) => (
  <div className="relative w-full h-64 flex space-x-10 mt-6 ml-66">
    <Link href="/profile-tutor">
      <p className="text-base text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
        Information
      </p>
    </Link>

    <Link
      href={{
        pathname: "/profilecourse",
        query: { course: course ?? "" },
      }}
    >
      <p className="text-base text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
        Course
      </p>
    </Link>

    <Link href="profile-tutor/review">
      <p className="text-base text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
        Reviews
      </p>
    </Link>
  </div>
);

export default ProfileNav;
