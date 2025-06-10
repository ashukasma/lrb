import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Rooms from './Rooms';
import Bookings from './Bookings';
import Users from './Users';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const mockRooms = [
    { id: 1, name: "Executive Suite", status: "available", capacity: 8, location: "Floor 2", phoneNumber: "123-456-7890", chairs: 8, hasTV: true, hasMonitor: true, hasBoard: true, isWorking: true },
    { id: 2, name: "Conference Room A", status: "booked", bookedBy: "John Smith", reason: "Quarterly Meeting", capacity: 12, location: "Floor 1", phoneNumber: "123-456-7891", chairs: 12, hasTV: true, hasMonitor: true, hasBoard: true, isWorking: true },
    { id: 3, name: "Meeting Room 101", status: "available", capacity: 4, location: "Floor 1", phoneNumber: "123-456-7892", chairs: 4, hasTV: false, hasMonitor: true, hasBoard: true, isWorking: true },
    { id: 4, name: "Brainstorm Room", status: "booked", bookedBy: "Sarah Johnson", reason: "Product Design", capacity: 6, location: "Floor 3", phoneNumber: "123-456-7893", chairs: 6, hasTV: true, hasMonitor: true, hasBoard: true, isWorking: true },
    { id: 5, name: "Interview Room 1", status: "available", capacity: 3, location: "Floor 2", phoneNumber: "123-456-7894", chairs: 3, hasTV: false, hasMonitor: true, hasBoard: false, isWorking: true },
    { id: 6, name: "Training Room", status: "available", capacity: 20, location: "Floor 4", phoneNumber: "123-456-7895", chairs: 20, hasTV: true, hasMonitor: true, hasBoard: true, isWorking: true },
    { id: 7, name: "Quiet Room", status: "booked", bookedBy: "Michael Brown", reason: "Client Call", capacity: 2, location: "Floor 3", phoneNumber: "123-456-7896", chairs: 2, hasTV: false, hasMonitor: true, hasBoard: false, isWorking: true },
    { id: 8, name: "Boardroom", status: "available", capacity: 16, location: "Floor 5", phoneNumber: "123-456-7897", chairs: 16, hasTV: true, hasMonitor: true, hasBoard: true, isWorking: true },
];
const mockPastBookings = [
    { id: 1, roomName: "Executive Suite", bookedBy: "John Smith", date: "2025-06-01", time: "09:00 - 10:00", reason: "Team Meeting" },
    { id: 2, roomName: "Conference Room A", bookedBy: "Sarah Johnson", date: "2025-06-02", time: "14:00 - 15:30", reason: "Client Presentation" },
    { id: 3, roomName: "Meeting Room 101", bookedBy: "Michael Brown", date: "2025-06-03", time: "11:00 - 11:30", reason: "Interview" },
    { id: 4, roomName: "Brainstorm Room", bookedBy: "Emily Davis", date: "2025-06-04", time: "13:00 - 14:00", reason: "Product Planning" },
    { id: 5, roomName: "Boardroom", bookedBy: "Robert Wilson", date: "2025-06-05", time: "15:00 - 16:00", reason: "Board Meeting" },
];
const mockUsers = [
    { id: 1, name: "John Smith", email: "john.smith@example.com", phone: "123-456-7890" },
    { id: 2, name: "Sarah Johnson", email: "sarah.johnson@example.com", phone: "123-456-7891" },
    { id: 3, name: "Michael Brown", email: "michael.brown@example.com", phone: "123-456-7892" },
    { id: 4, name: "Emily Davis", email: "emily.davis@example.com", phone: "123-456-7893" },
    { id: 5, name: "Robert Wilson", email: "robert.wilson@example.com", phone: "123-456-7894" },
];

interface Room {
    id: number;
    name: string;
    status: string;
    capacity: number;
    location: string;
    phoneNumber: string;
    chairs: number;
    hasTV: boolean;
    hasMonitor: boolean;
    hasBoard: boolean;
    isWorking: boolean;
    bookedBy?: string;
    reason?: string;
}

const MainApp: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    // Get active tab from current route
    const getActiveTab = () => {
        const path = location.pathname.split('/')[1] || 'dashboard';
        return path;
    };

    // Handle tab change
    const handleTabChange = (tab: string) => {
        navigate(`/${tab}`);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    // Handle book room
    const handleBookRoom = (room: Room) => {
        setSelectedRoom(room);
        setIsBookingModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Topbar
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                handleLogout={handleLogout}
            />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    activeTab={getActiveTab()}
                    setActiveTab={handleTabChange}
                    isSidebarCollapsed={isSidebarCollapsed}
                />
                <main className="flex-1 overflow-y-auto p-6">
                    {getActiveTab() === "dashboard" && (
                        <Dashboard
                            rooms={mockRooms}
                            handleBookRoom={handleBookRoom}
                            isBookingModalOpen={isBookingModalOpen}
                            setIsBookingModalOpen={setIsBookingModalOpen}
                            selectedRoom={selectedRoom}
                        />
                    )}
                    {getActiveTab() === "rooms" && (
                        <Rooms
                            rooms={mockRooms}
                            handleBookRoom={handleBookRoom}
                            isAddRoomModalOpen={isAddRoomModalOpen}
                            setIsAddRoomModalOpen={setIsAddRoomModalOpen}
                        />
                    )}
                    {getActiveTab() === "bookings" && (
                        <Bookings pastBookings={mockPastBookings} />
                    )}
                    {getActiveTab() === "users" && (
                        <Users users={mockUsers} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default MainApp; 