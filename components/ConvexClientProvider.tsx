'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
// Geçici olarak Clerk auth devre dışı
// import { ConvexProviderWithClerk } from 'convex/react-clerk'
// import { useAuth } from '@clerk/nextjs'
import { ConvexProvider } from 'convex/react'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    // Geçici olarak Clerk auth devre dışı
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
    // <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
    //   {children}
    // </ConvexProviderWithClerk>
  )
}