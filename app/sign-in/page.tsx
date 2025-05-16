'use client'; // Next.js directive marking this as a Client Component

// Firebase authentication imports
import {
  signInWithEmailAndPassword, // For email/password login
  GoogleAuthProvider, // For Google authentication
  signInWithPopup, // For popup-based OAuth login
  AuthError, // Type for Firebase auth errors
} from 'firebase/auth';

// React and Next.js imports
import { useState } from 'react'; // React state management
import { auth } from '@/app/firebase/config'; // Firebase configuration
import Image from 'next/image'; // Next.js optimized image component
import { useRouter } from 'next/navigation'; // Next.js router for navigation
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Eye icons for password toggle

export default function SignInPage() {
  // Router for page navigation
  const router = useRouter();
  
  // State management for form inputs and UI
  const [email, setEmail] = useState(''); // Stores email input
  const [password, setPassword] = useState(''); // Stores password input
  const [error, setError] = useState<string>(''); // Stores error messages
  const [loading, setLoading] = useState<boolean>(false); // Loading state during auth
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility

  // Email validation function (restricted to CPU emails)
  const validateEmail = (email: string) => {
    return email.endsWith('@cpu.edu.ph');
  };

  // Email/password sign-in handler
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please use a valid CPU email address (@cpu.edu.ph)');
      return;
    }

    setLoading(true); // Show loading state

    try {
      // Firebase email/password authentication
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (e) {
      // Handle specific authentication errors
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
      setLoading(false); // Reset loading state
    }
  };

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider(); // Create Google auth provider
    
    try {
      // Open Google sign-in popup
      const result = await signInWithPopup(auth, provider);
      
      // Verify domain restriction
      if (!result.user.email?.endsWith('@cpu.edu.ph')) {
        await auth.signOut(); // Log out if not CPU email
        setError('Please use a CPU Google account (@cpu.edu.ph)');
        return;
      }
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (e) {
      // Handle Google auth errors
      const error = e as AuthError;
      setError(error.message || 'Google sign-in failed');
    }
  };

  // Component UI rendering
  return (
    // Main layout container (responsive grid)
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left side: Decorative background image */}
      <div className="relative hidden md:block">
        <Image
          src="/img/bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
      </div>

      {/* Right side: Sign-in form panel */}
      <div className="flex items-center justify-center bg-white md:px-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            {/* Application logo */}
            <Image
              src="/img/logomain.jpg"
              alt="EducEdge Logo"
              width={240}
              height={240}
              className="object-contain mb-10"
              priority
            />
            
            {/* Page title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Welcome Back</h2>

            {/* Sign-in form */}
            <form onSubmit={handleSignIn} className="w-full space-y-6">
              {/* Error message display */}
              {error && (
                <div className="text-red-500 text-center p-3 rounded-lg bg-red-50">
                  {error}
                </div>
              )}

              {/* Email input field */}
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

              {/* Password input field with visibility toggle */}
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
                  {/* Password visibility toggle button */}
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

              {/* Submit button */}
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

            {/* Divider with "OR" text */}
            <div className="w-full flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google sign-in button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
            >
              <Image src="/img/gool.png" alt="Google" width={24} height={24} />
              <span>Sign in with Google</span>
            </button>

            {/* Sign-up link for new users */}
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