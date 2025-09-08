# KhanFlow

Full‑stack meeting scheduling (React + Node + PostgreSQL) with calendar/video integrations.

<img width="1784" height="988" alt="image" src="https://github.com/user-attachments/assets/f060a017-df50-4e96-86bb-91148531ef68" />


## Quick start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 12 (e.g. via Homebrew: `brew install postgresql@16 && brew services start postgresql@16`)

### 1) Clone & install
```bash
git clone https://github.com/yourusername/khanflow.git
cd khanflow
cd backend && npm install
cd ../frontend && npm install
```

### 2) Environment
Create `.env` files in `backend/` and `frontend/`.

backend/.env
```env
DATABASE_URL=postgresql://username:password@localhost:5432/khanflow
PORT=8000
NODE_ENV=development
BASE_PATH=/api

JWT_SECRET=your-super-secret
JWT_EXPIRES_IN=7d

FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_INTEGRATION_URL=http://localhost:5173/app/integrations

# OAuth (optional for integrations)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8000/api/integration/google/callback

MS_CLIENT_ID=...
MS_CLIENT_SECRET=...
MS_REDIRECT_URI=http://localhost:8000/api/integration/microsoft/callback

ZOOM_CLIENT_ID=...
ZOOM_CLIENT_SECRET=...
ZOOM_REDIRECT_URI=http://localhost:8000/api/integration/zoom/callback
```

frontend/.env
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APP_ORIGIN=http://localhost:5173
```

### 3) Database & migrations
```bash
createdb khanflow            # or: psql -d postgres -c "CREATE DATABASE khanflow;"
cd ../backend && npm run db:migrate
```

### 4) Run
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open the app: http://localhost:5173 (API at http://localhost:8000/api)

## OAuth quick notes
- Google Cloud Console → OAuth client (Web)
  - JS origin: `http://localhost:5173`
  - Redirect: `http://localhost:8000/api/integration/google/callback`
- Azure AD App Registration
  - Redirect: `http://localhost:8000/api/integration/microsoft/callback`
- Zoom Marketplace → OAuth app
  - Redirect: `http://localhost:8000/api/integration/zoom/callback`

## Scripts
- Backend: `npm run dev`, `npm run db:migrate`, `npm run build`, `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Troubleshooting
- Postgres SSL errors locally: ensure local DB is used; dev config disables SSL.

---
Made with ❤️ by Khan
