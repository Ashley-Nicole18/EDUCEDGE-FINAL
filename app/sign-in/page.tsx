'use client';

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';
import { useState } from 'react';
import { auth } from '@/app/firebase/config';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    return email.endsWith('@cpu.edu.ph');
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please use a valid CPU email address (@cpu.edu.ph)');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (e) {
      const error = e as AuthError;
      switch (error.code) {
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/user-not-found':
          setError('Email not registered');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user.email?.endsWith('@cpu.edu.ph')) {
        await auth.signOut();
        setError('Please use a CPU Google account (@cpu.edu.ph)');
        return;
      }
      router.push('/dashboard');
    } catch (e) {
      const error = e as AuthError;
      setError(error.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left Side: Blurred Background */}
      <div className="relative hidden md:block">
        <Image
          src="/img/bg.png"
          alt="Background"
          fill
          className="object-cover"

          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Right Side: Sign-In Panel */}
     
      <div className="flex items-center justify-center bg-white md:px-10">
      <div className="w-full max-w-md ">
    <div className="flex flex-col items-center mb-10"> 
    <Image
        src="/img/logomain.jpg"
        alt="EducEdge Logo"
        width={240}
        height={240}
        className="object-contain mb-10" 
        priority
      />
      
      <h2 className="text-2xl font-bold text-gray-800  mb-5">Welcome Back</h2>
    

            <form onSubmit={handleSignIn} className="w-full space-y-6">
              {error && (
                <div className="text-red-500 text-center p-3 rounded-lg bg-red-50">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 text-lg text-black rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30"
                  placeholder="you@cpu.edu.ph"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pr-12 text-lg text-black rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>


              <button
                type="submit"
                disabled={loading}
                className={`w-full p-4 rounded-xl text-white font-semibold text-xl ${
                  loading ? 'bg-[#446090]/70' : 'bg-[#446090] hover:bg-[#446090]/90'
                }`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="w-full flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
            >
              <Image src="/img/gool.png" alt="Google" width={24} height={24} />
              <span>Sign in with Google</span>
            </button>

            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/sign-up')}
                  className="text-[#446090] font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}
