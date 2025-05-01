'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProfileTutor from '../components/ProfileTutor';
import UpperText from '@/components/UpperText';

export default function LandingPage() {
  const router = useRouter();

  const handleBookingClick = () => {
    router.push('/booking'); // Navigates to /booking
  };

  return (
    <div className="min-h-screen font-sans flex flex-col relative overflow-auto">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/img/bglanding.png"
          alt="Educational background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 backdrop-blur-sm"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm py-3 px-6 sm:px-12 flex items-center justify-between h-16 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Image
            src="/img/EDUCEDGE.png"
            alt="EducEdge logo"
            width={180}
            height={70}
            className="object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-16 px-6 sm:px-12 flex flex-col items-center space-y-20 relative z-10">
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to EducEdge</h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Connect with expert tutors. Book your session easily and efficiently.
          </p>
          <button
            onClick={handleBookingClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book a Tutor
          </button>
        </section>
      </main>

      {/* Profile Section */}
      <div className="relative w-screen h-screen overflow-hidden z-10">
        <Image
          src="/img/Background.png"
          alt="Test image"
          fill
          className="absolute inset-0 z-0 object-cover"
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
          <div className="bg-white rounded shadow-lg px-20 py-10 w-full max-w-6xl text-black">
            <ProfileTutor />
          </div>
        </main>

        <div className="absolute inset-0 px-40 flex flex-col items-center justify-center">
          <UpperText />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 w-full relative z-10">
        <div className="container mx-auto px-6">
          {/* Footer content goes here */}
          <p className="text-center">&copy; {new Date().getFullYear()} EducEdge. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          title="Quick Action Menu"
          onClick={handleBookingClick}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-colors hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}