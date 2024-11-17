import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define role-based route access
const roleBasedRoutes = {
  admin: ['/dashboard', '/accessmanagers', '/accessagent', '/query', '/manager'],
  manager: ['/managerdashboard', '/manageraccessagents', '/managerquery'],
  agent: ['/agent'],
};

// Middleware function to handle authentication and role-based authorization
export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // If no token and user tries to access a protected page, redirect to signin
    if (request.nextUrl.pathname !== '/signin') {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next(); // Allow access to sign-in page
  }

  // Decode the JWT token (ensure you use a proper method or library like `jsonwebtoken` in a server-side context)
  let user;
  try {
    user = JSON.parse(atob(token.split('.')[1])); // Decode payload of JWT (if you're using JWT)
  } catch (error) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If user is signed in and tries to access the sign-in page again, redirect to dashboard or first allowed page
  if (request.nextUrl.pathname === '/signin') {
    const userRole = user.role as 'admin' | 'manager' | 'agent';
    const redirectPath = roleBasedRoutes[userRole][0] || '/dashboard'; // Default redirect to first allowed route
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Get user role from the decoded token
  const userRole = user.role as 'admin' | 'manager' | 'agent';

  // Define the allowed paths for the user role
  const allowedPaths = roleBasedRoutes[userRole] || [];

  // Check if the requested URL matches the user's role permissions
  const isAuthorized = allowedPaths.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isAuthorized) {
    // If not authorized, redirect to signin
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next(); // Continue to the requested page
}

// Configure the matcher to apply middleware to all protected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/accessmanagers/:path*',
    '/accessagent/:path*',
    '/query/:path*',
    '/agent/:path*',
    '/manager/:path*',
    '/managerdashboard/:path*',
    '/manageraccessagents/:path*',
    '/managerquery/:path*',
    '/signin',  // Add /signin to the matcher so it's processed by the middleware
  ],
};
