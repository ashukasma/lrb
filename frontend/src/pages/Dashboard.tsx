
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookingModal } from '@/components/modals/BookingModal';
import { Calendar, Users, Tv, Monitor, Layout, Clock } from 'lucide-react';

const sampleRooms = [
  {
    id: 1,
    name: "Conference Room Alpha",
    capacity: 12,
    location: "Floor 1",
    amenities: ["TV", "Monitor", "Whiteboard"],
    available: true
  },
  {
    id: 2,
    name: "Meeting Room Beta",
    capacity: 6,
    location: "Floor 2",
    amenities: ["Monitor", "Whiteboard"],
    available: true
  },
  {
    id: 3,
    name: "Executive Suite",
    capacity: 8,
    location: "Floor 3",
    amenities: ["TV", "Monitor"],
    available: false
  },
  {
    id: 4,
    name: "Collaboration Hub",
    capacity: 15,
    location: "Floor 1",
    amenities: ["TV", "Whiteboard"],
    available: true
  }
];

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
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleBookRoom = (room: any) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'TV':
        return <Tv className="w-4 h-4" />;
      case 'Monitor':
        return <Monitor className="w-4 h-4" />;
      case 'Whiteboard':
        return <Layout className="w-4 h-4" />;
      default:
        return null;
    }
  };

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
          {sampleRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <Badge variant={room.available ? "default" : "secondary"}>
                    {room.available ? "Available" : "Occupied"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  {room.capacity} people • {room.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => handleBookRoom(room)}
                  disabled={!room.available}
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
