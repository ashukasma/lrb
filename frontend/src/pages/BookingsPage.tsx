import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Filter, Search, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface Booking {
  id: number;
  roomId: number;
  employeeId: string;
  startTime: string;
  endTime: string;
  title: string;
  roomName: string;
  employeeName: string;
  isCancelled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Room {
  id: number;
  name: string;
}

interface User {
  id: string;
  name: string;
}

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [showPast, setShowPast] = useState(true);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const { toast } = useToast();

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/bookings?limit=100`,
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
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast({
          title: "Error",
          description: "Failed to fetch bookings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/rooms`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }

        const data = await response.json();
        setRooms(data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };

    fetchRooms();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUser = userFilter === 'all' || booking.employeeId === userFilter;
    const matchesRoom = roomFilter === 'all' || booking.roomId.toString() === roomFilter;
    const matchesTimeframe = showPast || new Date(booking.startTime) > new Date();

    let matchesDateRange = true;
    if (dateFrom && dateTo) {
      const bookingDate = new Date(booking.startTime);
      matchesDateRange = bookingDate >= dateFrom && bookingDate <= dateTo;
    }

    return matchesSearch && matchesUser && matchesRoom && matchesTimeframe && matchesDateRange;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bookings History</h2>
        <p className="text-muted-foreground">
          View and manage all room bookings across the organization
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roomFilter} onValueChange={setRoomFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id.toString()}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-past"
                checked={showPast}
                onCheckedChange={setShowPast}
              />
              <Label htmlFor="show-past">Include Past</Label>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Bookings List ({filteredBookings.length})
          </CardTitle>
          <CardDescription>
            All room bookings with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.roomName}</TableCell>
                    <TableCell>{booking.employeeName}</TableCell>
                    <TableCell>
                      {new Date(booking.startTime).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.startTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })} - {new Date(booking.endTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={booking.title}>
                      {booking.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.isCancelled ? "destructive" :
                            new Date(booking.startTime) > new Date() ? "default" : "secondary"
                        }
                      >
                        {booking.isCancelled ? 'Cancelled' :
                          new Date(booking.startTime) > new Date() ? 'Upcoming' : 'Past'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{booking.roomName}</h3>
                  <Badge
                    variant={
                      booking.isCancelled ? "destructive" :
                        new Date(booking.startTime) > new Date() ? "default" : "secondary"
                    }
                  >
                    {booking.isCancelled ? 'Cancelled' :
                      new Date(booking.startTime) > new Date() ? 'Upcoming' : 'Past'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">by {booking.employeeName}</p>
                <p className="text-sm">
                  {new Date(booking.startTime).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm">
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
                <p className="text-sm text-muted-foreground">{booking.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
