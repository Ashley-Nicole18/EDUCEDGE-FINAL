'use client';

import Image from "next/image";
import {useRouter} from 'next/navigation';


export default function LandingPage() {
  const router = useRouter();

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
        <Image
          src="/img/EDUCEDGE.png"
          alt="EducEdge logo"
          width={180}
          height={70}
          className="object-contain hover:scale-105 transition-transform duration-300"
        />
      </header>

      {/* Hero Section */}
      <main className="flex-grow pt-28 pb-16 px-6 sm:px-12 flex flex-col items-center space-y-20 z-10">
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to EducEdge</h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Connect with expert tutors. Book your session easily and efficiently.
          </p>
        </section>

        <section className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full text-center transform hover:scale-[1.01] transition-all duration-500">
          <div className="animate-float">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Transform Your Learning Experience
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Personalized education tools designed to help you achieve your academic goals faster and smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/sign-in')}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push('/sign-up')}
                className="px-8 py-4 rounded-full border-2 border-blue-500 text-blue-600 font-semibold shadow-lg hover:scale-105 transition-all"
              >
                Join Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 w-full z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Add links/info for each footer column */}
            <div><h3 className="text-lg font-bold mb-2">About</h3><p>EducEdge is a smart tutoring platform.</p></div>
            <div><h3 className="text-lg font-bold mb-2">Links</h3><ul><li><a href="#features">Features</a></li></ul></div>
            <div><h3 className="text-lg font-bold mb-2">Support</h3><p>Contact us at support@educedge.com</p></div>
            <div><h3 className="text-lg font-bold mb-2">Social</h3><p>Follow us on social media</p></div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 EducEdge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
