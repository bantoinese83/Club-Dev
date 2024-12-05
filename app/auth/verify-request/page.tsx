'use client'
import React from "react";

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function VerifyRequestPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Verify your email</h3>
        <p className="mt-4">
          A verification email has been sent to your email address. Please check your inbox and click the verification link to activate your account.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/auth/signin">Go to Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

