import React, { useState } from 'react';
import { useRooms } from '@/hooks/useRooms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Calendar, Filter, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const RoomsPage: React.FC = () => {
  const { rooms, isLoading, error, addRoom, editRoom, deleteRoom } = useRooms();
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<{ id: string; data: typeof roomForm } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [roomForm, setRoomForm] = useState({
    name: '',
    capacity: '',
    location: '',
    phone: '',
    noOfChairs: '',
    hasTV: 0,
    hasMonitor: 0,
    hasBoard: 0,
    isWorking: 1
  });

  const resetForm = () => {
    setRoomForm({
      name: '',
      capacity: '',
      location: '',
      phone: '',
      noOfChairs: '',
      hasTV: 0,
      hasMonitor: 0,
      hasBoard: 0,
      isWorking: 1
    });
    setEditingRoom(null);
  };

  const handleAddRoom = async () => {
    try {
      await addRoom.mutateAsync(roomForm);
      toast({
        title: "Room Added",
        description: `${roomForm.name} has been added successfully`,
      });
      resetForm();
      setShowAddRoom(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add room. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditRoom = (id: string) => {
    const room = rooms.find(r => r.id === id);
    if (room) {
      setEditingRoom({
        id,
        data: {
          name: room.name,
          capacity: room.capacity,
          location: room.location,
          phone: room.phone,
          noOfChairs: room.noOfChairs,
          hasTV: room.hasTV,
          hasMonitor: room.hasMonitor,
          hasBoard: room.hasBoard,
          isWorking: room.isWorking
        }
      });
      setRoomForm({
        name: room.name,
        capacity: room.capacity,
        location: room.location,
        phone: room.phone,
        noOfChairs: room.noOfChairs,
        hasTV: room.hasTV,
        hasMonitor: room.hasMonitor,
        hasBoard: room.hasBoard,
        isWorking: room.isWorking
      });
      setShowAddRoom(true);
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    try {
      await editRoom.mutateAsync({
        id: editingRoom.id,
        roomData: roomForm
      });
      toast({
        title: "Room Updated",
        description: `${roomForm.name} has been updated successfully`,
      });
      resetForm();
      setShowAddRoom(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update room. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      await deleteRoom.mutateAsync(id);
      toast({
        title: "Room Deleted",
        description: "Room has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || room.location === locationFilter;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'working' && room.isWorking === 1) ||
      (statusFilter === 'not-working' && room.isWorking === 0);

    return matchesSearch && matchesLocation && matchesStatus;
  });

  const uniqueLocations = [...new Set(rooms.map(room => room.location))];

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-red-500">Error loading rooms</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rooms Management</h2>
          <p className="text-muted-foreground">
            Manage meeting rooms, their facilities, and availability
          </p>
        </div>
        <Dialog open={showAddRoom} onOpenChange={(open) => {
          if (!open) {
            resetForm();
          }
          setShowAddRoom(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Update room details and amenities.' : 'Create a new meeting room with all the necessary details and amenities.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={roomForm.location}
                    onChange={(e) => setRoomForm({ ...roomForm, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={roomForm.phone}
                    onChange={(e) => setRoomForm({ ...roomForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chairs">Number of Chairs</Label>
                <Input
                  id="chairs"
                  type="number"
                  value={roomForm.noOfChairs}
                  onChange={(e) => setRoomForm({ ...roomForm, noOfChairs: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasTV"
                      checked={roomForm.hasTV === 1}
                      onCheckedChange={(checked) => setRoomForm({ ...roomForm, hasTV: checked ? 1 : 0 })}
                    />
                    <Label htmlFor="hasTV">Has TV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasMonitor"
                      checked={roomForm.hasMonitor === 1}
                      onCheckedChange={(checked) => setRoomForm({ ...roomForm, hasMonitor: checked ? 1 : 0 })}
                    />
                    <Label htmlFor="hasMonitor">Has Monitor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasBoard"
                      checked={roomForm.hasBoard === 1}
                      onCheckedChange={(checked) => setRoomForm({ ...roomForm, hasBoard: checked ? 1 : 0 })}
                    />
                    <Label htmlFor="hasBoard">Has Whiteboard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isWorking"
                      checked={roomForm.isWorking === 1}
                      onCheckedChange={(checked) => setRoomForm({ ...roomForm, isWorking: checked ? 1 : 0 })}
                    />
                    <Label htmlFor="isWorking">Is Working</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => {
                setShowAddRoom(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={editingRoom ? handleUpdateRoom : handleAddRoom}>
                {editingRoom ? 'Update Room' : 'Add Room'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="not-working">Not Working</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rooms List</CardTitle>
          <CardDescription>
            Manage all meeting rooms and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Chairs</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>{room.location}</TableCell>
                      <TableCell>{room.phone}</TableCell>
                      <TableCell>{room.noOfChairs}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {room.hasTV === 1 && <Badge variant="secondary">TV</Badge>}
                          {room.hasMonitor === 1 && <Badge variant="secondary">Monitor</Badge>}
                          {room.hasBoard === 1 && <Badge variant="secondary">Board</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={room.isWorking === 1 ? "default" : "destructive"}>
                          {room.isWorking === 1 ? "Working" : "Not Working"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRoom(room.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
