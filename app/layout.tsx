import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
// Geçici olarak Clerk devre dışı
// import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'
// import UserInitializer from '@/components/UserInitializer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Medex Intranet Portal',
  description: 'Medex şirket içi intranet portalı',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Geçici olarak Clerk devre dışı */}
        {/* <ClerkProvider> */}
          <ConvexClientProvider>
            {/* <UserInitializer /> */}
            {children}
          </ConvexClientProvider>
        {/* </ClerkProvider> */}
      </body>
    </html>
  )
}
