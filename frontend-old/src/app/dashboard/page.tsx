"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DashboardLayout from '@/components/DashboardLayout';

interface Room {
  id: number;
  name: string;
  is_working: number;
  bookedBy?: string;
  purpose?: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
      return;
    }

    // Fetch rooms
    axios.get(`${API_URL}/api/rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRooms(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.replace('/');
      });
  }, [router, API_URL]);

  if (loading) return <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">Loading...</Box>;

  return (
    <DashboardLayout title="Room Status">
      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid component="div" xs={12} sm={6} md={4} key={room.id} sx={{ display: 'flex' }}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: room.is_working === 0 ? '#f0f7ff' : '#fff5f5',
                transition: 'box-shadow 0.2s',
                boxShadow: 3,
                '&:hover': { boxShadow: 8, transform: 'translateY(-2px)' },
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: room.is_working === 0 ? '#e3f2fd' : '#ffebee'
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {room.is_working === 0 ? (
                  <CheckCircleIcon sx={{ color: '#2196f3' }} />
                ) : (
                  <CancelIcon sx={{ color: '#f44336' }} />
                )}
                <Typography variant="h6" noWrap color={room.is_working === 0 ? '#1976d2' : '#d32f2f'}>
                  {room.name}
                </Typography>
              </Box>
              <Typography variant="body2" color={room.is_working === 0 ? '#2196f3' : '#f44336'} mb={1}>
                Status: {room.is_working === 0 ? 'Available' : 'Not Working'}
              </Typography>
              {room.is_working !== 0 && (
                <Box mt="auto">
                  <Typography variant="body2" noWrap>📌 Booked by: {room.bookedBy}</Typography>
                  <Typography variant="body2" noWrap>📄 Purpose: {room.purpose}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
}