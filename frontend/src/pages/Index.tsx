import React, { useState } from 'react';
import { LoginScreen } from '@/pages/auth/LoginScreen';
import { MainLayout } from '@/components/layout/MainLayout';

interface User {
  name: string;
  email: string;
  phone: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <MainLayout user={user} onLogout={handleLogout} />;
};

export default Index;
