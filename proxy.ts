import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

// Basic in-memory rate limiter (Warning: limited effectiveness in serverless due to cold starts/multiple instances)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 100; // requests per window

export async function proxy(request: NextRequest) {
  // 1. Rate Limiting Check
  // Note: For Next.js 13+, rely on headers rather than request.ip
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown-ip';
  const now = Date.now();

  let requestData = rateLimitMap.get(ip);
  
  // If no data or window expired, reset
  if (!requestData || now - requestData.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
  } else {
    // Increment count
    requestData.count++;
    rateLimitMap.set(ip, requestData);

    // Block if over limit
    if (requestData.count > MAX_REQUESTS_PER_WINDOW) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests' }),
        { 
          status: 429, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  }

  // 2. Pass to auth middleware
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     * - fonts (public fonts)
     * - images (public images)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|assets|fonts|images|favicon).*)',
  ],
}
