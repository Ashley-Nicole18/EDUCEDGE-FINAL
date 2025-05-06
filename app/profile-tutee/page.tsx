
import ProfileTutee from "@/components/profile/ProfileTutee";
import TuteeProfileNav from "@/components/TuteeProfileNav"

export default function Home() {
  return (
    <div className="min-h-screen pt-10 mr-1">
      <TuteeProfileNav/>
    <div className="flex items-center justify-center min-h-screen">
      <ProfileTutee />
    </div>
    </div>

  );
}
