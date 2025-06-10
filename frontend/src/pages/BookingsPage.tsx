
import React, { useState } from 'react';
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

const sampleBookings = [
  {
    id: 1,
    room: "Conference Room Alpha",
    user: "Sarah Johnson",
    date: "2024-06-09",
    startTime: "09:00",
    endTime: "10:30",
    reason: "Team standup meeting",
    status: "upcoming"
  },
  {
    id: 2,
    room: "Meeting Room Beta",
    user: "Mike Chen",
    date: "2024-06-08",
    startTime: "14:00",
    endTime: "15:00",
    reason: "Client presentation",
    status: "past"
  },
  {
    id: 3,
    room: "Executive Suite",
    user: "John Doe",
    date: "2024-06-08",
    startTime: "10:00",
    endTime: "12:00",
    reason: "Board meeting",
    status: "past"
  },
  {
    id: 4,
    room: "Collaboration Hub",
    user: "Emma Wilson",
    date: "2024-06-07",
    startTime: "16:00",
    endTime: "17:30",
    reason: "Project planning session with development team",
    status: "past"
  },
  {
    id: 5,
    room: "Conference Room Alpha",
    user: "David Brown",
    date: "2024-06-10",
    startTime: "11:00",
    endTime: "12:00",
    reason: "Code review",
    status: "upcoming"
  },
  {
    id: 6,
    room: "Meeting Room Beta",
    user: "Lisa Anderson",
    date: "2024-06-11",
    startTime: "15:30",
    endTime: "16:30",
    reason: "Weekly team sync",
    status: "upcoming"
  }
];

const users = ["Sarah Johnson", "Mike Chen", "John Doe", "Emma Wilson", "David Brown", "Lisa Anderson"];
const rooms = ["Conference Room Alpha", "Meeting Room Beta", "Executive Suite", "Collaboration Hub"];

export const BookingsPage: React.FC = () => {
  const [bookings] = useState(sampleBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [showPast, setShowPast] = useState(true);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = userFilter === 'all' || booking.user === userFilter;
    const matchesRoom = roomFilter === 'all' || booking.room === roomFilter;
    const matchesTimeframe = showPast || booking.status === 'upcoming';
    
    let matchesDateRange = true;
    if (dateFrom && dateTo) {
      const bookingDate = new Date(booking.date);
      matchesDateRange = bookingDate >= dateFrom && bookingDate <= dateTo;
    }
    
    return matchesSearch && matchesUser && matchesRoom && matchesTimeframe && matchesDateRange;
  });

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
                  <SelectItem key={user} value={user}>
                    {user}
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
                  <SelectItem key={room} value={room}>
                    {room}
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
                    <TableCell className="font-medium">{booking.room}</TableCell>
                    <TableCell>{booking.user}</TableCell>
                    <TableCell>{format(new Date(booking.date), "PPP")}</TableCell>
                    <TableCell>
                      {booking.startTime} - {booking.endTime}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={booking.reason}>
                      {booking.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant={booking.status === 'upcoming' ? "default" : "secondary"}>
                        {booking.status === 'upcoming' ? 'Upcoming' : 'Past'}
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
                  <h3 className="font-medium">{booking.room}</h3>
                  <Badge variant={booking.status === 'upcoming' ? "default" : "secondary"}>
                    {booking.status === 'upcoming' ? 'Upcoming' : 'Past'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">by {booking.user}</p>
                <p className="text-sm">{format(new Date(booking.date), "PPP")}</p>
                <p className="text-sm">{booking.startTime} - {booking.endTime}</p>
                <p className="text-sm text-muted-foreground">{booking.reason}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
