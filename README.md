# Lucent Office Meeting Room Booking Portal

A modern web application for booking and managing meeting rooms at Lucent Innovation. The portal allows users to book conference rooms, manage schedules, and track usage analytics.

## Features

- Secure login with OTP verification (email or phone)
- Dashboard for booking and managing meeting rooms
- Responsive UI built with React, Vite, Tailwind CSS, and shadcn-ui
- Backend API for authentication and room management

## Project Structure

```
backend/
  db.js
  server.js
  middleware/
    auth.js
  routes/
    bookingRoutes.js
    otpRoutes.js
    roomRoutes.js
    userRoutes.js
frontend/
  src/
    App.tsx
    main.tsx
    pages/
      auth/
        LoginScreen.tsx
  public/
  index.html
  package.json
```

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend:** Node.js, Express

## Getting Started

### Prerequisites

- Node.js (use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) for easy installation)
- npm

### Setup

#### 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

#### 2. Install dependencies

```sh
# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install
```

#### 3. Configure environment variables

- Copy `.env.example` to `.env` in both `frontend/` and `backend/` and update values as needed.

#### 4. Start the development servers

```sh
# In one terminal, start the backend
cd backend
npm start

# In another terminal, start the frontend
cd frontend
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

## Deployment

- The frontend can be deployed using [Lovable](https://lovable.dev/projects/9c303eec-623f-4b93-9026-6bf304c822a8) or any static hosting provider.
- The backend can be deployed to any Node.js-compatible server.

## Custom Domain

To connect a custom domain, follow the instructions in the Lovable dashboard under Project > Settings > Domains.

## License

MIT

---

**Ashish Kasama**
**Lucent Innovation**
