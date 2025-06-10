import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
}

interface RoomsProps {
    rooms: Room[];
    handleBookRoom: (room: Room) => void;
    isAddRoomModalOpen: boolean;
    setIsAddRoomModalOpen: (open: boolean) => void;
}

const Rooms: React.FC<RoomsProps> = ({ rooms, handleBookRoom, isAddRoomModalOpen, setIsAddRoomModalOpen }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Rooms</h2>
            <Button onClick={() => setIsAddRoomModalOpen(true)} className="!rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-plus mr-2"></i> Add Room
            </Button>
        </div>
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Room Name</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Chairs</TableHead>
                            <TableHead>Facilities</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.map((room) => (
                            <TableRow key={room.id}>
                                <TableCell className="font-medium">{room.name}</TableCell>
                                <TableCell>{room.capacity}</TableCell>
                                <TableCell>{room.location}</TableCell>
                                <TableCell>{room.phoneNumber}</TableCell>
                                <TableCell>{room.chairs}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        {room.hasTV && <Badge variant="outline"><i className="fas fa-tv mr-1"></i> TV</Badge>}
                                        {room.hasMonitor && <Badge variant="outline"><i className="fas fa-desktop mr-1"></i> Monitor</Badge>}
                                        {room.hasBoard && <Badge variant="outline"><i className="fas fa-chalkboard mr-1"></i> Board</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Switch id={`room-status-${room.id}`} checked={room.isWorking} />
                                        <Label htmlFor={`room-status-${room.id}`}>Working</Label>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-rose-600 !rounded-button whitespace-nowrap cursor-pointer">
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                        <Button
                                            size="sm"
                                            disabled={room.status !== "available"}
                                            onClick={() => handleBookRoom(room)}
                                            className="!rounded-button whitespace-nowrap cursor-pointer"
                                        >
                                            Book
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        {/* Add Room Modal */}
        <Dialog open={isAddRoomModalOpen} onOpenChange={setIsAddRoomModalOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new room.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="room-name">Room Name</Label>
                            <Input id="room-name" placeholder="e.g. Conference Room A" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Person Capacity</Label>
                            <Input id="capacity" type="number" min="1" placeholder="e.g. 8" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="e.g. Floor 2" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="e.g. 123-456-7890" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="chairs">Number of Chairs</Label>
                            <Input id="chairs" type="number" min="1" placeholder="e.g. 8" />
                        </div>
                        <div className="space-y-2">
                            <Label>Facilities</Label>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="flex items-center space-x-2">
                                    <Switch id="has-tv" />
                                    <Label htmlFor="has-tv">TV</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="has-monitor" />
                                    <Label htmlFor="has-monitor">Monitor</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="has-board" />
                                    <Label htmlFor="has-board">Board</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="room-image">Room Image</Label>
                        <Input id="room-image" type="file" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddRoomModalOpen(false)} className="!rounded-button whitespace-nowrap cursor-pointer">
                        Cancel
                    </Button>
                    <Button className="!rounded-button whitespace-nowrap cursor-pointer">Add Room</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
);

export default Rooms; 