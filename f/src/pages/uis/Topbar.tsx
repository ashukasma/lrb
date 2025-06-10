import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TopbarProps {
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (collapsed: boolean) => void;
    handleLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ isSidebarCollapsed, setIsSidebarCollapsed, handleLogout }) => (
    <header className="h-16 bg-white border-b border-violet-100 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="!rounded-button whitespace-nowrap cursor-pointer"
            >
                <i className={`fas ${isSidebarCollapsed ? 'fa-bars' : 'fa-times'} text-violet-600`}></i>
            </Button>
            <div className="flex items-center space-x-2">
                <i className="fas fa-calendar-check text-violet-600 text-xl"></i>
                <h1 className="text-xl font-semibold text-violet-900">Room Booker</h1>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-sm text-gray-600">Today: June 7, 2025</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full !rounded-button whitespace-nowrap cursor-pointer">
                        <Avatar>
                            <AvatarImage src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20person%20with%20a%20friendly%20smile%2C%20well-groomed%20appearance%2C%20wearing%20business%20casual%20attire.%20The%20photo%20has%20a%20clean%2C%20neutral%20background%20with%20soft%20lighting%20that%20highlights%20facial%20features.%20The%20image%20conveys%20approachability%20and%20confidence%20in%20a%20corporate%20setting&width=100&height=100&seq=2&orientation=squarish" alt="User" />
                            <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem>Notifications</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-rose-600 cursor-pointer">
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
);

export default Topbar; 