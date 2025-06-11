import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/pages/modals/BookingModal';
import { Calendar, Users, Tv, Monitor, Layout, Clock, Building2, Phone, Sofa, CheckCircle2, XCircle } from 'lucide-react';
import { useRooms } from '@/hooks/useRooms';

interface Room {
  id: string;
  name: string;
  capacity: string;
  location: string;
  phone: string;
  noOfChairs: string;
  hasTV: number;
  hasMonitor: number;
  hasBoard: number;
  isWorking: number;
}

const recentBookings = [
  {
    id: 1,
    room: "Conference Room Alpha",
    bookedBy: "Sarah Johnson",
    date: "2024-06-09",
    time: "09:00 - 10:30",
    reason: "Team standup meeting"
  },
  {
    id: 2,
    room: "Meeting Room Beta",
    bookedBy: "Mike Chen",
    date: "2024-06-08",
    time: "14:00 - 15:00",
    reason: "Client presentation"
  },
  {
    id: 3,
    room: "Executive Suite",
    bookedBy: "John Doe",
    date: "2024-06-08",
    time: "10:00 - 12:00",
    reason: "Board meeting"
  },
  {
    id: 4,
    room: "Collaboration Hub",
    bookedBy: "Emma Wilson",
    date: "2024-06-07",
    time: "16:00 - 17:30",
    reason: "Project planning"
  },
  {
    id: 5,
    room: "Conference Room Alpha",
    bookedBy: "David Brown",
    date: "2024-06-07",
    time: "11:00 - 12:00",
    reason: "Code review"
  }
];

export const Dashboard: React.FC = () => {
  const { rooms, isLoading, error } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading rooms: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of our meeting rooms.
        </p>
      </div>

      {/* Room Cards */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Available Rooms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  {room.isWorking ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <CardDescription className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  {room.capacity} people • {room.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{room.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{room.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Sofa className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{room.noOfChairs} chairs</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-1 text-xs ${room.hasTV === 1 ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'} px-2 py-1 rounded`}>
                    <Tv className={`w-4 h-4 ${room.hasTV === 1 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                    TV
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${room.hasMonitor === 1 ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'} px-2 py-1 rounded`}>
                    <Monitor className={`w-4 h-4 ${room.hasMonitor === 1 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                    Monitor
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${room.hasBoard === 1 ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'} px-2 py-1 rounded`}>
                    <Layout className={`w-4 h-4 ${room.hasBoard === 1 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                    Board
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => handleBookRoom(room)}
                  disabled={!room.isWorking}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Bookings
          </CardTitle>
          <CardDescription>
            Latest 5 room bookings across the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{booking.room}</p>
                      <p className="text-sm text-muted-foreground">
                        Booked by {booking.bookedBy}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{booking.date}</p>
                  <p className="text-sm text-muted-foreground">{booking.time}</p>
                </div>
                <div className="ml-4 max-w-xs">
                  <p className="text-sm text-muted-foreground truncate">
                    {booking.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <BookingModal
        room={selectedRoom}
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
      />
    </div>
  );
};
