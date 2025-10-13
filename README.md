# Frontend for Centeralized Student Placement System

### Steps to setup project manually

Prerequisites
 - Node.js 20.x (LTS) or newer
 - npm, pnpm, or yarn (examples below use npm)

Quick start (local)

1. Clone the repo

```bash
git clone git@github.com:Ram-Gavhane/tnp-frontend.git
cd tnp-frontend
```

2. Install dependencies

```bash
npm install
# or: pnpm install
# or: yarn install
```

3. Create environment variables

Create a file named `.env.local` in the project root with the values described below. These are required for Auth0 and the SDK to work.

Required environment variables

```env
# Auth0 configuration (get these from your Auth0 tenant - Application must be a "Regular Web Application")
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=        # 32-byte hex string used to encrypt session cookies (eg: openssl rand -hex 32)
APP_BASE_URL=http://localhost:3000

# Optional: if your frontend proxies to a backend, set the backend base url here
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# If your app uses a base path, set it here (leave empty otherwise)
# NEXT_PUBLIC_BASE_PATH=
```

Important Auth0 dashboard settings
- Add `${APP_BASE_URL}/auth/callback` to Allowed Callback URLs
- Add `${APP_BASE_URL}` to Allowed Logout URLs

4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000. The landing page will render server-side and display the signed-in user's name when a session exists.

Auth flows in this project
- The project uses `@auth0/nextjs-auth0` v4 (app-router friendly). The SDK stores sessions in secure, httpOnly cookies so the server can read the session during SSR. Routes mounted by the SDK are exposed under `/auth/*` by the included server client and middleware.
- There is a proxy API at `/api/my-proxy/*` that forwards requests to `NEXT_PUBLIC_BACKEND_URL` while attaching an Auth0 access token.

Common tasks
- Build for production: `npm run build`
- Start production server: `npm start`
- Run lint: `npm run lint`

Troubleshooting
- If you see missing environment variable errors, confirm `.env.local` is present and variables are set.
- Ensure your Auth0 Application is a "Regular Web Application" and callback/logout URLs match what's configured.
- If sessions aren't persisting, confirm `AUTH0_SECRET` is a 32-byte hex string and `APP_BASE_URL` matches the site URL.

API reference & structure
- `app/` — Next.js app router pages/components
- `components/` — React components (landing page at `components/landing/landing-page.tsx`)
- `lib/auth0.ts` — Auth0 client used by server components and middleware
- `middleware.ts` — mounts the Auth0 middleware that manages rolling sessions
- `app/api/my-proxy/route.ts` — server API proxy that forwards requests to your backend with the access token


