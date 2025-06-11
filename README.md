# Lucent Office Meeting Room Booking Portal

A modern, full-stack web application for booking and managing meeting rooms at Lucent Innovation. The portal enables users to book conference rooms, manage schedules, and track usage analytics with a secure, user-friendly interface.

---

## ✨ Features

- **Secure OTP Login:** Email or phone-based OTP authentication.
- **Room Management:** Book, edit, and delete meeting rooms.
- **Dashboard:** View and manage all bookings and room schedules.
- **Responsive UI:** Built with React, Vite, Tailwind CSS, and shadcn-ui.
- **Analytics:** Track room usage and booking trends.
- **REST API:** Node.js/Express backend for authentication and room management.

---

## 🗂️ Project Structure

```
backend/
  config/
    db.js
  middleware/
    auth.js
  routes/
    bookingRoutes.js
    otpRoutes.js
    roomRoutes.js
    userRoutes.js
  server.js

frontend/
  src/
    App.tsx
    main.tsx
    pages/
      auth/
        LoginScreen.tsx
    components/
    hooks/
  public/
  index.html
  package.json
```

---

## 🛠️ Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend:** Node.js, Express, MySQL (or compatible DB)
- **Other:** React Router, React Query, Zod, Lucide Icons

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (recommend using [nvm](https://github.com/nvm-sh/nvm))
- npm (comes with Node.js)
- MySQL or compatible database

### Setup

#### 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

#### 2. Install dependencies

```sh
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

#### 3. Configure environment variables

- Copy `.env.example` to `.env` in both `frontend/` and `backend/`.
- Update the values as needed (API URLs, DB credentials, secrets, etc.).

#### 4. Set up the database

- Create a MySQL database and user.
- Run the provided SQL migrations or schema (if available).

#### 5. Start the development servers

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

---

## 🏗️ Deployment

- **Frontend:** Deploy to any hosting provider.
- **Backend:** Deploy to any Node.js-compatible server (e.g., Azure, AWS, DigitalOcean).

---

## 🌐 Custom Domain

To connect a custom domain, follow the instructions with hosting.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## 📄 License

MIT

---

## 📄 Author

**Ashish Kasama**

**Lucent Innovation**

---
