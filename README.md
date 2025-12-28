# Digital Type Assessment

## Overview
- Full‑stack web app for a security‑focused “Digital Type” assessment
- Backend: `Node.js` + `Express` + `MongoDB`
- Frontend: `React` (Create React App) with a proxy to the backend
- Security features: Helmet CSP, CSRF protection, session handling, rate limiting, input sanitization, 2FA (TOTP and Email OTP)

## Repository Layout
- `src/` — Express API, middleware, models, utils, server
- `frontend/` — React app (CRA)
- `tests/` — Backend test samples (manual runner; not wired to npm scripts)
- `scripts/` — Utility scripts (e.g., `verify-assessment.js`)
- `.env.example` — Example environment variables

## Prerequisites
- `Node.js` 18+ and `npm`
- `MongoDB` running locally or available via connection string
- Windows users can optionally use `PowerShell` for `install-dependencies.ps1`

## Quick Start
1) Clone the repo
23→   - `git clone https://github.com/stormevades1031/fyp_final.git`
24→   - `cd fyp_final` (or your local directory name)
2) Install backend dependencies
   - `npm install`
   - Optional (Windows): `./install-dependencies.ps1` to install from `dependencies.txt`
3) Configure environment variables
   - Copy `.env.example` to `.env`
   - Set:
    - `PORT=5001`
     - `MONGO_URI=mongodb://localhost:27017/digital_type_assessment`
     - `JWT_SECRET=<strong_random_string>`
     - Optional:
       - `SESSION_SECRET=<another_strong_secret>`
       - `FRONTEND_URL=http://localhost:3000`
4) Start MongoDB
   - Ensure your local MongoDB service is running, or update `MONGO_URI` to a valid cluster
5) Start the backend (Express API)
   - Development: `npm run dev` (uses `nodemon`)
   - Production: `npm start`
  - Health check: `GET http://localhost:5001/api/health`
6) Start the frontend (React)
   - `cd frontend`
   - `npm install`
   - `npm start`
  - The CRA dev server runs on `http://localhost:3000` and proxies API calls to `http://localhost:5001`

## How to Run This Project (End‑to‑End)
- Terminal A (backend):
  - In repo root: `npm run dev`
- Terminal B (frontend):
  - `cd frontend && npm start`
- Open `http://localhost:3000` in the browser and use the app

## Environment Variables
- Backend `.env` (copy from `.env.example` and adjust):
- `PORT` — API port, default `5001`
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — JWT signing secret
  - `SESSION_SECRET` — Session cookie secret (recommended to set explicitly)
  - `FRONTEND_URL` — Allowed origin in production CORS
  - `NODE_ENV` — `development` or `production`
64→  - `TEST_MONGO_URI` — Optional test database for backend tests
65→
66→## Email Configuration (Gmail App Password)
67→- Recommended: use a Gmail App Password for SMTP
68→- Backend `.env`:
69→  - `GMAIL_USER=<your_gmail_address>`
70→  - `GMAIL_APP_PASSWORD=<your_16_character_app_password>`
71→- When `GMAIL_APP_PASSWORD` is set, OAuth2 variables are ignored
72→- Dev endpoints:
73→  - `GET /api/email/verify` — verify transporter readiness
74→  - `POST /api/email/test` — send a test email to `GMAIL_USER`
75→
## Key Features
- Authentication
  - Register, login, logout, refresh token via HTTP‑only cookies
  - Password strength validation and reset via token or OTP
- CSRF Protection
  - `GET /api/csrf-token` for obtaining a token; applied to sensitive routes
- Rate Limiting
  - Specific limiters for login/reset/assessment plus a general limiter
- Security Hardening
  - Helmet CSP with nonce, strict referrer policy, HSTS, sanitized inputs (`express-mongo-sanitize` + custom sanitization)
- Two‑Factor Authentication (2FA)
  - TOTP secret + QR code, backup codes, email OTP fallback
- Assessment Engine
  - Adaptive question selection, risk scoring, persona derivation, and result persistence

## API Reference (Selected)
- Auth (`/api/auth`)
  - `POST /register` — Create account
  - `POST /login` — Login; may require 2FA
  - `POST /refresh` — Refresh access token (uses `refreshToken` cookie)
  - `POST /logout` — Logout and clear cookies
  - `POST /forgot-password` — Start password reset (OTP email)
  - `POST /reset-password-with-token` — Complete reset with token
  - `PUT /reset-password` — Change password while logged in
  - `GET /me` — Current user
- Two‑Factor (`/api/two-factor`)
  - `POST /setup` — Begin TOTP setup; returns secret + QR
  - `POST /verify-setup` — Enable 2FA after token verification
  - `POST /verify` — Verify 2FA during login (`method` = `totp` | `email` | `backup`)
  - `POST /disable` — Disable 2FA (requires password)
  - `GET /status` — 2FA status + backup codes remaining
- Assessment (`/api/assessment`)
  - `GET /questions` — Question bank
  - `POST /questions/filtered` — Filtered set by profile and difficulty
  - `POST /next` — Adaptive next question
  - `POST /submit` — Submit responses (auth required)
  - `POST /submit-guest` — Evaluate responses without auth/persistence
  - `GET /results` — Latest assessment (auth)
  - `GET /history` — Assessment history (auth)
- Health
  - `GET /api/health` — Service status
  - `GET /api/csrf-token` — CSRF token endpoint

## Frontend Development Notes
- Located in `frontend/` (Create React App)
- Scripts:
  - `npm start` — Dev server at `http://localhost:3000`
  - `npm run build` — Production build
  - `npm test` — React testing (Jest via CRA)
- Proxy
- `"proxy": "http://localhost:5001"` in `frontend/package.json`

## Backend Development Notes
- Start dev server: `npm run dev`
- Start prod server: `npm start`
- Middleware and security:
  - CSP nonce generation, Helmet, CSRF guard, rate limiters, session/cookies
  - Input validation via Zod and `express-validator`
  - Sanitization with `express-mongo-sanitize` and custom sanitizer

## Tests
- Frontend: `cd frontend && npm test`
- Backend sample tests are in `tests/`; to use them:
  - Install missing dev deps (e.g., `supertest`, a test runner like `jest` or `mocha`)
  - Set `TEST_MONGO_URI` in `.env`
  - Wire up an npm script for your chosen runner
  - Example (Mocha):
    - `npm install --save-dev mocha supertest`
    - Add `"test": "mocha ./tests/**/*.js"` to `scripts` in `package.json`

## Troubleshooting
- MongoDB connection errors
  - Verify `MONGO_URI`, ensure local service is running, or use a cloud cluster
- CSRF errors
  - Ensure the frontend fetches `GET /api/csrf-token` and sends the token header
- CORS blocked in production
  - Set `FRONTEND_URL` in `.env` to the deployed frontend origin
- 2FA issues
  - Confirm time sync on device for TOTP, check email deliverability for OTP

## License
- ISC (see `package.json`)

## Acknowledgements
- Create React App, Express, Mongoose, Helmet, Zod, and others listed in `package.json`
