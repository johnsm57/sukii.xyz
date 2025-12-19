"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import RegisterImage from "@/public/register-image.svg";
import Image from "next/image";
import decorStar from "@/public/decoratives/decor-star.svg";
import Header from "@/components/Header";
import { useAuth } from "@/features/authentication";
import { EmailSignup } from "@/features/authentication";

export default function Signup() {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Auth hook and router with safety check
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Add a mounted state to prevent router usage before component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if already authenticated - only after component is mounted
  useEffect(() => {
    if (isAuthenticated) {
    const redirectPath = searchParams.get('page');
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push('/'); // Default redirect
    }
  }
  }, [isAuthenticated]);

  // Google signup handler
  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      setErrors({}); // Clear any existing errors

      await loginWithGoogle();
      // Successful login will trigger the useEffect redirect
    } catch (error) {
      console.error("Google signup error:", error);

      // Handle different error types
      let errorMessage =
        "An error occurred during Google sign-up. Please try again.";

      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-up was cancelled. Please try again.";
          break;
        case "auth/popup-blocked":
          errorMessage =
            "Pop-up was blocked. Please allow pop-ups and try again.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage =
            "An account already exists with this email using a different sign-in method.";
          break;
      }

      setErrors({ google: errorMessage });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        {/* Decorative stars */}
        <div className="absolute top-16 right-1/4 w-4 h-4 bg-white rounded-full opacity-80 animate-pulse" />
        <div className="absolute top-1/3 left-16 w-2 h-2 bg-white rounded-full opacity-60" />
        <div className="absolute bottom-1/4 right-16 w-3 h-3 bg-white rounded-full opacity-70 animate-pulse" />
        <Image
          src={decorStar}
          alt="Decorative star"
          className="absolute top-10 left-10 w-6 h-6 opacity-50 animate-spin"
        />
        <Image
          src={decorStar}
          alt="Decorative star"
          className="absolute bottom-10 right-10 w-8 h-8 opacity-50 animate-bounce"
        />
        <Image
          src={decorStar}
          alt="Decorative star"
          className="absolute top-1/4 left-1/4 w-5 h-5 opacity-50 animate-pulse"
        />

        {/* Main container */}
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          {/* Modal Background */}
          <div className="w-full max-w-7xl bg-black/60 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl p-8 lg:p-12">
            <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left side - Illustration */}
              <div className="hidden lg:flex justify-center items-center">
                <div className="relative">
                  <Image
                    src={RegisterImage}
                    alt="Laptop with login interface"
                    width={600}
                    height={500}
                    className="w-full h-auto max-w-lg"
                  />
                </div>
              </div>

              {/* Right side - Form */}
              <div className="w-full max-w-md mx-auto lg:mx-0">
                <div className="text-center mb-8">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Welcome to Sukii.xyz
                  </h1>
                </div>

                <div className="space-y-6">
                  {/* Google Error Display */}
                  {errors.google && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3">
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <X className="w-4 h-4" />
                        {errors.google}
                      </p>
                    </div>
                  )}

                  {/* Google signup button */}
                  <button
                    type="button"
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 px-4 rounded-md text-base font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGoogleSignup}
                    disabled={googleLoading || isSubmitting}
                  >
                    {googleLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                        Signing up with Google...
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Register through Google
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-400/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-gray-300 font-medium">
                        or
                      </span>
                    </div>
                  </div>

                  {/* Email/Password Form */}
                  <EmailSignup className="w-full" />
                  {/* Terms and conditions */}
                  <div className="text-sm text-gray-400">
                    By signing up, you agree to our{" "}
                    <Link
                      href="#"
                      className="text-white underline hover:text-purple-300 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="text-white underline hover:text-purple-300 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </div>
                </div>

                {/* Sign in link */}
                <div className="text-center mt-6 text-sm text-gray-300">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-white underline hover:text-purple-300 transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
