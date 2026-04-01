# GyãnSetu - Real-Time Chat Application

<p align="center">
	<img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React + Vite" />
	<img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node + Express" />
	<img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
	<img src="https://img.shields.io/badge/Realtime-Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
</p>

A full-stack real-time chat platform with secure authentication, Google OAuth login, live online-user tracking, image sharing, and a modern responsive UI.

## Features

- ⚡ Real-time messaging with Socket.IO
- 🔐 JWT authentication with HTTP-only cookies
- 🧑 Profile image upload via Cloudinary
- 🌐 Google OAuth redirect-based sign in
- 🟢 Live online user presence
- 📨 Message history for one-to-one chats
- 📱 Responsive React UI with Tailwind CSS + DaisyUI

## Tech Stack

### Frontend
- ⚛️ React 18
- ⚡ Vite
- 🧭 React Router
- 🗂️ Zustand (state management)
- 🎨 Tailwind CSS + DaisyUI
- 🔔 React Hot Toast

### Backend
- 🟩 Node.js
- 🚂 Express.js
- 🍃 MongoDB + Mongoose
- 🔑 JSON Web Tokens (JWT)
- ☁️ Cloudinary
- 🔌 Socket.IO

## Project Structure

```text
GyaanSetu/
|- backend/      # Express API, auth, socket server, MongoDB integration
|- frontend/     # React app (Vite), UI components, Zustand stores
|- README.md
```

## Getting Started

## 1) Prerequisites

- Node.js 18+
- npm 9+
- MongoDB database (Atlas or local)
- Cloudinary account
- Google OAuth credentials (optional but recommended)

## 2) Install Dependencies

From the project root:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## 3) Environment Variables

Create [backend/.env](backend/.env) with the following values:

```env
PORT=5001
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5001/api/auth/google/callback
```

## 4) Run the App (Development)

Run backend and frontend in separate terminals:

```bash
# Terminal 1
npm run dev --prefix backend

# Terminal 2
npm run dev --prefix frontend
```

App URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api

## Available Scripts

### Root

```bash
npm run build   # installs backend/frontend deps and builds frontend
npm run start   # starts backend server
```

### Backend

```bash
npm run dev --prefix backend
npm run start --prefix backend
```

### Frontend

```bash
npm run dev --prefix frontend
npm run build --prefix frontend
npm run preview --prefix frontend
npm run lint --prefix frontend
```

## API Overview

### Auth Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `PUT /api/auth/update-profile` (protected)
- `GET /api/auth/check` (protected)
- `GET /api/auth/google/redirect`
- `GET /api/auth/google/callback`

### Message Routes

- `GET /api/messages/users` (protected)
- `GET /api/messages/:id` (protected)
- `POST /api/messages/send/:id` (protected)

## Production Notes

- In production, backend serves the frontend build from `frontend/dist`.
- Ensure `NODE_ENV=production` when deploying.
- Update CORS/frontend URL settings to match your deployed domain.

## Troubleshooting

- If login fails, verify `JWT_SECRET` and cookie settings.
- If images fail to upload, verify Cloudinary credentials.
- If Google login fails, verify OAuth redirect URI matches exactly.
- If real-time updates do not appear, ensure backend and frontend are running on expected ports.

## Author

Built with care by Kushal Patel and team.