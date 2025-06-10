import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Room {
    id: number;
    name: string;
    status: string;
    capacity: number;
    location: string;
    phoneNumber: string;
    bookedBy?: string;
    reason?: string;
}

interface DashboardProps {
    rooms: Room[];
    handleBookRoom: (room: Room) => void;
    isBookingModalOpen: boolean;
    setIsBookingModalOpen: (open: boolean) => void;
    selectedRoom: Room | null;
}

const Dashboard: React.FC<DashboardProps> = ({ rooms, handleBookRoom, isBookingModalOpen, setIsBookingModalOpen, selectedRoom }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Available Rooms</h2>
            <div className="flex space-x-2">
                <div className="relative w-64">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <i className="fas fa-search"></i>
                    </span>
                    <Input
                        placeholder="Search rooms..."
                        className="pl-10 w-full"
                    />
                </div>
                <Button className="!rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-filter mr-2"></i> Filter
                </Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{room.name}</CardTitle>
                            <Badge className={room.status === "available" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}>
                                {room.status === "available" ? "Available" : "Booked"}
                            </Badge>
                        </div>
                        <CardDescription>
                            Capacity: {room.capacity} people
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="h-40 mb-4 rounded-md overflow-hidden">
                            <img
                                src={`https://readdy.ai/api/search-image?query=Modern%20office%20meeting%20room%20with%20clean%20design%2C%20featuring%20a%20conference%20table%2C%20comfortable%20chairs%2C%20large%20windows%20with%20natural%20light%2C%20and%20state-of-the-art%20presentation%20equipment.%20The%20room%20has%20a%20professional%20atmosphere%20with%20subtle%20decor%20and%20organized%20layout%2C%20perfect%20for%20business%20meetings&width=400&height=200&seq=${room.id}&orientation=landscape`}
                                alt={room.name}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        {room.status === "booked" && (
                            <div className="mb-3 p-3 bg-violet-50 rounded-md">
                                <p className="text-sm font-medium text-violet-900">Booked by: {room.bookedBy}</p>
                                <p className="text-sm text-violet-600">Reason: {room.reason}</p>
                            </div>
                        )}
                        <div className="flex space-x-2 text-sm text-gray-600">
                            <span className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-1"></i> {room.location}
                            </span>
                            <span className="flex items-center">
                                <i className="fas fa-phone mr-1"></i> {room.phoneNumber.slice(-4)}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full !rounded-button whitespace-nowrap cursor-pointer"
                            disabled={room.status !== "available"}
                            onClick={() => handleBookRoom(room)}
                        >
                            {room.status === "available" ? "Book Now" : "Currently Booked"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
        {/* Booking Modal */}
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Book {selectedRoom?.name}</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to book this room.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <Input id="date" type="date" className="col-span-3" defaultValue="2025-06-07" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time-slot" className="text-right">
                            Time Slot
                        </Label>
                        <Select defaultValue="15">
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">
                            Reason
                        </Label>
                        <Select defaultValue="meeting">
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="meeting">Team Meeting</SelectItem>
                                <SelectItem value="interview">Interview</SelectItem>
                                <SelectItem value="client">Client Meeting</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Input id="notes" className="col-span-3" placeholder="Any special requirements?" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBookingModalOpen(false)} className="!rounded-button whitespace-nowrap cursor-pointer">
                        Cancel
                    </Button>
                    <Button className="!rounded-button whitespace-nowrap cursor-pointer">Confirm Booking</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
);

export default Dashboard; 