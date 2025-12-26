import { Suspense } from 'react'
import Signup from "@/features/authentication/signup/Signup";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <Signup />
    </Suspense>
  )
}
