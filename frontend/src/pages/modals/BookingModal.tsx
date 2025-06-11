import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate time slots for full 24 hours
  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isToday = date?.getTime() === new Date().setHours(0, 0, 0, 0);

    const formatTimeSlot = (hour: number, minute: number) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    };

    // Only generate slots between 6 AM and 9 PM
    for (let hour = 6; hour < 21; hour++) {
      // For today, only show current and future intervals
      if (isToday) {
        // Skip past hours
        if (hour < currentHour) continue;

        // For current hour, show current and future intervals
        if (hour === currentHour) {
          // If current time is before XX:30, show both current and next interval
          if (currentMinute <= 30) {
            // Show current interval (XX:01 - XX:30)
            slots.push({
              value: `${hour.toString().padStart(2, '0')}:01-${hour.toString().padStart(2, '0')}:30`,
              label: `${formatTimeSlot(hour, 1)} - ${formatTimeSlot(hour, 30)}`
            });
            // Show next interval (XX:31 - XX+1:00)
            if (hour < 20) { // Don't add next interval if it would go past 9 PM
              slots.push({
                value: `${hour.toString().padStart(2, '0')}:31-${(hour + 1).toString().padStart(2, '0')}:00`,
                label: `${formatTimeSlot(hour, 31)} - ${formatTimeSlot(hour + 1, 0)}`
              });
            }
          } else {
            // If current time is after XX:30, show only next interval
            if (hour < 20) { // Don't add next interval if it would go past 9 PM
              slots.push({
                value: `${hour.toString().padStart(2, '0')}:31-${(hour + 1).toString().padStart(2, '0')}:00`,
                label: `${formatTimeSlot(hour, 31)} - ${formatTimeSlot(hour + 1, 0)}`
              });
            }
          }
          continue;
        }
      }

      // For future hours or future dates, show both slots
      slots.push({
        value: `${hour.toString().padStart(2, '0')}:01-${hour.toString().padStart(2, '0')}:30`,
        label: `${formatTimeSlot(hour, 1)} - ${formatTimeSlot(hour, 30)}`
      });
      if (hour < 20) { // Don't add next interval if it would go past 9 PM
        slots.push({
          value: `${hour.toString().padStart(2, '0')}:31-${(hour + 1).toString().padStart(2, '0')}:00`,
          label: `${formatTimeSlot(hour, 31)} - ${formatTimeSlot(hour + 1, 0)}`
        });
      }
    }
    return slots;
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !selectedTimeSlot || !reason) {
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
      const [startTime] = selectedTimeSlot.split('-');
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const bookingStart = new Date();
      bookingStart.setHours(startHours, startMinutes, 0, 0);

      // Get current hour and minute
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // If booking is for current hour
      if (startHours === currentHour) {
        // If current time is before XX:30, allow current and next interval
        if (currentMinute <= 30) {
          if (startMinutes !== 1 && startMinutes !== 31) {
            toast({
              title: "Error",
              description: "For current hour, you can only book the current or next interval",
              variant: "destructive",
            });
            return;
          }
        } else {
          // If current time is after XX:30, only allow next interval
          if (startMinutes !== 31) {
            toast({
              title: "Error",
              description: "For current hour, you can only book the next interval",
              variant: "destructive",
            });
            return;
          }
        }
      } else if (bookingStart < now) {
        toast({
          title: "Error",
          description: "Cannot book for past times",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate booking time is within allowed hours (6 AM - 9 PM)
    const [startTime] = selectedTimeSlot.split('-');
    const [startHours] = startTime.split(':').map(Number);
    if (startHours < 6 || startHours >= 21) {
      toast({
        title: "Error",
        description: "Bookings are only allowed between 6:00 AM and 9:00 PM",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user').id;

      if (!token || !userId) {
        toast({
          title: "Error",
          description: "Please login to book a room",
          variant: "destructive",
        });
        return;
      }

      const [startTime, endTime] = selectedTimeSlot.split('-');
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);

      // Create start date with proper time
      const startDateTime = new Date(date);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      // Create end date with proper time
      const endDateTime = new Date(date);
      // Handle case where end time is on the next day (e.g., 23:31-00:00)
      if (endHours < startHours) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      // Validate that end time is after start time
      if (endDateTime <= startDateTime) {
        toast({
          title: "Error",
          description: "End time must be after start time",
          variant: "destructive",
        });
        return;
      }

      const url = `${import.meta.env.VITE_API_URL}/bookings`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: room?.id,
          userId,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          title: reason
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to book room. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Room booked successfully for ${format(startDateTime, 'MMM dd, yyyy')} at ${format(startDateTime, 'h:mm a')} - ${format(endDateTime, 'h:mm a')}`,
      });

      // Reset form
      setDate(undefined);
      setSelectedTimeSlot('');
      setReason('');
      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
          ? String(error.response.data.message)
          : "Failed to book room. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <div className="space-y-2">
            <Label>Time Slot</Label>
            <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {timeSlots.map((slot) => (
                  <SelectItem
                    key={slot.value}
                    value={slot.value}
                    className="cursor-pointer hover:bg-accent"
                  >
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
