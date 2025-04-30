
import Image from "next/image";
import ProfileTutorCourse from "../components/ProfileTutorCourse";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      <Image
        src="/img/Background.png"
        alt="Test image"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />

      
      <div className="absolute top-0 left-5 z-20 p-2">
        <Image
          src="/img/logow.PNG"
          alt="logowhite"
          width={144} 
          height={50} 
        />
      </div>

      
      <main className="absolute inset-0 z-10 left-40 flex flex-col items-center justify-center p-8 text-white">
        <div className="bg-white rounded shadow-lg px-30 p-50 w-full max-w-6xl text-black">
          <ProfileTutorCourse/>
        </div>
      </main>
    </div>
  );
}

