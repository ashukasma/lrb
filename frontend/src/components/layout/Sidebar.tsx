import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Calendar, BarChart3, Menu } from 'lucide-react';

interface SidebarProps {
    currentPage: string;
    onPageChange: (page: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    currentPage,
    onPageChange,
    sidebarOpen,
    setSidebarOpen,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'rooms', label: 'Rooms', icon: Users, path: '/rooms' },
        { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/bookings' },
        { id: 'users', label: 'Users', icon: Users, path: '/users' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        onPageChange(path.split('/')[1] || 'dashboard');
    };

    return (
        <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
            <div className="p-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="w-full justify-start"
                >
                    <Menu className="h-5 w-5" />
                    {sidebarOpen && <span className="ml-3">Menu</span>}
                </Button>
            </div>
            <nav className="space-y-1 px-2">
                {menuItems.map((item) => (
                    <Button
                        key={item.id}
                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                        className={`w-full justify-start ${sidebarOpen ? 'px-4' : 'px-2'}`}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <item.icon className="h-5 w-5" />
                        {sidebarOpen && <span className="ml-3">{item.label}</span>}
                    </Button>
                ))}
            </nav>
        </div>
    );
}; 