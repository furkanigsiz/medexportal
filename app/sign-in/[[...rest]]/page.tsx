'use client'

import { SignIn, SignUp, useUser } from '@clerk/nextjs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [isSignUp, setIsSignUp] = useState(false)
  const { isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medex Portal</h1>
          <p className="text-gray-600">Şirket içi intranet portalına hoş geldiniz</p>
        </div>


        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          {isSignUp ? (
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
                  socialButtonsBlockButtonText: 'text-gray-700',
                  formFieldInput: 'border-gray-200 focus:border-blue-600 focus:ring-blue-600',
                  footerActionLink: 'text-blue-600 hover:text-blue-700',
                }
              }}
              afterSignUpUrl="/"
              redirectUrl="http://localhost:3002/"
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
                  socialButtonsBlockButtonText: 'text-gray-700',
                  formFieldInput: 'border-gray-200 focus:border-blue-600 focus:ring-blue-600',
                  footerActionLink: 'text-blue-600 hover:text-blue-700',
                }
              }}
              redirectUrl="http://localhost:3002/"
            />
          )}
        </div>


        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
          </button>
        </div>
      </div>
    </div>
  )
}
