
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calendar, Clock, TrendingUp, Download, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const roomUtilizationData = [
  { room: 'Alpha', utilization: 85, bookings: 45 },
  { room: 'Beta', utilization: 72, bookings: 38 },
  { room: 'Executive', utilization: 65, bookings: 28 },
  { room: 'Collaboration', utilization: 91, bookings: 52 }
];

const peakHoursData = [
  { hour: '8:00', bookings: 5 },
  { hour: '9:00', bookings: 12 },
  { hour: '10:00', bookings: 18 },
  { hour: '11:00', bookings: 15 },
  { hour: '12:00', bookings: 8 },
  { hour: '13:00', bookings: 6 },
  { hour: '14:00', bookings: 20 },
  { hour: '15:00', bookings: 16 },
  { hour: '16:00', bookings: 14 },
  { hour: '17:00', bookings: 10 },
  { hour: '18:00', bookings: 4 }
];

const weeklyTrendData = [
  { week: 'Week 1', bookings: 85 },
  { week: 'Week 2', bookings: 92 },
  { week: 'Week 3', bookings: 88 },
  { week: 'Week 4', bookings: 95 }
];

const roomTypeData = [
  { name: 'Conference Rooms', value: 45, color: '#8884d8' },
  { name: 'Meeting Rooms', value: 30, color: '#82ca9d' },
  { name: 'Executive Suites', value: 25, color: '#ffc658' }
];

export const AnalyticsPage: React.FC = () => {
  const exportAnalytics = () => {
    // Create CSV content with analytics data
    const csvContent = [
      'Room,Utilization %,Total Bookings',
      ...roomUtilizationData.map(room => `${room.room},${room.utilization},${room.bookings}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'room-analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Insights into room usage patterns and booking analytics
          </p>
        </div>
        <Button onClick={exportAnalytics} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Bookings</p>
                <p className="text-3xl font-bold">163</p>
                <p className="text-sm text-blue-100">This month</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Avg Duration</p>
                <p className="text-3xl font-bold">1.5h</p>
                <p className="text-sm text-green-100">Per booking</p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Most Used</p>
                <p className="text-xl font-bold">Collaboration Hub</p>
                <p className="text-sm text-purple-100">52 bookings</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Peak Hour</p>
                <p className="text-3xl font-bold">2 PM</p>
                <p className="text-sm text-orange-100">20 bookings</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Utilization Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Room Utilization
          </CardTitle>
          <CardDescription>
            Usage statistics for each meeting room this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="room" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'utilization' ? `${value}%` : value,
                    name === 'utilization' ? 'Utilization' : 'Total Bookings'
                  ]}
                />
                <Bar dataKey="utilization" fill="#8884d8" name="utilization" />
                <Bar dataKey="bookings" fill="#82ca9d" name="bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Booking Hours</CardTitle>
            <CardDescription>
              Number of bookings throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Room Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Room Type Usage</CardTitle>
            <CardDescription>
              Distribution of bookings by room type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {roomTypeData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Booking Trends</CardTitle>
          <CardDescription>
            Booking patterns over the last 4 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="bookings" 
                  fill="url(#gradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Most/Least Used Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Most Used Rooms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roomUtilizationData
              .sort((a, b) => b.bookings - a.bookings)
              .slice(0, 3)
              .map((room, index) => (
                <div key={room.room} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Badge variant="secondary" className="mr-3">#{index + 1}</Badge>
                    <span className="font-medium">{room.room}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{room.bookings} bookings</p>
                    <p className="text-sm text-muted-foreground">{room.utilization}% utilized</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Least Used Rooms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roomUtilizationData
              .sort((a, b) => a.bookings - b.bookings)
              .slice(0, 3)
              .map((room, index) => (
                <div key={room.room} className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Badge variant="secondary" className="mr-3">#{index + 1}</Badge>
                    <span className="font-medium">{room.room}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">{room.bookings} bookings</p>
                    <p className="text-sm text-muted-foreground">{room.utilization}% utilized</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
