'use client'

import { useUser, SignOutButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
  const { user, isLoaded } = useUser()
  const convexUser = useQuery(api.users.getCurrentUser)

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Debug Sayfası</h1>
          <SignOutButton>
            <Button variant="outline" size="sm">
              Çıkış Yap
            </Button>
          </SignOutButton>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2">
              <p><strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Not Set'}</p>
              <p><strong>CLERK_SECRET_KEY:</strong> {process.env.CLERK_SECRET_KEY ? '✅ Set' : '❌ Not Set'}</p>
              <p><strong>NEXT_PUBLIC_CONVEX_URL:</strong> {process.env.NEXT_PUBLIC_CONVEX_URL ? '✅ Set' : '❌ Not Set'}</p>
              <p><strong>CLERK_FRONTEND_API_URL:</strong> {process.env.CLERK_FRONTEND_API_URL ? '✅ Set' : '❌ Not Set'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Page State</h2>
            <div className="space-y-2">
              <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
              <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'Server-side'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Clerk User State</h2>
            <div className="space-y-2">
              <p><strong>isLoaded:</strong> {isLoaded ? '✅ Yes' : '❌ No'}</p>
              <p><strong>user:</strong> {user ? '✅ Logged in' : '❌ Not logged in'}</p>
              {user && (
                <div className="mt-4 p-4 bg-white rounded">
                  <p><strong>Name:</strong> {user.fullName}</p>
                  <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
                  <p><strong>ID:</strong> {user.id}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Convex User State</h2>
            <div className="space-y-2">
              <p><strong>convexUser:</strong> {convexUser ? '✅ Found' : '❌ Not found'}</p>
              {convexUser && (
                <div className="mt-4 p-4 bg-white rounded">
                  <p><strong>Name:</strong> {convexUser.name}</p>
                  <p><strong>Email:</strong> {convexUser.email}</p>
                  <p><strong>Role:</strong> {convexUser.role}</p>
                  <p><strong>Created:</strong> {new Date(convexUser.createdAt).toLocaleString('tr-TR')}</p>
                </div>
              )}
              {!convexUser && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800">
                    <strong>Not:</strong> Kullanıcı Convex'te bulunamadı. Ana sayfaya gidip tekrar deneyin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
