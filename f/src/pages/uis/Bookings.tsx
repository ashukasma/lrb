import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Booking {
    id: number;
    roomName: string;
    bookedBy: string;
    date: string;
    time: string;
    reason: string;
}

interface BookingsProps {
    pastBookings: Booking[];
}

const Bookings: React.FC<BookingsProps> = ({ pastBookings }) => (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Past Bookings</h2>
            <div className="w-full md:w-auto flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="start-date">From:</Label>
                    <Input id="start-date" type="date" className="w-auto" />
                </div>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="end-date">To:</Label>
                    <Input id="end-date" type="date" className="w-auto" />
                </div>
                <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-filter mr-2"></i>
                    Filter
                </Button>
            </div>
        </div>
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Room Name</TableHead>
                            <TableHead>Booked By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pastBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell className="font-medium">{booking.roomName}</TableCell>
                                <TableCell>{booking.bookedBy}</TableCell>
                                <TableCell>{booking.date}</TableCell>
                                <TableCell>{booking.time}</TableCell>
                                <TableCell>{booking.reason}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                            <i className="fas fa-eye"></i>
                                        </Button>
                                        <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                            <i className="fas fa-copy"></i>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
);

export default Bookings; 