import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, addMinutes, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

interface BookingModalProps {
  room: {
    id: string;
    name: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  open,
  onOpenChange,
}) => {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !startTime || !endTime || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      toast({
        title: "Error",
        description: "Cannot book for past dates",
        variant: "destructive",
      });
      return;
    }

    // Check if time is in the past for today's bookings
    if (date.getTime() === today.getTime()) {
      const now = new Date();
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const bookingStart = new Date();
      bookingStart.setHours(startHours, startMinutes, 0, 0);

      if (bookingStart < now) {
        toast({
          title: "Error",
          description: "Cannot book for past times",
          variant: "destructive",
        });
        return;
      }
    }

    // Check if end time is after start time
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDateTime = new Date(date);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(date);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    if (endDateTime <= startDateTime) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    // Check if booking duration is 30 minutes
    const durationInMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    if (durationInMinutes !== 30) {
      toast({
        title: "Error",
        description: "Booking duration must be exactly 30 minutes",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const employeeId = localStorage.getItem('employeeId');

      if (!token || !employeeId) {
        toast({
          title: "Error",
          description: "Please login to book a room",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.post(
        '/api/bookings',
        {
          roomId: room?.id,
          employeeId,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          title: reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Success",
        description: "Room booked successfully",
      });

      // Reset form
      setDate(undefined);
      setStartTime('');
      setEndTime('');
      setReason('');
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to book room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);

    // Automatically set end time to 30 minutes later
    if (newStartTime) {
      const [hours, minutes] = newStartTime.split(':').map(Number);
      const endDateTime = new Date();
      endDateTime.setHours(hours, minutes + 30, 0, 0);
      setEndTime(endDateTime.toTimeString().slice(0, 5));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {room?.name}</DialogTitle>
          <DialogDescription>
            Select a date and time for your booking (30 minutes duration)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
                min={date?.getTime() === new Date().setHours(0, 0, 0, 0) ? new Date().toTimeString().slice(0, 5) : "00:00"}
                step="1800" // 30 minutes in seconds
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min={startTime || "00:00"}
                step="1800" // 30 minutes in seconds
                disabled
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter booking reason"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Booking..." : "Book Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
