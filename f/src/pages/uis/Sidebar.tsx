import React from 'react';
import { Button } from "@/components/ui/button";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isSidebarCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isSidebarCollapsed }) => (
    <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'
            } flex flex-col`}
    >
        <nav className="flex-1 py-4">
            <ul className="space-y-1 px-2">
                <li>
                    <Button
                        variant={activeTab === "dashboard" ? "default" : "ghost"}
                        className={`w-full justify-start !rounded-button whitespace-nowrap cursor-pointer ${activeTab === "dashboard" ? 'bg-violet-100 text-violet-800' : ''}`}
                        onClick={() => setActiveTab("dashboard")}
                    >
                        <i className="fas fa-th-large mr-3"></i>
                        {!isSidebarCollapsed && <span>Dashboard</span>}
                    </Button>
                </li>
                <li>
                    <Button
                        variant={activeTab === "rooms" ? "default" : "ghost"}
                        className={`w-full justify-start !rounded-button whitespace-nowrap cursor-pointer ${activeTab === "rooms" ? 'bg-indigo-100 text-indigo-800' : ''}`}
                        onClick={() => setActiveTab("rooms")}
                    >
                        <i className="fas fa-door-open mr-3"></i>
                        {!isSidebarCollapsed && <span>Rooms</span>}
                    </Button>
                </li>
                <li>
                    <Button
                        variant={activeTab === "bookings" ? "default" : "ghost"}
                        className={`w-full justify-start !rounded-button whitespace-nowrap cursor-pointer ${activeTab === "bookings" ? 'bg-indigo-100 text-indigo-800' : ''}`}
                        onClick={() => setActiveTab("bookings")}
                    >
                        <i className="fas fa-history mr-3"></i>
                        {!isSidebarCollapsed && <span>Past Bookings</span>}
                    </Button>
                </li>
                <li>
                    <Button
                        variant={activeTab === "users" ? "default" : "ghost"}
                        className={`w-full justify-start !rounded-button whitespace-nowrap cursor-pointer ${activeTab === "users" ? 'bg-indigo-100 text-indigo-800' : ''}`}
                        onClick={() => setActiveTab("users")}
                    >
                        <i className="fas fa-users mr-3"></i>
                        {!isSidebarCollapsed && <span>Users</span>}
                    </Button>
                </li>
            </ul>
        </nav>
    </aside>
);

export default Sidebar; 