# CloudDrive Frontend

React + Vite client for the CloudDrive application. Provides authentication flows, file and folder management, and the dashboard UI.

## Tech stack

- React 19
- Vite 7
- Tailwind CSS 4
- React Router DOM 7
- Axios, Formik, Yup

## Features

- Auth flows (register, login, activate, forgot/reset password)
- File upload and management
- Folder navigation
- Dashboard with theme toggle

## Setup

1) Install dependencies

```bash
npm install
```

2) Create `.env`

```env
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=CloudDrive
```

3) Run the dev server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - Lint

## Project structure

```
src/
  components/
    auth/
    dashboard/
    layout/
    routing/
  context/
  hooks/
  services/
  utils/
  App.jsx
```

## SPA routing on Vercel

The app uses client-side routing. `vercel.json` includes a filesystem handler and a catch-all rewrite to `index.html` so routes like `/reset-password/:token` and `/activate/:token` work on refresh.

## API endpoints used

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/activate/:token`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `GET /api/files`
- `POST /api/files/upload`
- `GET /api/folders`
