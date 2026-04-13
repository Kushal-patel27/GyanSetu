/**
 * ===================================================================
 * MERN STACK PRODUCTION DEPLOYMENT - ENVIRONMENT & AUTH SETUP GUIDE
 * ===================================================================
 * 
 * This document explains the fixes applied to resolve deployment issues
 * with the GyaanSetu chat application on Render.
 */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 1. PROBLEM: Why 401 Unauthorized Was Happening
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ROOT CAUSES:
 * 
 * A) Cookies Not Being Sent with Cross-Origin Requests
 *    - Frontend at https://gyansetu-n28h.onrender.com
 *    - Backend at https://gyansetu-n28h.onrender.com/api (CORS request)
 *    - Browser blocks cookies by default in cross-origin requests
 *    - Fix: axios.create({ withCredentials: true })
 * 
 * B) Incorrect Cookie Configuration in Production
 *    - sameSite: "lax" prevents cookies in cross-origin requests
 *    - secure: false doesn't set cookies over HTTPS
 *    - Fix: sameSite: "none" + secure: true (in production)
 * 
 * C) CORS Headers Not Allowing Credentials
 *    - Backend didn't include: Access-Control-Allow-Credentials: true
 *    - This header is required when sending cookies cross-origin
 *    - Fix: cors({ credentials: true })
 * 
 * ✅ SOLUTION: All three components now work together:
 *    Frontend:  withCredentials: true (sends cookies)
 *    Backend:   credentials: true (accepts cookies)
 *    Cookies:   secure + sameSite: "none" (enables cross-origin cookies)
 */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 2. PROBLEM: Why localhost URLs Fail After Deployment
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ROOT CAUSE:
 * 
 * Hardcoded Localhost in Frontend Code
 * - Development: API at http://localhost:5001 ✓
 * - Production: API still points to http://localhost:5001 ✗
 * - Browser can't reach localhost from deployed site
 * - All API calls fail silently or with CORS errors
 * 
 * The Old Problem:
 *   const API_URL = "http://localhost:5001/api";  // ❌ hardcoded
 *   fetch(`${API_URL}/messages`);
 * 
 * ✅ SOLUTION: Use environment variables
 *   Development (.env):
 *     VITE_API_URL=http://localhost:5001/api
 * 
 *   Production (.env.production):
 *     VITE_API_URL=https://gyansetu-n28h.onrender.com/api
 * 
 *   Access in code:
 *     const apiUrl = import.meta.env.VITE_API_URL;  // ✓ dynamic
 */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 3. FILES THAT WERE FIXED
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * FRONTEND: .env.production
 * ─────────────────────────
 * Location: frontend/.env.production
 * 
 * VITE_API_URL=https://gyansetu-n28h.onrender.com/api
 * VITE_SOCKET_URL=https://gyansetu-n28h.onrender.com
 * 
 * Why .env.production?
 * - Vite automatically uses .env.production when building
 * - Build command: npm run build (automatically loads .env.production)
 * - Ensures production URLs are baked into the build
 */

/**
 * FRONTEND: src/lib/axios.js
 * ───────────────────────────
 * Centralized Axios instance that:
 * 
 * 1. Reads from environment variables
 *    - Primary: import.meta.env.VITE_API_URL
 *    - Fallback: import.meta.env.VITE_API_BASE_URL
 *    - Local default: http://localhost:5001/api
 * 
 * 2. Enables withCredentials: true
 *    - Automatically sends cookies with every request
 *    - Required for authentication to work
 * 
 * 3. Provides response interceptor
 *    - Warns about 401 errors (missing/expired tokens)
 *    - Can trigger logout on 401 (already handled in stores)
 * 
 * USAGE IN COMPONENTS:
 * ────────────────────
 * import { axiosInstance } from "../lib/axios";
 * 
 * // Simple GET
 * const res = await axiosInstance.get("/messages/users");
 * 
 * // With parameters
 * const res = await axiosInstance.get(`/messages/${userId}`);
 * 
 * // POST request
 * const res = await axiosInstance.post("/messages/send/123", { text: "Hi" });
 * 
 * // The baseURL is automatically prepended:
 * // GET /messages/users → https://gyansetu-n28h.onrender.com/api/messages/users
 */

/**
 * BACKEND: src/lib/utils.js (Cookie Configuration)
 * ──────────────────────────────────────────────────
 * getCookieOptions() returns:
 * 
 * {
 *   maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
 *   path: "/",
 *   httpOnly: true,                    // Prevents XSS attacks
 *   secure: isProduction,              // HTTPS only in production
 *   sameSite: isProduction ? "none" : "lax"
 * }
 * 
 * WHY THESE SETTINGS?
 * 
 * httpOnly: true
 *   - Prevents JavaScript from accessing cookies
 *   - Only sent automatically with HTTP requests
 *   - Stops XSS attackers from stealing session tokens
 * 
 * secure: true (production)
 *   - Only sends cookie over HTTPS
 *   - HTTP requests don't receive the cookie
 *   - Render uses HTTPS by default
 * 
 * sameSite: "none" (production)
 *   - Allows cross-origin cookie sending
 *   - Required when frontend ≠ backend domain
 *   - MUST be paired with secure: true
 *   - Browser ignores sameSite: "none" without secure: true
 * 
 * sameSite: "lax" (development)
 *   - Works for same-origin and same-site requests
 *   - Allowed in development on localhost
 *   - More restrictive than "none"
 */

/**
 * BACKEND: src/index.js (CORS Configuration)
 * ────────────────────────────────────────────
 * 
 * Allowed Origins:
 * - http://localhost:5173  (Vite dev server)
 * - http://localhost:5174  (Alternative port)
 * - https://gyansetu-n28h.onrender.com  (Production)
 * - process.env.FRONTEND_URL  (Environment variable)
 * 
 * CORS Options:
 * {
 *   origin: (origin, callback) => { ... }  // Validate origin
 *   credentials: true,                       // Allow cookies
 *   methods: ["GET", "POST", ...],          // Allowed methods
 *   allowedHeaders: ["Content-Type", ...]   // Allowed headers
 * }
 * 
 * WHY credentials: true?
 * ─────────────────────
 * - Tells browser to include cookies in cross-origin requests
 * - Without this, authentication fails (cookies not sent)
 * - Must be paired with withCredentials on frontend
 * 
 * WHY custom origin function?
 * ──────────────────────────
 * - Allows localhost on any port (for development flexibility)
 * - Whitelist production URLs
 * - Logs rejected origins for debugging
 * - Prevents incorrect origins from accessing the API
 */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 4. EXAMPLE API CALL (Before & After)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * BEFORE (❌ Problematic):
 * 
 * const getUsers = async () => {
 *   try {
 *     // ❌ Hardcoded localhost
 *     // ❌ No credentials
 *     // ❌ Fails in production
 *     const res = await fetch("http://localhost:5001/api/messages/users", {
 *       method: "GET",
 *     });
 *     const users = await res.json();
 *     return users;
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 */

/**
 * AFTER (✅ Production-Ready):
 * 
 * import { axiosInstance } from "../lib/axios";
 * 
 * const getUsers = async () => {
 *   try {
 *     // ✅ Uses environment variables
 *     // ✅ Automatically includes credentials
 *     // ✅ Works in dev and production
 *     const res = await axiosInstance.get("/messages/users");
 *     return normalizeArrayPayload(res.data);
 *   } catch (error) {
 *     if (error?.response?.status === 401) {
 *       // User session expired - redirect to login
 *       useAuthStore.getState().clearAuthState();
 *     }
 *     throw error;
 *   }
 * };
 */

/**
 * ACTUAL CODE (from useChatStore.js):
 * 
 * getUsers: async () => {
 *   set({ isUsersLoading: true });
 *   try {
 *     const res = await axiosInstance.get("/messages/users");
 *     set({ users: normalizeArrayPayload(res.data) });
 *   } catch (error) {
 *     if (error?.response?.status === 401) {
 *       useAuthStore.getState().clearAuthState();
 *       toast.error("Session expired. Please log in again.");
 *       set({ users: [] });
 *       return;
 *     }
 *     toast.error(error?.response?.data?.message || "Failed to load users");
 *     set({ users: [] });
 *   } finally {
 *     set({ isUsersLoading: false });
 *   }
 * },
 */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 5. DEPLOYMENT CHECKLIST
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Before deploying to Render, verify:
 * 
 * FRONTEND:
 * ☑ .env.production exists with correct Render URLs
 * ☑ All API calls use axiosInstance (not fetch or hardcoded URLs)
 * ☑ npm run build succeeds locally
 * ☑ Built dist/ folder uses production URLs (check Network tab)
 * 
 * BACKEND:
 * ☑ Backend deployed at: https://gyansetu-n28h.onrender.com
 * ☑ NODE_ENV=production set in Render environment
 * ☑ JWT_SECRET set in .env on Render
 * ☑ CORS allowedOrigins includes your frontend Render URL
 * ☑ Cookies have secure: true, sameSite: "none" in production
 * 
 * RENDER ENVIRONMENT VARIABLES:
 * ☑ Set FRONTEND_URL=<your-frontend-render-url>
 * ☑ Set NODE_ENV=production
 * ☑ Set PORT=<whatever Render assigns>
 * ☑ Set database URL
 * ☑ Set JWT_SECRET
 * 
 * TESTING:
 * ☑ Login works and sets cookie
 * ☑ Refresh page - still logged in (cookie persists)
 * ☑ Cookies sent in Network tab → Cookies section
 * ☑ No 401 errors on protected routes
 * ☑ No CORS errors in browser console
 */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 6. DEBUGGING TIPS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Check if cookies are being sent:
 * 1. Open browser DevTools → Network tab
 * 2. Click on an API request
 * 3. Check "Cookies" section
 * 4. Should see "jwt" cookie with token value
 * 
 * If jwt cookie not present:
 * - Check withCredentials: true in axios
 * - Check credentials: true in backend CORS
 * - Check cookie settings (httpOnly, secure, sameSite)
 * 
 * Getting 401 Unauthorized:
 * 1. Check if jwt cookie exists (see above)
 * 2. Check if token is expired (7 days)
 * 3. Check if JWT_SECRET matches on backend
 * 4. Check Authorization header (shouldn't be used with cookies)
 * 
 * Getting CORS error:
 * 1. Check origin in Network → Response Headers → ACAO
 * 2. Should match your frontend URL exactly
 * 3. Check credentials: true in CORS options
 * 4. Check Access-Control-Allow-Credentials header
 * 
 * Getting "Cannot find module" errors:
 * 1. Check import statements use correct paths
 * 2. Verify files exist at specified paths
 * 3. Check file extensions (should be .js, not .mjs)
 */

export const DEPLOYMENT_DOCS = {
  version: "1.0",
  lastUpdated: "2026-04-13",
  status: "Production-Ready",
};
