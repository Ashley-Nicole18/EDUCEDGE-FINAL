'use client';

import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '@/app/firebase/config';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log({ res });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      router.push('/role-selection');
    } catch (e: any) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      console.log({ res });
      router.push('/role-selection');
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/img/bg.png"
          alt="Background"
          fill
          className="object-cover"
          style={{ filter: 'blur(0px)' }}
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative min-h-screen flex justify-end transform scale-100 origin-right">
        <div className="w-1/2 min-w-[600px]">
          <div className="h-full w-full flex items-center justify-start pl-8">
            <div className="w-[95%] min-h-[90vh] bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 flex flex-col justify-center my-8">
              <div className="max-w-lg mx-auto w-full space-y-10">
                <div className="flex justify-center">
                  <Image
                    src="/img/EDUCEDGE.png"
                    alt="EducEdge Logo"
                    width={320}
                    height={320}
                    className="object-contain mb-8"
                    priority
                  />
                </div>

                <h2 className="text-5xl font-extrabold text-gray-800 text-center">Create Account</h2>

                <form onSubmit={handleSignup} className="space-y-10">
                  {error && (
                    <div className="text-red-500 text-xl text-center p-4 rounded-lg bg-red-50">
                      {error}
                    </div>
                  )}

                  <div className="space-y-6">
                    <label className="block text-2xl font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-6 text-xl rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30 transition-all text-black"
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
                      className="w-full p-6 text-xl rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30 transition-all text-black"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="space-y-6">
                    <label className="block text-2xl font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-6 text-xl rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30 transition-all text-black"
                      placeholder="Confirm your password"
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
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </form>

                <div className="flex items-center my-10">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-4 text-gray-400 text-xl">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button
                  onClick={handleGoogleSignup}
                  className="flex items-center justify-center gap-4 w-full p-5 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-700 font-medium text-xl"
                >
                  <Image src="/img/gool.png" alt="Google" width={32} height={32} />
                  Sign up with Google
                </button>

                <div className="text-center mt-10">
                  <p className="text-xl text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => router.push('/sign-in')}
                      className="text-[#446090] font-semibold hover:underline text-xl"
                    >
                      Sign In
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