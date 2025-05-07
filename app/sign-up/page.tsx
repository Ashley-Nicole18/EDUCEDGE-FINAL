'use client';

import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, AuthError } from 'firebase/auth';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
                      className="w-full p-6 text-xl text-black rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30 transition-all"
                      placeholder="you@cpu.edu.ph"
                      required
                    />

                  </div>

                  <div className="space-y-6">
                    <label className="block text-2xl font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-6 pr-16 text-xl text-black rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30 transition-all"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-4 flex items-center text-[#446090] text-sm font-medium hover:underline"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-2xl font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-6 pr-16 text-xl rounded-xl bg-gray-50 border border-gray-200 focus:border-[#446090] focus:ring-2 focus:ring-[#446090]/30 transition-all text-black"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-4 flex items-center text-[#446090] text-sm font-medium hover:underline"
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
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