import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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

interface RoomFormData {
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

export const useRooms = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const baseUrl = `${import.meta.env.VITE_API_URL}/rooms`;

  const getRooms = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data } = await axios.get(baseUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
  });

  const addRoom = useMutation({
    mutationFn: async (roomData: RoomFormData) => {
      const { data } = await axios.post(baseUrl, roomData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const editRoom = useMutation({
    mutationFn: async ({ id, roomData }: { id: string; roomData: RoomFormData }) => {
      const { data } = await axios.put(`${baseUrl}/${id}`, roomData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const deleteRoom = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${baseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  return {
    rooms: getRooms.data || [],
    isLoading: getRooms.isLoading,
    error: getRooms.error,
    addRoom,
    editRoom,
    deleteRoom,
  };
}; 