import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/pages/modals/BookingModal';
import { Calendar, Users, Tv, Monitor, Layout, Clock, Building2, Phone, Sofa, CheckCircle2, XCircle } from 'lucide-react';
import { useRooms } from '@/hooks/useRooms';
import { format } from 'date-fns';

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

interface Booking {
  id: number;
  roomId: number;
  employeeId: string;
  startTime: string;
  endTime: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isCancelled: boolean;
  roomName: string;
  employeeName: string;
}

const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/bookings?limit=10&sortBy=startTime&sortOrder=DESC`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data.bookings);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, isLoading, error };
};

export const Dashboard: React.FC = () => {
  const { rooms, isLoading: roomsLoading, error: roomsError } = useRooms();
  const { bookings, isLoading: bookingsLoading, error: bookingsError } = useBookings();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  if (roomsLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (roomsError || bookingsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error: {roomsError?.message || bookingsError?.message}
        </div>
      </div>
    );
  }

  // Remove the sorting and filtering since it's now handled by the API
  const recentBookings = bookings;

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
            Latest 10 room bookings across the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-lg truncate">{booking.roomName}</p>
                      <p className="text-sm text-muted-foreground">
                        Booked by {booking.employeeName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center mx-4 min-w-[120px]">
                  <p className="font-medium text-center">
                    {new Date(booking.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    {new Date(booking.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })} - {new Date(booking.endTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 truncate">
                    {booking.title}
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
