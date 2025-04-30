
'use client';

import Image from "next/image";
import ProfileTutor from "../components/ProfileTutor";
import UpperText from "@/components/UpperText";


import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  return (

    <div className="min-h-screen font-sans flex flex-col relative overflow-auto">
      {/* Enhanced Background with Parallax Effect */}
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

      {/* Modern Top Bar */}
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
        <div className="hidden md:flex space-x-6">
          <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-16 px-6 sm:px-12 flex flex-col items-center space-y-20 relative z-10">
        {/* Hero Section with Floating Animation */}
        <section className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full text-center transform hover:scale-[1.01] transition-all duration-500">
          <div className="animate-float">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Transform Your Learning Experience
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Personalized education tools designed to help you achieve your academic goals faster and smarter.
            </p>
          </div>

          {/* Enhanced Buttons with Gradient Border */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => router.push('/sign-in')}
              className="relative px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button
              onClick={() => router.push('/sign-up')}
              className="relative px-8 py-4 rounded-full border-2 border-blue-500 text-blue-600 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Join Now</span>
              <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </section>

        {/* About Section with Floating Cards */}
        <section id="about" className="max-w-4xl w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl transform hover:scale-[1.01] transition-all duration-500">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose EducEdge?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  icon: "🎯", 
                  title: "Personalized Learning", 
                  desc: "Tailored educational paths based on your unique needs and goals." 
                },
                { 
                  icon: "🚀", 
                  title: "Fast Progress", 
                  desc: "Cutting-edge tools to accelerate your learning journey." 
                },
                { 
                  icon: "👨‍🏫", 
                  title: "Expert Tutors", 
                  desc: "Access to top educators in every subject area." 
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with Hover Effects */}
        <section id="features" className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed in your educational journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[ 
              { 
                title: "Smart Tutoring", 
                desc: "AI-powered matching with the perfect tutor for your learning style.", 
                img: "/img/tutoring.png",
                color: "from-purple-100 to-purple-50"
              },
              { 
                title: "Learning Marketplace", 
                desc: "Access thousands of resources from top educators worldwide.", 
                img: "/img/marketplace.png",
                color: "from-blue-100 to-blue-50"
              },
              { 
                title: "Progress Tracking", 
                desc: "Real-time analytics to monitor your improvement.", 
                img: "/img/quiz.png",
                color: "from-green-100 to-green-50"
              },
            ].map((f, index) => (
              <div 
                key={f.title} 
                className={`bg-gradient-to-br ${f.color} rounded-3xl shadow-lg overflow-hidden hover:-translate-y-2 transition-transform duration-300 group`}
              >
                <div className="relative h-60">
                  <Image 
                    src={f.img} 
                    alt={`${f.title} Feature`} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                  <button className="mt-4 px-6 py-2 rounded-full bg-white text-blue-600 font-medium shadow-sm hover:bg-blue-50 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="max-w-4xl w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: "EducEdge helped me improve my grades significantly in just 3 months!",
                  name: "Sarah Johnson",
                  role: "High School Student"
                },
                {
                  quote: "The personalized learning approach made all the difference for my college prep.",
                  name: "Michael Chen",
                  role: "College Applicant"
                }
              ].map((t, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
                  <div className="flex items-center">
                    <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 w-full relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/img/EDUCEDGE.png"
                alt="EducEdge logo"
                width={180}
                height={70}
                className="object-contain mb-4"
              />
              <p className="text-gray-300">Empowering learners through innovative education technology.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Careers', 'Blog', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Help Center', 'Tutorials', 'Webinars', 'Community'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 EducEdge. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button title="Quick Action Menu" className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-colors hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

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
        <div className="bg-white rounded shadow-lg px-20 p-30 w-full max-w-6xl text-black">
          <ProfileTutor />
        </div>
      </main>

      <div className="absolute inset-0 px-40 flex flex-col items-center justify-center">
        <UpperText/>

      </div>
    </div>
  );
}