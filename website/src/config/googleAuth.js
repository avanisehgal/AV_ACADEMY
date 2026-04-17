// ─── Google OAuth Configuration ──────────────────────────────────────────────
//
// To enable "Continue with Google" sign-in:
//
// 1. Go to https://console.cloud.google.com/
// 2. Create or select a project
// 3. Navigate to: APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
// 4. Application type: Web application
// 5. Authorized JavaScript origins:
//      http://localhost:5173          (for development)
//      https://yourdomain.com         (for production)
// 6. Copy the Client ID and paste it below (replacing the empty string)
//
// ─────────────────────────────────────────────────────────────────────────────

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''; 

