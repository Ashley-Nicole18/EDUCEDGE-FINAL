'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth} from '@/app/firebase/config';
import { db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';

export default function SelectRole() {
  const router = useRouter();
  const [hoveredSide, setHoveredSide] = useState<'tutor' | 'student' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/sign-in');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleRoleSelect = async (role: 'student' | 'tutor') => {
    const user = auth.currentUser;
    if (!user) return;

    // ✅ Save role to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      role: role,
      email: user.email,
      createdAt: new Date(),
    }, { merge: true });

    // ✅ Navigate to dashboard
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-100">
      <div className="flex flex-1 h-screen relative">
        {/* Triangle Logo */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 w-[40vw] h-[20vh] flex items-start justify-center">
          <div className="w-0 h-0 border-l-[20vw] border-r-[20vw] border-t-[15vh] border-l-transparent border-r-transparent border-t-white relative">
            <div className="absolute top-[-28vh] left-1/2 transform -translate-x-1/2 w-[400px]">
              <Image
                src="/img/EDUCEDGE.png"
                alt="EducEdge Logo"
                width={450}
                height={135}
                className="drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Tutor Section */}
        <button
          onClick={() => handleRoleSelect('tutor')}
          onMouseEnter={() => setHoveredSide('tutor')}
          onMouseLeave={() => setHoveredSide(null)}
          className={`flex-1 relative overflow-hidden transition-all duration-300 pt-[15vh] ${
            hoveredSide === 'student' ? 'brightness-95' : ''
          }`}
        >
          <div
            className={`absolute inset-0 bg-[#16dad5] ${
              hoveredSide === 'tutor' ? 'scale-105 brightness-110' : ''
            } transition-all duration-300`}
          />
          <div className="relative h-full flex flex-col items-center justify-center p-8 z-10">
            <div className="relative mb-8 w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 transition-all">
              <Image
                src="/img/ttt.png"
                alt="Tutor"
                fill
                className={`object-cover transition-transform ${
                  hoveredSide === 'tutor' ? 'scale-110' : 'scale-100'
                }`}
              />
            </div>
            <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Tutor</h2>
            <p className="text-xl text-white/90 mb-8 max-w-md text-center drop-shadow-md">
              Empower students with your knowledge and expertise
            </p>
            <div
              className={`px-12 py-5 bg-white/90 text-[#16dad5] text-xl font-semibold rounded-xl border-2 border-white transition-all ${
                hoveredSide === 'tutor' ? 'scale-105 shadow-lg shadow-cyan-400/40' : 'shadow-md'
              }`}
            >
              Teach Now
            </div>
          </div>
        </button>

        {/* Student Section */}
        <button
          onClick={() => handleRoleSelect('student')}
          onMouseEnter={() => setHoveredSide('student')}
          onMouseLeave={() => setHoveredSide(null)}
          className={`flex-1 relative overflow-hidden transition-all duration-300 pt-[15vh] ${
            hoveredSide === 'tutor' ? 'brightness-95' : ''
          }`}
        >
          <div
            className={`absolute inset-0 bg-[#446090] ${
              hoveredSide === 'student' ? 'scale-105 brightness-110' : ''
            } transition-all duration-300`}
          />
          <div className="relative h-full flex flex-col items-center justify-center p-8 z-10">
            <div className="relative mb-8 w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 transition-all">
              <Image
                src="/img/sss.png"
                alt="Student"
                fill
                className={`object-cover transition-transform ${
                  hoveredSide === 'student' ? 'scale-110' : 'scale-100'
                }`}
              />
            </div>
            <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Student</h2>
            <p className="text-xl text-white/90 mb-8 max-w-md text-center drop-shadow-md">
              Find the perfect tutor to help you achieve your goals
            </p>
            <div
              className={`px-12 py-5 bg-white/90 text-[#446090] text-xl font-semibold rounded-xl border-2 border-white transition-all ${
                hoveredSide === 'student' ? 'scale-105 shadow-lg shadow-blue-400/40' : 'shadow-md'
              }`}
            >
              Learn Now
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
