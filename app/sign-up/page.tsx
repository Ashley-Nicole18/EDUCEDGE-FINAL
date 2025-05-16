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
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    return email.endsWith('@cpu.edu.ph');
  };

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
      // verify google account domain
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

      {/* Right Side: Sign-Up Form with background */}
      <div className="flex items-center justify-center bg-white md:px-10">
        <div className="w-full max-w-md ">
          <div className="flex flex-col items-center mb-5">
            <Image
              src="/img/logomain.jpg"
              alt="EducEdge Logo"
              width={240}
              height={240}
              className="object-contain mb-5"
              priority
            />

            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>

            <form onSubmit={handleSignup} className="w-full space-y-6">
              {error && (
                <div className="text-red-500 text-center p-3 rounded-lg bg-red-50">
                  {error}
                </div>
              )}

              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-4 pr-12 text-lg text-black rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30"
                    placeholder="Confirm your password"
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

            <div className="text-center mt-4">
              <p className="text-gray-600">
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
      </div>
    </div>
  );
}
