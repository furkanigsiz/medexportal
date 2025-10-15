// Geçici olarak authentication devre dışı
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isProtectedRoute = createRouteMatcher([
//   '/admin(.*)',
//   '/tickets(.*)',
//   '/documents(.*)',
//   '/events(.*)',
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();

//   // Protected routes için authentication kontrolü
//   if (isProtectedRoute(req)) {
//     if (!userId) {
//       return Response.redirect(new URL('/sign-in', req.url));
//     }
//   }
// });

// Geçici olarak middleware devre dışı
export default function middleware() {
  // Authentication kontrolü yok - direkt geçiş
  return;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};