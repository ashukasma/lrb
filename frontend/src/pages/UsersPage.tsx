
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, Download, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const sampleUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@lucent.com",
    phone: "+1-555-0101"
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@lucent.com",
    phone: "+1-555-0102"
  },
  {
    id: 3,
    name: "John Doe",
    email: "john.doe@lucent.com",
    phone: "+1-555-0103"
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.wilson@lucent.com",
    phone: "+1-555-0104"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@lucent.com",
    phone: "+1-555-0105"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.anderson@lucent.com",
    phone: "+1-555-0106"
  }
];

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [csvData, setCsvData] = useState('');
  const [showCsvImport, setShowCsvImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddUser = () => {
    if (!userForm.name || !userForm.email || !userForm.phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newUser = {
      ...userForm,
      id: users.length + 1
    };
    setUsers([...users, newUser]);
    setUserForm({ name: '', email: '', phone: '' });
    setShowAddUser(false);
    toast({
      title: "User Added",
      description: `${userForm.name} has been added successfully`,
    });
  };

  const handleCsvImport = () => {
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      const nameIndex = headers.indexOf('name');
      const emailIndex = headers.indexOf('email');
      const phoneIndex = headers.indexOf('phone');

      if (nameIndex === -1 || emailIndex === -1 || phoneIndex === -1) {
        toast({
          title: "Error",
          description: "CSV must contain 'name', 'email', and 'phone' columns",
          variant: "destructive"
        });
        return;
      }

      const newUsers = [];
      let validCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length >= 3 && values[nameIndex] && values[emailIndex] && values[phoneIndex]) {
          newUsers.push({
            id: users.length + newUsers.length + 1,
            name: values[nameIndex],
            email: values[emailIndex],
            phone: values[phoneIndex]
          });
          validCount++;
        } else {
          errorCount++;
        }
      }

      setUsers([...users, ...newUsers]);
      setCsvData('');
      setShowCsvImport(false);
      
      toast({
        title: "Import Complete",
        description: `${validCount} users imported successfully. ${errorCount} rows had errors.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Please check your CSV format and try again",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const exportToCsv = () => {
    const csvContent = [
      'Name,Email,Phone',
      ...users.map(user => `${user.name},${user.email},${user.phone}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
          <p className="text-muted-foreground">
            Manage users who can book meeting rooms
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={showCsvImport} onOpenChange={setShowCsvImport}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Import Users from CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with columns: Name, Email, Phone
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Upload CSV File</Label>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                </div>
                <div>
                  <Label>Or paste CSV data</Label>
                  <textarea
                    className="w-full h-32 p-3 border rounded-md resize-none"
                    placeholder="Name,Email,Phone&#10;John Doe,john@example.com,+1234567890"
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>CSV format example:</p>
                  <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded block mt-1">
                    Name,Email,Phone<br/>
                    John Doe,john@example.com,+1234567890<br/>
                    Jane Smith,jane@example.com,+0987654321
                  </code>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowCsvImport(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCsvImport} disabled={!csvData}>
                  Import Users
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account for room booking access.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users List ({filteredUsers.length})</CardTitle>
          <CardDescription>
            All registered users who can book meeting rooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
