import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginScreen } from '@/pages/auth/LoginScreen';
import { Dashboard } from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { RoomsPage } from "./pages/RoomsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { UsersPage } from "./pages/UsersPage";
import { BookingsPage } from "./pages/BookingsPage";
import { MainLayout } from "./pages/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginScreen onLogin={(userData) => {
              localStorage.setItem('user', JSON.stringify(userData));
              window.location.href = '/';
            }} />} />

            {/* Protected routes with MainLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
