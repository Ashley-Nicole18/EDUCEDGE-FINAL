import ProfileTutor from "@/components/profile/ProfileTutor";
import ProfileNav from "@/components/ProfileNav";

export default function Home() {
  return (
    <div className="min-h-screen pt-10 mr-30"> 
      <ProfileNav />

      <div className="flex justify-center items-center p-8">
        <ProfileTutor />
      </div>
    </div>
  );
}
