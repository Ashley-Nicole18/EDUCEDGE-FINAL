'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {});
    return () => unsubscribe();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data();

      if (userData?.role === 'tutor') {
        router.push('/dashboard/tutor');
      } else if (userData?.role === 'student') {
        router.push('/dashboard/student');
      } else {
        router.push('/role-selection');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data();

      if (userData?.role === 'tutor') {
        router.push('/dashboard/tutor');
      } else if (userData?.role === 'student') {
        router.push('/dashboard/student');
      } else {
        router.push('/role-selection');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image src="/img/bg.png" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative min-h-screen flex justify-end transform scale-100 origin-right">
        <div className="w-1/2 min-w-[600px]">
          <div className="h-full w-full flex items-center justify-start pl-8">
            <div className="w-[95%] min-h-[90vh] bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 flex flex-col justify-center my-8">
              <div className="max-w-lg mx-auto w-full space-y-10">
                <div className="flex justify-center">
                  <Image src="/img/EDUCEDGE.png" alt="EducEdge Logo" width={320} height={320} className="mb-8" priority />
                </div>

                <h2 className="text-5xl font-extrabold text-gray-800 text-center">Sign In</h2>

                <form onSubmit={handleSignIn} className="space-y-10">
                  {error && (
                    <div className="text-red-500 text-xl text-center p-4 rounded-lg bg-red-50">{error}</div>
                  )}

                  <div className="space-y-6">
                    <label className="block text-2xl font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-6 text-xl rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30 transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-6">
                    <label className="block text-2xl font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-6 text-xl rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30 transition-all"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-6 rounded-xl text-white font-semibold text-2xl transition-all ${
                      loading ? 'bg-[#446090]/70' : 'bg-[#446090] hover:bg-[#446090]/90 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>

                <div className="text-center">
                  <button className="text-xl text-[#446090] hover:underline font-medium">Forgot Password?</button>
                </div>

                <div className="flex items-center my-10">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-4 text-gray-400 text-xl">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center gap-4 w-full p-5 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-700 font-medium text-xl"
                >
                  <Image src="/img/gool.png" alt="Google" width={32} height={32} />
                  Sign in with Google
                </button>

                <div className="text-center mt-10">
                  <p className="text-xl text-gray-600">
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => router.push('/sign-up')}
                      className="text-[#446090] font-semibold hover:underline text-xl"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
