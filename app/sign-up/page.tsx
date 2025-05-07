'use client';

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';
import { useState } from 'react';
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

  const validateEmail = (email: string) => email.endsWith('@cpu.edu.ph');

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please use a valid CPU email address (@cpu.edu.ph)');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/role-selection');
    } catch (e) {
      const error = e as AuthError;
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Email already registered');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters');
          break;
        default:
          setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user.email?.endsWith('@cpu.edu.ph')) {
        await auth.signOut();
        setError('Please use a CPU Google account (@cpu.edu.ph)');
        return;
      }
      router.push('/role-selection');
    } catch (e) {
      const error = e as AuthError;
      setError(error.message || 'Google sign-up failed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="relative hidden md:block">
        <Image
          src="/img/bg.png"
          alt="Background"
          fill
          className="object-cover"
          style={{ filter: 'blur(4px)' }}
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="flex items-center justify-center bg-white p-6 md:px-12">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Consistent Logo & Header */}
          <div className="flex flex-col items-center mb-6 min-h-[180px]">
            <Image
              src="/img/EDUCEDGE.png"
              alt="EducEdge Logo"
              width={240}
              height={240}
              className="object-contain"
              priority
            />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Create Account</h2>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSignup} className="w-full space-y-4">
            {error && (
              <div className="text-red-500 text-center p-3 rounded-lg bg-red-50">
                {error}
              </div>
            )}

            <div>
              <label className="block text-lg font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 text-lg rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30"
                placeholder="you@cpu.edu.ph"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 text-lg rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 text-lg rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-xl text-white font-semibold text-xl ${
                loading ? 'bg-[#446090]/70' : 'bg-[#446090] hover:bg-[#446090]/90'
              }`}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="w-full flex items-center my-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
          >
            <Image src="/img/gool.png" alt="Google" width={24} height={24} />
            <span>Sign up with Google</span>
          </button>

          <p className="text-gray-600 mt-4">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/sign-in')}
              className="text-[#446090] font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
